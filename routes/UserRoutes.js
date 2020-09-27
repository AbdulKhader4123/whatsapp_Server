const router = require('express').Router();
const userController = require('../controllers/UserController')


router.post('/registerUser', userController.addUser)
router.post('/loginUser',userController.LoginUser)
router.post('/checkUser',userController.CheckUser)
router.post('/GenerateOTP', userController.GenerateOTP);
router.post('/VerifyGenerateOTP', userController.VerifyGenerateOTP);
router.post('/saveProfile', userController.saveProfile);

module.exports = UserRouter = router