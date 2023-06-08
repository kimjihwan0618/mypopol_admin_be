const db = require('../../dbConfig');
const query = require('../../query/templateManage');
const sftpConfig = require('../../sftpConfig');
const Client = require('ssh2-sftp-client');
const sftp = new Client();

const siteCtrl = {
  getPageTemList: async (req, res) => {
    try {
      const connection = db();
      connection.query(query.getPageTemList(req.body), (error, rows) => {
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
      const thumbnailExists = directoryList.some((file) => file.name === `${reqJson.thumbnailOld}`);
      const profileExists = directoryList.some((file) => file.name === `${reqJson.profileOld}`);

      if (thumbnailImgPath !== '') {
        // 썸네일 파일 조회
        if (thumbnailExists) {
          // 썸네일 파일 삭제
          await sftp.delete(oldThumbnailPath);
          console.log(`썸네일 이미지 ${reqJson.thumbnailOld} 삭제`);
        } else {
          console.log(`썸네일 이미지 존재하지 않음`);
        }
        // 이미지 파일 추가
        await sftp.put(thumbnailImg.buffer, thumbnailImgPath);
        // 이미지 파일 추가
      }
      if (profileImgPath !== '') {
        // 프로필 파일 조회
        if (profileExists) {
          // 프로필 파일 삭제
          await sftp.delete(oldProfilePath);
          console.log(`프로필 이미지 ${reqJson.profileOld} 삭제`);
        } else {
          console.log(`프로필 이미지 존재하지 않음`);
        }
        // 이미지 파일 추가
        await sftp.put(profileImg.buffer, profileImgPath);
        // 이미지 파일 추가
      }
      sftp.end();
      const connection = db();
      connection.query(query.updatePageTem(reqJson), (error, rows) => {
        if (error) {
          throw error;
        }
        // res.send({
        //   response: {
        //     code: 200,
        //     response: rows,
        //   },
        // });
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
};
module.exports = siteCtrl;
