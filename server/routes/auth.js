const express = require('express');
const { registerUser, loginUser, getUserInfo } = require('../controllers/AuthController');
const router=express.Router();

router.post('/register', registerUser);
router.post('/login',loginUser);
router.get('/user', getUserInfo);

module.exports= router;