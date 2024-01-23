const authCtrl = require('../controllers/authCtrl');
const router = require('express').Router();

router.route('/login').post(authCtrl.signIn);
router.route('/access-token').get(authCtrl.accessToken);
router.route('/post/signup-code').post(authCtrl.signCodePub);

module.exports = router;
