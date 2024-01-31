const pageTemManageCtrl = require('../controllers/templateManage/pageCtrl');
const router = require('express').Router();

// page
router.route('/get/page/list').get(pageTemManageCtrl.getPageTemList);
router.route('/put/page/update').put(pageTemManageCtrl.updatePageTem);

// work
router.route('/post/page/work/add-update').post(pageTemManageCtrl.addOrUpdateWork);
router.route('/delete/page/work').delete(pageTemManageCtrl.deleteWork);

module.exports = router;
