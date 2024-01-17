const root = require.main.path;
const path = require('path');
const log4js = require('log4js');
const Client = require('ssh2-sftp-client');
const sftp = new Client();
const db = require(path.join(root, 'config/db.config'));
const queryParse = require(path.join(root, 'utills/queryParse'));
const query = require(path.join(root, 'query/templateManage'));
const query2 = require(path.join(root, 'query/site'));
const sftpConfig = require(path.join(root, 'config/sftp.config'));
const logger = log4js.getLogger('access');
const log4jsConfig = path.join(root, 'config/log4js.config.json');
log4js.configure(log4jsConfig);

const siteCtrl = {
  getPageTemList: async (req, res) => {
    try {
      const connection = db();
      connection.query(
        query.getPageTemList(queryParse.singleQuiteParse(req.body)),
        (error, rows) => {
          if (error) {
            throw error;
          }
          for (let i = 0; i < rows.length; i++) {
            connection.query(query.getPageVistedCt(rows[i]), (error, rows2) => {
              if (error) {
                throw error;
              }
              rows[i].vistedCount = rows2[0].ct;
              if (i === rows.length - 1) {
                logger.info(`getPageTemList : ${rows[i].userId}`);
                res.status(200).send(rows);
                connection.end();
              }
            });
          }
        }
      );
    } catch (error) {
      logger.error('getPageTemList error :', error);
      res.status(500).json({
        code: 500,
        status: 'Internal Server Error',
        message: 'getPageTemList error : 내부 서버 오류가 발생했습니다.',
        timestamp: new Date(),
      });
    }
  },
  deleteWork: async (req, res) => {
    try {
      const connection = db();
      await sftp.connect(sftpConfig);
      await sftp.rmdir(`/web/site/${req.body.ptId}/${req.body.userId}/img/${req.body.src}`, true);
      sftp.end();
      connection.query(query.seletLastWorkSeq(), (error, rows) => {
        if (error) {
          throw error;
        }
        req.body.lastWorkSeq = rows[0].last_work_seq;
        connection.query(query.deleteWork(req.body), (error, rows) => {
          if (error) {
            throw error;
          }
          connection.query(query.updateWorkSeq(req.body), (error, rows) => {
            if (error) {
              throw error;
            }
            connection.query(query.updateWorkOrder(req.body), (error, rows) => {
              if (error) {
                throw error;
              }
              connection.query(query.seqWorkSeq(req.body), (error, rows) => {
                if (error) {
                  throw error;
                }
                connection.query(query2.getWorks(req.body.popolSeq), (error, rows) => {
                  if (error) {
                    throw error;
                  }
                  logger.info(`deleteWork : ${req.body.userId}`);
                  res.status(200).send({
                    response: rows,
                  });
                  connection.end();
                });
              });
            });
          });
        });
      });
    } catch (error) {
      logger.error('deleteWork error :', error);
      res.status(500).json({
        code: 500,
        status: 'Internal Server Error',
        message: 'deleteWork error : 내부 서버 오류가 발생했습니다.',
        timestamp: new Date(),
      });
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
      // 파일 조회
      const oldThumbnailExists = directoryList.some(
        (file) => file.name === `${reqJson.thumbnailOld}`
      );
      const oldProfileExists = directoryList.some((file) => file.name === `${reqJson.profileOld}`);

      if (thumbnailImgPath !== '') {
        // 썸네일 파일 삭제 & 추가
        if (oldThumbnailExists) {
          if (reqJson.thumbnailOld !== decodeURIComponent(thumbnailImg.originalname)) {
            await sftp.delete(oldThumbnailPath);
            // logger.info(`옛날 썸네일 이미지 ${reqJson.thumbnailOld} 삭제`);
            await sftp.put(thumbnailImg.buffer, thumbnailImgPath);
            // logger.info(`새 썸네일 이미지 ${reqJson.thumbnailOld} 추가 11`);
          }
        } else {
          // logger.info(`옛날 썸네일 이미지 존재하지 않음`);
          await sftp.put(thumbnailImg.buffer, thumbnailImgPath);
          // logger.info(`새 썸네일 이미지 ${decodeURIComponent(thumbnailImg.originalname)} 추가 22`);
        }
      } else {
        if (oldThumbnailExists) {
          // logger.info(`옛날 썸네일 이미지 ${reqJson.thumbnailOld} 삭제`);
          await sftp.delete(oldThumbnailPath);
        }
      }
      // logger.info("--------- null 일경우 ? profileImgPath")
      // logger.info(profileImgPath)
      if (profileImgPath !== '') {
        // 프로필 파일 삭제 & 추가
        if (oldProfileExists) {
          if (reqJson.profileOld !== decodeURIComponent(profileImg.originalname)) {
            await sftp.delete(oldProfilePath);
            // logger.info(`옛날 프로필 이미지 ${reqJson.profileOld} 삭제 11`);
            await sftp.put(profileImg.buffer, profileImgPath);
            // logger.info(`새 프로필 이미지 ${reqJson.profileOld} 추가 11`);
          }
        } else {
          // logger.info(`옛날 프로필 이미지 존재하지 않음`);
          await sftp.put(profileImg.buffer, profileImgPath);
          // logger.info(`새 프로필 이미지 ${profileImg.originalname} 추가 22`);
        }
      } else {
        if (oldProfileExists) {
          // logger.info(`옛날 프로필 이미지 ${reqJson.profileOld} 삭제`);
          await sftp.delete(oldProfilePath);
        }
      }
      sftp.end();
      const connection = db();
      connection.query(query.updatePageTem(queryParse.singleQuiteParse(reqJson)), (error, rows) => {
        if (error) {
          throw error;
        }
      });
      for (let i = 0; i < reqJson.workList.length; i++) {
        connection.query(query.updateWorkOrder2(reqJson.workList[i], i), (error, rows) => {
          if (error) {
            throw error;
          }
        });
      }
      connection.end();
      logger.info(`updatePageTem : ${reqJson.userId}, ${reqJson.ptId}`);
      res.status(200).send({
        response: {
          code: 200,
          response: {
            // profileImg,
            // thumbnailImg,
          },
        },
      });
    } catch (error) {
      logger.error('updatePageTem error :', error);
      res.status(500).json({
        code: 500,
        status: 'Internal Server Error',
        message: 'updatePageTem error : 내부 서버 오류가 발생했습니다.',
        timestamp: new Date(),
      });
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
        titleImg !== undefined &&
          (await sftp.put(titleImg.buffer, sourceDir + reqJson.src + '/' + reqJson.logo));
        await sftp.put(posterImg.buffer, sourceDir + reqJson.src + '/' + reqJson.poster);
        sftp.end();
        const connection = db();
        connection.query(query.seletWorkOrder(reqJson), (error, rows) => {
          if (error) {
            throw error;
          }
          reqJson.order = rows[0]['max_order'];
          connection.query(query.addWork(queryParse.singleQuiteParse(reqJson)), (error, rows) => {
            if (error) {
              throw error;
            }
            connection.end();
            reqJson.workSeq = rows.insertId;
            logger.info(`addOrUpdateWork_추가 : ${reqJson.userId}, ${reqJson.ptId}`);
            res.status(200).send({
              response: reqJson,
            });
          });
        });
      } else if (reqJson.state === '수정') {
        if (reqJson.posterImgOld !== decodeURIComponent(posterImg.originalname)) {
          await sftp.delete(`${sourceDir}${reqJson.src}/${reqJson.posterImgOld}`);
          await sftp.put(
            posterImg.buffer,
            sourceDir + reqJson.src + '/' + decodeURIComponent(posterImg.originalname)
          );
        }
        if (titleImg === undefined) {
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
        const connection = db();
        connection.query(query.updateWork(queryParse.singleQuiteParse(reqJson)), (error, rows) => {
          if (error) {
            throw error;
          }
          connection.end();
          logger.info(`addOrUpdateWork_수정 : ${reqJson.userId}, ${reqJson.ptId}`);
          res.status(200).send({
            response: reqJson,
          });
        });
      }
    } catch (error) {
      logger.error('addOrUpdateWork error :', error);
      res.status(500).json({
        code: 500,
        status: 'Internal Server Error',
        message: 'addOrUpdateWork error : 내부 서버 오류가 발생했습니다.',
        timestamp: new Date(),
      });
    }
  },
};

module.exports = siteCtrl;
