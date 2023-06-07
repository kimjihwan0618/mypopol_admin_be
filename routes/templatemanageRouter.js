const pageTemManageCtrl = require('../controllers/templateManage/pageCtrl');
const router = require('express').Router();
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // 업로드된 파일을 저장할 디렉토리 경로
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '_' + file.originalname); // 파일 이름 설정 (현재 시간 + 원본 파일 이름)
  },
});

const upload = multer({ storage });

// page
router.route('/page/list').post(pageTemManageCtrl.getPageTemList);
router.route('/page/update').post(upload.fields([
  { name: 'files', maxCount: 1 },
  { name: 'fields', maxCount: 1 },
]), pageTemManageCtrl.updatePageTem);

module.exports = router;
