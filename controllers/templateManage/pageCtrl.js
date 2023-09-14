const db = require('../../dbConfig');
const queryParse = require('../../utills/queryParse');
const query = require('../../query/templateManage');
const query2 = require('../../query/site');
const sftpConfig = require('../../sftpConfig');
const Client = require('ssh2-sftp-client');
const sftp = new Client();

const siteCtrl = {
  getPageTemList: async (req, res) => {
    try {
      const connection = db();
      connection.query(query.getPageTemList(queryParse.singleQuiteParse(req.body)), (error, rows) => {
        if (error) {
          throw error;
        }
        res.send({
          response: {
            code: 200,
            response: rows,
          },
        });
        connection.end();
      });
    } catch (error) {
      console.error('getPageTemList error :', error);
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
        req.body.lastWorkSeq = rows[0].last_work_seq
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
      console.error('deleteWork error :', error);
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
        thumbnailImg && thumbnailImg.originalname
          ? `${sourceDir}/${thumbnailImg.originalname}`
          : '';
      const profileImgPath =
        profileImg && profileImg.originalname ? `${sourceDir}/${profileImg.originalname}` : '';
      await sftp.connect(sftpConfig);
      const oldThumbnailPath = `${sourceDir}/${reqJson.thumbnailOld}`;
      const oldProfilePath = `${sourceDir}/${reqJson.profileOld}`;
      const directoryList = await sftp.list(sourceDir);
      // 파일 조회
      const oldThumbnailExists = directoryList.some((file) => file.name === `${reqJson.thumbnailOld}`);
      const oldProfileExists = directoryList.some((file) => file.name === `${reqJson.profileOld}`);

      console.log("--------- null 일경우 ? thumbnailImgPath")
      console.log(thumbnailImgPath)
      if (thumbnailImgPath !== '') {
        // 썸네일 파일 삭제 & 추가
        if (oldThumbnailExists) {
          if (reqJson.thumbnailOld !== thumbnailImg.originalname) {
            console.log(reqJson.thumbnailOld)
            console.log(thumbnailImg.originalname)
            await sftp.delete(oldThumbnailPath);
            console.log(`옛날 썸네일 이미지 ${reqJson.thumbnailOld} 삭제`);
            await sftp.put(thumbnailImg.buffer, thumbnailImgPath);
            console.log(`새 썸네일 이미지 ${reqJson.thumbnailOld} 추가 11`);
          }
        } else {
          console.log(`옛날 썸네일 이미지 존재하지 않음`);
          await sftp.put(thumbnailImg.buffer, thumbnailImgPath);
          console.log(`새 썸네일 이미지 ${thumbnailImg.originalname} 추가 22`);
        }
      } else {
        if (oldThumbnailExists) {
          console.log(`옛날 썸네일 이미지 ${reqJson.thumbnailOld} 삭제`);
          await sftp.delete(oldThumbnailPath);
        }
      }
      console.log("--------- null 일경우 ? profileImgPath")
      console.log(profileImgPath)
      if (profileImgPath !== '') {
        // 프로필 파일 삭제 & 추가
        if (oldProfileExists) {
          if (reqJson.profileOld !== profileImg.originalname) {
            console.log(reqJson.profileOld)
            console.log(profileImg.originalname)
            await sftp.delete(oldProfilePath);
            console.log(`옛날 프로필 이미지 ${reqJson.profileOld} 삭제 11`);
            await sftp.put(profileImg.buffer, profileImgPath);
            console.log(`새 프로필 이미지 ${reqJson.profileOld} 추가 11`);
          }
        } else {
          console.log(`옛날 프로필 이미지 존재하지 않음`);
          await sftp.put(profileImg.buffer, profileImgPath);
          console.log(`새 프로필 이미지 ${profileImg.originalname} 추가 22`);
        }
      } else {
        if (oldProfileExists) {
          console.log(`옛날 프로필 이미지 ${reqJson.profileOld} 삭제`);
          await sftp.delete(oldProfilePath);
        }
      }
      sftp.end();
      const connection = db();
      connection.query(query.updatePageTem(queryParse.singleQuiteParse(reqJson)), (error, rows) => {
        if (error) {
          throw error;
        }
        connection.end();
      });
      res.send({
        response: {
          code: 200,
          response: {
            // profileImg,
            // thumbnailImg,
          },
        },
      });
    } catch (error) {
      console.error('updatePageTem error :', error);
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
      if (reqJson.state === "추가") {
        // reqJson.logo = titleImg.originalname;
        // reqJson.poster = posterImg.originalname;
        reqJson.src = String(reqJson.workId) + "_" + String(new Date().getTime());
        await sftp.mkdir(sourceDir + reqJson.src, true);
        await sftp.put(titleImg.buffer, sourceDir + reqJson.src + "/" + reqJson.logo);
        await sftp.put(posterImg.buffer, sourceDir + reqJson.src + "/" + reqJson.poster);
        sftp.end();
        const connection = db();
        connection.query(query.seletWorkOrder(reqJson), (error, rows) => {
          if (error) {
            throw error;
          }
          reqJson.order = rows[0]["max_order"]
          connection.query(query.addWork(queryParse.singleQuiteParse(reqJson)), (error, rows) => {
            if (error) {
              throw error;
            }
            connection.end();
            reqJson.workSeq = rows.insertId;
            res.send({
              response: {
                code: 200,
                response: {
                  reqJson
                },
              },
            });
          });
        });
      } else if (reqJson.state === "수정") {
        if (reqJson.posterImgOld !== posterImg.originalname) {
          await sftp.delete(`${sourceDir}${reqJson.src}/${reqJson.posterImgOld}`);
          if (posterImg.originalname !== "") {
            await sftp.put(posterImg.buffer, sourceDir + reqJson.src + "/" + posterImg.originalname);
          }
        }
        if (reqJson.titleImgOld !== titleImg.originalname) {
          await sftp.delete(`${sourceDir}${reqJson.src}/${reqJson.titleImgOld}`);
          if (titleImg.originalname !== "") {
            await sftp.put(titleImg.buffer, sourceDir + reqJson.src + "/" + titleImg.originalname);
          }
        }
        sftp.end();
        const connection = db();
        connection.query(query.updateWork(queryParse.singleQuiteParse(reqJson)), (error, rows) => {
          if (error) {
            throw error;
          }
          connection.end();
          res.send({
            response: {
              code: 200,
              response: {
                reqJson
              },
            },
          });
        });
      }
    } catch (error) {
      console.error('addOrUpdateWork error :', error);
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
