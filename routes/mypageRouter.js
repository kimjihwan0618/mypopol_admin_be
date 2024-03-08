const mypageCtrl = require('../controllers/mypageCtrl');
const router = require('express').Router();

router.route('/profile/post/profile-img').post(mypageCtrl.postProfileImg);
router.route('/profile/put/profile-info').put(mypageCtrl.putProfileInfo);

module.exports = router;
