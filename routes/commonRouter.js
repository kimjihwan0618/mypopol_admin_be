const commonCtrl = require('../controllers/commonCtrl');
const router = require('express').Router();

router.route('/sideMenus').get(commonCtrl.getMenus);
router.route('/sftpTest').post(commonCtrl.testSftp);

module.exports = router;
