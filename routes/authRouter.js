const authCtrl = require('../controllers/authCtrl');
const router = require('express').Router();

router.route('/put/access-token').put(authCtrl.putAccessToken);
router.route('/get/side-menus').get(authCtrl.getMenus); //

module.exports = router;
