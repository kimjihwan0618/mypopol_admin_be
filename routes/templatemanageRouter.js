const pageTemManageCtrl = require('../controllers/templateManage/pageCtrl');
const router = require('express').Router();

// page
// router.route('/pages').get(pageTemManageCtrl.getPageTemList);
router.route('/page').put(pageTemManageCtrl.updatePageTem);

// work
router.route('/page/work').post(pageTemManageCtrl.addOrUpdateWork);
router.route('/page/work').delete(pageTemManageCtrl.deleteWork);

module.exports = router;
