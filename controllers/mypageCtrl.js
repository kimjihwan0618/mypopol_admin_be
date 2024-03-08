const root = require.main.path;
const path = require('path');
const log4js = require('log4js');
const Client = require('ssh2-sftp-client');
const sftp = new Client();
const sftpConfig = require(path.join(root, 'config/sftp.config'));
const dbPool = require(path.join(root, 'config/db.config'));
const queryParse = require(path.join(root, 'utills/queryParse'));
const query = require(path.join(root, 'query/myPage'));
const logger = log4js.getLogger('access');
const bcrypt = require('bcrypt');
const log4jsConfig = path.join(root, 'config/log4js.config.json');
log4js.configure(log4jsConfig);

const mypageCtrl = {
  postProfileImg: async (req, res) => {
    const connection = await dbPool.getConnection();
    try {
      const userId = req.body.userId;
      const oldFileName = req.body.oldFileName;
      const files = req.files;
      const profileImg = files.find((file) => file.fieldname === 'profileImg');
      const sourceDir = `/web/site/src/img/profile/${userId}`;
      const profileImgPath =
        profileImg && decodeURIComponent(profileImg.originalname)
          ? `${sourceDir}/${decodeURIComponent(profileImg.originalname)}`
          : '';
      await sftp.connect(sftpConfig);
      const directoryList = await sftp.list(sourceDir);
      const oldProfileImgPath = `${sourceDir}/${oldFileName}`;
      const oldProfileImgExists = directoryList.some((file) => file.name === `${oldFileName}`);
      if (profileImgPath) {
        if (oldProfileImgExists) {
          if (oldFileName !== decodeURIComponent(profileImg.originalname)) {
            await sftp.delete(oldProfileImgPath);
            await sftp.put(profileImg.buffer, profileImgPath);
          }
        } else {
          await sftp.put(profileImg.buffer, profileImgPath);
        }
      } else {
        if (oldProfileImgExists) {
          await sftp.delete(oldProfileImgPath);
        }
      }
      await connection.query(
        query.updateProfileImg({
          profileImg: profileImg?.originalname ? decodeURIComponent(profileImg.originalname) : '',
          userId: userId,
        })
      );
      res.status(200).send({
        response: 'success',
      });
    } catch (err) {
      res.status(500).json({
        message: 'postProfileImg error : 내부 서버 오류가 발생했습니다.',
        timestamp: new Date(),
      });
      logger.error('postProfileImg error :', err);
    } finally {
      sftp.end();
      connection.release();
    }
  },
  putProfileInfo: async (req, res) => {
    const connection = await dbPool.getConnection();
    try {
      const { password, username, userId } = req.body;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        req.body.hashPassword = hash;
        await connection.query(query.updateProfilePassword(req.body));
      }
      await connection.query(query.updateProfileName(req.body));
      res.status(200).send(true);
    } catch (err) {
      await connection.rollback();
      logger.error('postProfileImg 에러 : ', err);
      res.status(500).send({
        message: 'postProfileImg 에러',
        timestamp: new Date(),
      });
    } finally {
      connection.release();
    }
  },
};

module.exports = mypageCtrl;
