const Creator = require('../models/Creator');
const Business = require('../models/Business');
const auth = require('../middleware/auth');
const jwt=require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (authHeader) => {
    if (!authHeader) {
      throw new Error('Authorization header is missing');
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new Error('Token is missing');
    }
    return jwt.verify(token, process.env.JWT_SECRET);
  };

const creatorPost= async (req, res) => {
  try {
    const creator = new Creator({ ...req.body, userId: req.userId });
    await creator.save();
    res.status(201).json(creator);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const getCreator= async (req, res) => {
//   try {
//     const creators = await Creator.find();
//     res.status(200).json(creators);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const getCreator = async (req, res) => {
    try {
      // Extract the current user's ID from the token
      const currentUserId = req.userId; 
  
      const creators = await Creator.find({
        $and: [
          { userId: { $ne: currentUserId } },
          {
            $or: [
              { equityRequests: { $size: 0 } },
              { 'equityRequests.status': { $ne: 'approved' } }
            ]
          }
        ]
      }).select('-equityRequests'); // Optionally exclude equityRequests from the response
  
      res.status(200).json(creators);
    } catch (error) {
      console.error('Error fetching creators:', error);
      res.status(500).json({ message: 'Error fetching creators', error: error.message });
    }
  };
const findBusiness=  async (req, res) => {
  try {
    const businesses = await Business.find();
    res.json(businesses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCreatorbyId = async (req, res) => {
    try {
      const decoded = verifyToken(req.headers.authorization);
      const creator = await Creator.findOne({ userId: decoded.userId });
      if (creator) {
        res.json(creator);
      } else {
        res.status(404).json({ message: 'Creator profile not found' });
      }
    } catch (error) {
      console.error('Error in getCreatorbyId:', error);
      res.status(401).json({ message: 'Authentication failed', error: error.message });
    }
  };
  
  const updateProfile = async (req, res) => {
    try {
      const updatedProfile = await Creator.findOneAndUpdate(
        { _id: req.params.id, userId: req.userId },
        req.body,
        { new: true }
      );
      if (!updatedProfile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
      res.json(updatedProfile);
    } catch (error) {
      res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
  };
  
const deleteProfile = async (req, res) => {
    try {
      const deletedProfile = await Creator.findOneAndDelete({ _id: req.params.id, userId: req.userId });
      if (!deletedProfile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
      res.json({ message: 'Profile deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting profile', error: error.message });
    }
  };
  

  const getProfiles = async (req, res) => {
    try {
        const decoded = verifyToken(req.headers.authorization);
      const profiles = await Creator.find({ userId: decoded.userId });
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching profiles', error: error.message });
    }
  };
module.exports ={creatorPost, getCreator, findBusiness, getCreatorbyId, updateProfile, getProfiles, deleteProfile};