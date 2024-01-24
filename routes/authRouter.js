const authCtrl = require('../controllers/authCtrl');
const router = require('express').Router();

router.route('/login').post(authCtrl.postSignIn);
router.route('/access-token').get(authCtrl.postAccessToken);
router.route('/post/signup-code').post(authCtrl.postAuthCode);
router.route('/get/user').get(authCtrl.getUser);

module.exports = router;
