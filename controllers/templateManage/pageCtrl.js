const root = require.main.path;
const path = require('path');
const log4js = require('log4js');
const Client = require('ssh2-sftp-client');
const sftp = new Client();
const sftpConfig = require(path.join(root, 'config/sftp.config'));
const dbPool = require(path.join(root, 'config/db.config'));
const queryParse = require(path.join(root, 'utills/queryParse'));
const query = require(path.join(root, 'query/templateManage'));
const query2 = require(path.join(root, 'query/site'));
const logger = log4js.getLogger('access');
const log4jsConfig = path.join(root, 'config/log4js.config.json');
log4js.configure(log4jsConfig);

const pageCtrl = {
  getPageTemList: async (req, res) => {
    const connection = await dbPool.getConnection();
    try {
      const [templates, error] = await connection.query(
        query.getPageTemList(queryParse.singleQuiteParse(req.query))
      );
      for (let template of templates) {
        const [visted, error2] = await connection.query(query.getPageVistedCt(template));
        template.vistedCount = visted[0].ct;
      }
      res.status(200).send(templates);
      logger.info(`getPageTemList : ${req.query.userKey}`);
    } catch (err) {
      res.status(500).json({
        message: 'getPageTemList error : 내부 서버 오류가 발생했습니다.',
      });
      logger.error('getPageTemList error :', err);
    } finally {
      connection.release();
    }
  },
  deleteWork: async (req, res) => {
    const connection = await dbPool.getConnection();
    await sftp.connect(sftpConfig);
    try {
      const params = req.query;
      const { ptId, userId, src, popolSeq, workSeq } = params;
      await sftp.rmdir(`/web/site/${ptId}/${userId}/img/${src}`, true);
      await connection.beginTransaction();
      await connection.query(query.deleteWork(params));
      await connection.query(query.updateWorkOrder(params));
      await connection.commit();
      const [rows, error] = await connection.query(query2.getWorks(popolSeq));
      res.status(200).send({
        response: rows,
      });
      logger.info(`deleteWork userId : ${userId}, workId : ${workSeq}`);
    } catch (err) {
      await connection.rollback();
      res.status(500).json({
        message: 'deleteWork error : 내부 서버 오류가 발생했습니다.',
      });
      logger.error('deleteWork error :', err);
    } finally {
      sftp.end();
      connection.release();
    }
  },
  updatePageTem: async (req, res) => {
    const connection = await dbPool.getConnection();
    try {
      const reqJson = JSON.parse(req.body.fields);
      const files = req.files;
      const thumbnailImg = files.find((file) => file.fieldname === 'thumbnailImg');
      const profileImg = files.find((file) => file.fieldname === 'profileImg');
      const sourceDir = `/web/site/${reqJson.ptId}/${reqJson.userId}/img`;
      const thumbnailImgPath =
        thumbnailImg && decodeURIComponent(thumbnailImg.originalname)
          ? `${sourceDir}/${decodeURIComponent(thumbnailImg.originalname)}`
          : '';
      const profileImgPath =
        profileImg && decodeURIComponent(profileImg.originalname)
          ? `${sourceDir}/${decodeURIComponent(profileImg.originalname)}`
          : '';
      await sftp.connect(sftpConfig);
      const oldThumbnailPath = `${sourceDir}/${reqJson.thumbnailOld}`;
      const oldProfilePath = `${sourceDir}/${reqJson.profileOld}`;
      const directoryList = await sftp.list(sourceDir);
      const oldThumbnailExists = directoryList.some(
        (file) => file.name === `${reqJson.thumbnailOld}`
      );
      const oldProfileExists = directoryList.some((file) => file.name === `${reqJson.profileOld}`);
      // 썸네일 이미지 처리
      if (thumbnailImgPath) {
        if (oldThumbnailExists) {
          const thumbnailNeedsUpdate =
            reqJson.thumbnailOld !== decodeURIComponent(thumbnailImg.originalname);
          if (thumbnailNeedsUpdate) {
            await sftp.delete(oldThumbnailPath);
          }
        }
        await sftp.put(thumbnailImg.buffer, thumbnailImgPath);
      } else if (oldThumbnailExists) {
        await sftp.delete(oldThumbnailPath);
      }
      // 썸네일 이미지 처리
      // 프로필 이미지 처리
      if (profileImgPath) {
        if (oldProfileExists) {
          const profileNeedsUpdate =
            reqJson.profileOld !== decodeURIComponent(profileImg.originalname);
          if (profileNeedsUpdate) {
            await sftp.delete(oldProfilePath);
          }
        }
        await sftp.put(profileImg.buffer, profileImgPath);
      } else if (oldProfileExists) {
        await sftp.delete(oldProfilePath);
      }
      // 프로필 이미지 처리
      // html 메타태그 수정
      let dataBuffer = await sftp.get(`/web/site/${reqJson.ptId}/${reqJson.userId}/index.html`);
      let data = dataBuffer.toString();
      data = data.replace(
        new RegExp(`<meta\\s+name\\s*=\\s*"author"\\s+content=".*?"\\s*\\/>`),
        `<meta name="author" content="${reqJson?.fakeName}" \/>`
      );
      data = data.replace(
        new RegExp(`<meta\\s+name\\s*=\\s*"description"\\s+content=".*?"\\s*\\/>`),
        `<meta name="description" content="${reqJson?.popolName}" \/>`
      );
      data = data.replace(
        new RegExp(`<meta\\s+property\\s*=\\s*"og:image"\\s+content\\s*=\\s*"[^"]*?"\\s*\\/>`),
        `<meta property="og:image" content="./img/${reqJson?.thumbnail}" \/>`
      );
      data = data.replace(
        new RegExp(`<meta\\s+property\\s*=\\s*"og:title"\\s+content\\s*=\\s*"[^"]*?"\\s*\\/>`),
        `<meta property="og:title" content="${reqJson?.title.replace('\n', ' ')}" \/>`
      );
      data = data.replace(
        new RegExp(
          `<meta\\s+property\\s*=\\s*"og:description"\\s+content\\s*=\\s*"[^"]*?"\\s*\\/>`
        ),
        `<meta property="og:description" content="${reqJson?.popolName}" \/>`
      );
      data = data.replace(
        new RegExp(`<meta\\s+property\\s*=\\s*"og:site_name"\\s+content\\s*=\\s*"[^"]*?"\\s*\\/>`),
        `<meta property="site_name" content="${reqJson?.popolName}" \/>`
      );
      console.log(reqJson?.popolName);
      data = data.replace(
        new RegExp(`<title>.*?<\/title>`),
        `<title>${reqJson?.popolName}</title>`
      );
      await sftp.put(Buffer.from(data), `/web/site/${reqJson.ptId}/${reqJson.userId}/index.html`);
      // html 메타태그 수정
      await connection.query(query.updatePageTem(queryParse.singleQuiteParse(reqJson)));
      for (let i = 0; i < reqJson.workList.length; i++) {
        await connection.query(query.updateWorkOrder2(reqJson.workList[i], i));
      }
      res.status(200).send(true);
      logger.info(`updatePageTem : ${reqJson.userId}, ${reqJson.ptId}`);
    } catch (err) {
      res.status(500).json({
        message: 'updatePageTem error : 내부 서버 오류가 발생했습니다.',
      });
      logger.error('updatePageTem error :', err);
    } finally {
      sftp.end();
      connection.release();
    }
  },
  addOrUpdateWork: async (req, res) => {
    const connection = await dbPool.getConnection();
    try {
      const reqJson = JSON.parse(req.body.fields);
      const files = req.files;
      const titleImg = files.find((file) => file.fieldname === 'titleImg');
      const posterImg = files.find((file) => file.fieldname === 'posterImg');
      const sourceDir = `/web/site/${reqJson.ptId}/${reqJson.userId}/img/`;
      await sftp.connect(sftpConfig);
      if (reqJson.state === '추가') {
        reqJson.src = String(reqJson.workId) + '_' + String(new Date().getTime());
        await sftp.mkdir(sourceDir + reqJson.src, true);
        titleImg && (await sftp.put(titleImg.buffer, sourceDir + reqJson.src + '/' + reqJson.logo));
        posterImg && (await sftp.put(posterImg.buffer, sourceDir + reqJson.src + '/' + reqJson.poster));
        await sftp.put(posterImg.buffer, sourceDir + reqJson.src + '/' + reqJson.poster);
        sftp.end();
        const connection = await dbPool.getConnection();
        const [rows, error] = await connection.query(query.seletWorkOrder(reqJson));
        reqJson.order = rows[0]['max_order'];
        const [rows2, error2] = await connection.query(
          query.addWork(queryParse.singleQuiteParse(reqJson))
        );
        reqJson.workSeq = rows2.insertId;
        res.status(200).send({
          response: reqJson,
        });
      } else if (reqJson.state === '수정') {
        if (!posterImg) {
          if (reqJson.posterImgOld !== 'none') {
            await sftp.delete(`${sourceDir}${reqJson.src}/${reqJson.posterImgOld}`);
          }
        } else {
          if (reqJson.posterImgOld !== 'none') {
            if (reqJson.posterImgOld !== decodeURIComponent(posterImg.originalname)) {
              await sftp.delete(`${sourceDir}${reqJson.src}/${reqJson.posterImgOld}`);
              await sftp.put(
                posterImg.buffer,
                sourceDir + reqJson.src + '/' + decodeURIComponent(posterImg.originalname)
              );
            }
          } else {
            await sftp.put(
              posterImg.buffer,
              sourceDir + reqJson.src + '/' + decodeURIComponent(posterImg.originalname)
            );
          }
        }
        if (!titleImg) {
          if (reqJson.titleImgOld !== 'none') {
            await sftp.delete(`${sourceDir}${reqJson.src}/${reqJson.titleImgOld}`);
          }
        } else {
          if (reqJson.titleImgOld !== 'none') {
            if (reqJson.titleImgOld !== decodeURIComponent(titleImg.originalname)) {
              await sftp.delete(`${sourceDir}${reqJson.src}/${reqJson.titleImgOld}`);
              await sftp.put(
                titleImg.buffer,
                sourceDir + reqJson.src + '/' + decodeURIComponent(titleImg.originalname)
              );
            }
          } else {
            await sftp.put(
              titleImg.buffer,
              sourceDir + reqJson.src + '/' + decodeURIComponent(titleImg.originalname)
            );
          }
        }
        await connection.query(query.updateWork(queryParse.singleQuiteParse(reqJson)));
        connection.release();
        res.status(200).send({
          response: reqJson,
        });
      }
      logger.info(`addOrUpdateWork ${reqJson.state} : ${reqJson.userId}, ${reqJson.ptId}`);
    } catch (err) {
      res.status(500).json({
        message: 'addOrUpdateWork error : 내부 서버 오류가 발생했습니다.',
      });
      logger.error('addOrUpdateWork error :', err);
    } finally {
      sftp.end();
      connection.release();
    }
  },
};

module.exports = pageCtrl;
