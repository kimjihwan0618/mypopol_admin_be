const pageTemManageCtrl = require('../controllers/templateManage/pageCtrl');
const router = require('express').Router();

// page
router.route('/page/list').post(pageTemManageCtrl.getPageTemList);
router.route('/page/update').post(pageTemManageCtrl.updatePageTem);

module.exports = router;
