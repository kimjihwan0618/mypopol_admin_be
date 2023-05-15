const emailCtrl = require('../controllers/emailCtrl');
const router = require('express').Router();

router.route('/send').post(emailCtrl.sendMail);

module.exports = router;
