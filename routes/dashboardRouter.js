const dashboardHomeCtrl = require('../controllers/dashboard/home');
const router = require('express').Router();

// home
router.route('/home/get/popols').get(dashboardHomeCtrl.getPopols);
router.route('/home/get/works').get(dashboardHomeCtrl.getWorks);
router.route('/home/get/vistors').get(dashboardHomeCtrl.getVistors);
router.route('/home/get/mails').get(dashboardHomeCtrl.getMails);
router.route('/home/get/test').get(dashboardHomeCtrl.testWs);

module.exports = router;
