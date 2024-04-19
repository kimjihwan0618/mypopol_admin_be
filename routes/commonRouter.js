const commonCtrl = require('../controllers/commonCtrl');
const router = require('express').Router();

router.route('/login').post(commonCtrl.postSignIn); //
router.route('/user/password').put(commonCtrl.putUserPassword); //
router.route('/signup-code').post(commonCtrl.postAuthCode); //
router.route('/user').post(commonCtrl.postUser); //
router.route('/user').get(commonCtrl.getUser); //

module.exports = router;
