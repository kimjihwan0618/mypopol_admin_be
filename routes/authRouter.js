const authCtrl = require('../controllers/authCtrl');
const router = require('express').Router();

router.route('/post/login').post(authCtrl.postSignIn);
router.route('/put/access-token').put(authCtrl.putAccessToken);
router.route('/put/user/password').put(authCtrl.putUserPassword);
router.route('/post/signup-code').post(authCtrl.postAuthCode);
router.route('/post/user').post(authCtrl.postUser);
router.route('/get/user').get(authCtrl.getUser);

module.exports = router;
