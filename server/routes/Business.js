const express = require('express');
const { Businesspost, findCreator, getBusinessbyId, updateBusiness, getBusinessesForUser, getBusinessPost, deleteProfile } = require('../controllers/BusinessController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, Businesspost);
router.get('/', auth, getBusinessPost);
router.get('/creators', findCreator);
router.get('/business-profile', auth, getBusinessbyId);
router.put('/business-profile/:id', auth, updateBusiness);
router.delete('/business-profile/:id', auth, deleteProfile);
router.get('/user-profiles', auth, getBusinessesForUser);

module.exports=router;