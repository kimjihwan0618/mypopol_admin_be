const authCtrl = require('../controllers/authCtrl');
const router = require('express').Router();

router.route('/jwt/refresh').post(authCtrl.refreshJwt);
router.route('/sidebar/menu').get(authCtrl.getMenus);

module.exports = router;
