const siteCtrl = require('../controllers/siteCtrl');
const router = require('express').Router();

router.route('/post/popol-info').post(siteCtrl.postPopolInfo);

module.exports = router;
