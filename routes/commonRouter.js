const commonCtrl = require('../controllers/commonCtrl');
const router = require('express').Router();

router.route('/sideMenus').get(commonCtrl.getMenus);

module.exports = router;
