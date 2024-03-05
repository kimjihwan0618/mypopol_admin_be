const mypageCtrl = require('../controllers/mypageCtrl');
const router = require('express').Router();

router.route('/profile/post/profile-img').post(mypageCtrl.postProfileImg);

module.exports = router;
