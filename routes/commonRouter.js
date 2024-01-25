const commonCtrl = require('../controllers/commonCtrl');
const router = require('express').Router();

router.route('/get/side-menus').get(commonCtrl.getMenus);

module.exports = router;
