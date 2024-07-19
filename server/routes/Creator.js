const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getCreator, creatorPost, findBusiness, getCreatorbyId, getProfiles, updateProfile, deleteProfile } = require('../controllers/CreatorController');

router.post('/',auth, creatorPost);
router.get('/', getCreator);
router.get('/businesses', findBusiness);
router.get('/creator-profile', auth, getProfiles);
router.put('/creator-profile/:id',auth, updateProfile);
router.delete('/creator-profile/:id',auth, deleteProfile);

module.exports=router;