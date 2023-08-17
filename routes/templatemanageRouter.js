const pageTemManageCtrl = require('../controllers/templateManage/pageCtrl');
const router = require('express').Router();

// page
router.route('/page/list').post(pageTemManageCtrl.getPageTemList);
router.route('/page/update').post(pageTemManageCtrl.updatePageTem);

// work
router.route('/page/work/addOrUpdate').post(pageTemManageCtrl.addOrUpdateWork);

module.exports = router;
