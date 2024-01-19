const authCtrl = require('../controllers/authCtrl');
const router = require('express').Router();

router.route('/post/login').post(authCtrl.postSignIn);
router.route('/post/accessToken').get(authCtrl.postAccessToken);
router.route('/post/signUpCode').post(authCtrl.postAuthCode);
router.route('/get/user').get(authCtrl.getUser);

module.exports = router;
