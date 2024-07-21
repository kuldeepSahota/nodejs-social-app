const express = require('express');
const router = express.Router();
const {register, login, updateUser, verifyOTP, sendOtp} = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const { loginSchema, registerSchema, updateUserSchema } = require('../utils/validationSchemas');

router.post('/register', validateRequest(registerSchema),register);
router.post('/login', validateRequest(loginSchema),login);
router.put('/update', validateRequest(updateUserSchema),updateUser);
router.post('/otp-verify',verifyOTP);
router.post('/send-otp',sendOtp);

module.exports = router;
