const commonCtrl = require('../controllers/commonCtrl');
const router = require('express').Router();

router.route('/post/login').post(commonCtrl.postSignIn); //
router.route('/put/user/password').put(commonCtrl.putUserPassword); //
router.route('/post/signup-code').post(commonCtrl.postAuthCode); //
router.route('/post/user').post(commonCtrl.postUser); //
router.route('/get/user').get(commonCtrl.getUser); //

module.exports = router;
