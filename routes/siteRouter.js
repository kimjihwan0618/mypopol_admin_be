const siteCtrl = require('../controllers/siteCtrl');
const router = require('express').Router();

router.route('/popol').post(siteCtrl.getPopolInfo);

module.exports = router;
