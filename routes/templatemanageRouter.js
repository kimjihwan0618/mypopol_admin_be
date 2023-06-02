const templatemanageCtrl = require('../controllers/templatemanageCtrl');
const router = require('express').Router();

// page
router.route('/page/list').post(templatemanageCtrl.getPageTemList);

module.exports = router;
