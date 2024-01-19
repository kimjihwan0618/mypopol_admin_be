const siteCtrl = require('../controllers/siteCtrl');
const router = require('express').Router();

router.route('/post/popolInfo').post(siteCtrl.postPopolInfo);

module.exports = router;
