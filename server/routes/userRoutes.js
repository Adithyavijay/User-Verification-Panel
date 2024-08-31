const express= require('express')
const router=express.Router();
const userController = require('../controllers/UserController') ;
const verificationController=require('../controllers/verificationController')
const otpController= require('../controllers/otpController')
const refreshTokenIfNeeded=require('../middlewares/tokenMiddleware')


router.post('/register',userController.registerUser) 
router.put('/update',userController.updateUser)
router.post('/send-email-otp',otpController.sendEmailOTP)
router.post('/verify-email-otp',otpController.verifyEmailOTP)
router.post('/verify-pan',refreshTokenIfNeeded,verificationController.verifyPan)
router.post('/verify-bank-account',refreshTokenIfNeeded,verificationController.verifyBankAccount)
router.post('/send-aadhar-otp',refreshTokenIfNeeded,verificationController.sendAadhaarOTP)
router.post('/verify-aadhar-otp',refreshTokenIfNeeded,verificationController.verifyAadhaarOTP)
router.post('/verify-gstin',refreshTokenIfNeeded,verificationController.verifyGstin)


module.exports = router;