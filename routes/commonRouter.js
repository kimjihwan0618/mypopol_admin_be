const commonCtrl = require('../controllers/commonCtrl');
const router = require('express').Router();

router.route('/login').post(commonCtrl.postSignIn);
router.route('/user/password').put(commonCtrl.putUserPassword);
router.route('/auth-code').post(commonCtrl.postAuthCode);
router.route('/auth-code').get(commonCtrl.checkAuthCode);
router.route('/user').post(commonCtrl.postUser);
router.route('/user').get(commonCtrl.getUser);

module.exports = router;
