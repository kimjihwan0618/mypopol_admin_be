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

const siteCtrl = {
  getPageTemList: async (req, res) => {
    const connection = await dbPool.getConnection();
    try {
      const [templates, error] = await connection.query(query.getPageTemList(queryParse.singleQuiteParse(req.query)))
      for (let template of templates) {
        const [visted, error2] = await connection.query(query.getPageVistedCt(template))
        template.vistedCount = visted[0].ct;
      }
      res.status(200).send(templates);
      logger.info(`getPageTemList : ${req.query.userKey}`);
    } catch (err) {
      res.status(500).json({
        message: 'getPageTemList error : 내부 서버 오류가 발생했습니다.',
        timestamp: new Date(),
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
      sftp.end();
      await connection.beginTransaction();
      await connection.query(query.deleteWork(params))
      await connection.query(query.updateWorkOrder(params))
      await connection.commit();
      const [rows, error] = await connection.query(query2.getWorks(popolSeq))
      res.status(200).send({
        response: rows,
      });
      logger.info(`deleteWork userId : ${userId}, workId : ${workSeq}`);
    } catch (err) {
      await connection.rollback();
      res.status(500).json({
        message: 'deleteWork error : 내부 서버 오류가 발생했습니다.',
        timestamp: new Date(),
      });
      logger.error('deleteWork error :', err);
    } finally {
      connection.release();
    }
  },
  updatePageTem: async (req, res) => {
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
      const oldThumbnailExists = directoryList.some((file) => file.name === `${reqJson.thumbnailOld}`);
      const oldProfileExists = directoryList.some((file) => file.name === `${reqJson.profileOld}`);

      if (thumbnailImgPath) {
        if (oldThumbnailExists) {
          if (reqJson.thumbnailOld !== decodeURIComponent(thumbnailImg.originalname)) {
            await sftp.delete(oldThumbnailPath);
            await sftp.put(thumbnailImg.buffer, thumbnailImgPath);
          }
        } else {
          await sftp.put(thumbnailImg.buffer, thumbnailImgPath);
        }
      } else {
        if (oldThumbnailExists) {
          await sftp.delete(oldThumbnailPath);
        }
      }

      if (profileImgPath) {
        if (oldProfileExists) {
          if (reqJson.profileOld !== decodeURIComponent(profileImg.originalname)) {
            await sftp.delete(oldProfilePath);
            await sftp.put(profileImg.buffer, profileImgPath);
          }
        } else {
          await sftp.put(profileImg.buffer, profileImgPath);
        }
      } else {
        if (oldProfileExists) {
          await sftp.delete(oldProfilePath);
        }
      }

      sftp.end();
      const connection = await dbPool.getConnection();
      await connection.query(query.updatePageTem(queryParse.singleQuiteParse(reqJson)))
      for (let i = 0; i < reqJson.workList.length; i++) {
        await connection.query(query.updateWorkOrder2(reqJson.workList[i], i));
      }
      connection.release();
      res.status(200).send({
        response: {
          // profileImg,
          // thumbnailImg,
        },
      });
      logger.info(`updatePageTem : ${reqJson.userId}, ${reqJson.ptId}`);
    } catch (err) {
      res.status(500).json({
        message: 'updatePageTem error : 내부 서버 오류가 발생했습니다.',
        timestamp: new Date(),
      });
      logger.error('updatePageTem error :', err);
    }
  },
  addOrUpdateWork: async (req, res) => {
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
        await sftp.put(posterImg.buffer, sourceDir + reqJson.src + '/' + reqJson.poster);
        sftp.end();
        const connection = await dbPool.getConnection();
        const [rows, error] = await connection.query(query.seletWorkOrder(reqJson))
        reqJson.order = rows[0]['max_order'];
        const [rows2, error2] = await connection.query(query.addWork(queryParse.singleQuiteParse(reqJson)))
        connection.release();
        reqJson.workSeq = rows2.insertId;
        res.status(200).send({
          response: reqJson,
        });
      } else if (reqJson.state === '수정') {
        if (reqJson.posterImgOld !== decodeURIComponent(posterImg.originalname)) {
          await sftp.delete(`${sourceDir}${reqJson.src}/${reqJson.posterImgOld}`);
          await sftp.put(
            posterImg.buffer,
            sourceDir + reqJson.src + '/' + decodeURIComponent(posterImg.originalname)
          );
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
        sftp.end();
        const connection = await dbPool.getConnection();
        await connection.query(query.updateWork(queryParse.singleQuiteParse(reqJson)))
        connection.release();
        res.status(200).send({
          response: reqJson,
        });
      }
      logger.info(`addOrUpdateWork ${reqJson.state} : ${reqJson.userId}, ${reqJson.ptId}`);
    } catch (err) {
      res.status(500).json({
        message: 'addOrUpdateWork error : 내부 서버 오류가 발생했습니다.',
        timestamp: new Date(),
      });
      logger.error('addOrUpdateWork error :', err);
    }
  },
};

module.exports = siteCtrl;
