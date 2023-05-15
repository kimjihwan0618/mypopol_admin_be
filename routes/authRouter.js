const dbCtrl = require('../controllers/authCtrl');
const router = require('express').Router();

router.route('/login').post(dbCtrl.signIn);
router.route('/accessToken').get(dbCtrl.accessToken);

module.exports = router;
