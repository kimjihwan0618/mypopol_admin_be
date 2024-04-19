const dashboardHomeCtrl = require('../controllers/dashboard/home');
const router = require('express').Router();

// home
router.route('/popols').get(dashboardHomeCtrl.getPopols);
router.route('/works').get(dashboardHomeCtrl.getWorks);
router.route('/vistors').get(dashboardHomeCtrl.getVistors);
router.route('/mails').get(dashboardHomeCtrl.getMails);
router.route('/test').post(dashboardHomeCtrl.testWs); // 웹소켓 핸드세이크 테스트 

module.exports = router;
