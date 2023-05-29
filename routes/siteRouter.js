const siteCtrl = require('../controllers/siteCtrl');
const router = require('express').Router();

router.route('/popolInfo').post(siteCtrl.getPopolInfo);

module.exports = router;
