const authCtrl = require('../controllers/authCtrl');
const router = require('express').Router();

router.route('/login').post(authCtrl.signIn);
router.route('/accessToken').get(authCtrl.accessToken);

module.exports = router;
