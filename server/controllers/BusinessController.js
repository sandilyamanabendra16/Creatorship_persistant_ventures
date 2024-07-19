const Business = require('../models/Business');
const Creator = require('../models/Creator');
const auth = require('../middleware/auth');
const jwt=require('jsonwebtoken')
const User = require('../models/User');
const EquityRequest = require('../models/EquityRequest');

exports.getBusinessesOrCreators = async (req, res) => {
  try {
    const { userType } = req.query; // 'business' or 'creator'
    const currentUserId = req.userId; // Assuming this is set by your auth middleware

    // Find approved equity requests for the current user
    const approvedRequests = await EquityRequest.find({
      $or: [
        { fromId: currentUserId, status: 'approved' },
        { toId: currentUserId, status: 'approved' }
      ]
    });

    // Get the IDs of users involved in approved requests
    const excludeUserIds = approvedRequests.flatMap(
      request => [request.fromId.toString(), request.toId.toString()]
    );

    // Exclude the current user's ID as well
    excludeUserIds.push(currentUserId);

    // Find users of the specified type, excluding those with approved requests
    const users = await User.find({
      userType,
      _id: { $nin: excludeUserIds }
    }).select('-password'); // Exclude password from the result

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};
const Businesspost= async (req, res) => {
  try {
    const business = new Business({ ...req.body, userId: req.userId });
    await business.save();
    res.status(201).json(business);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// const getBusinesspost =async (req, res) => {
//   try {
    
//     const businesses = await Business.find();
//     res.json(businesses);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const getBusinessPost = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header is missing' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token is missing' });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            console.error('Token verification failed:', err);
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
        
        const currentUserId = decoded.userId;
        console.log('Current User ID:', currentUserId);

        // Find businesses that:
        // 1. Don't belong to the current user
        // 2. Don't have any approved equity requests
        const businesses = await Business.find({
            $and: [
                { userId: { $ne: currentUserId } },
                { 
                    $or: [
                        { equityRequests: { $size: 0 } },
                        { 'equityRequests.status': { $ne: 'approved' } }
                    ]
                }
            ]
        });

        console.log('Businesses found:', businesses.length);

        res.json(businesses);
    } catch (error) {
        console.error('Error fetching business posts:', error);
        res.status(500).json({ message: 'Error fetching business posts', error: error.message });
    }
};

const findCreator= async (req, res) => {
  try {
    const creators = await Creator.find();
    res.json(creators);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getBusinessbyId = async (req, res) => {
    try {
      // Extract the token from the Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header is missing' });
      }
  
      const token = authHeader.split(' ')[1]; // Assumes "Bearer <token>" format
      if (!token) {
        return res.status(401).json({ message: 'Token is missing' });
      }
  
      // Verify the token
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }
  
      // Find the business profile
      const business = await Business.findOne({ userId: decoded.userId });
      
      if (business) {
        res.json(business);
      } else {
        res.status(404).json({ message: 'Business profile not found' });
      }
    } catch (error) {
      console.error('Error in getBusinessbyId:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const getBusinessesForUser = async (req, res) => {
    try {
      // Extract the token from the Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header is missing' });
      }
  
      const token = authHeader.split(' ')[1]; // Assumes "Bearer <token>" format
      if (!token) {
        return res.status(401).json({ message: 'Token is missing' });
      }
  
      // Verify the token
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }
  
      // Find all business profiles for this user
      const businesses = await Business.find({ userId: decoded.userId });
      
      if (businesses.length > 0) {
        res.json(businesses);
      } else {
        res.status(404).json({ message: 'No business profiles found for this user' });
      }
    } catch (error) {
      console.error('Error in getBusinessesForUser:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  // Update business profile
  const updateBusiness = async (req, res) => {
    try {
      // Extract the token from the Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header is missing' });
      }
  
      const token = authHeader.split(' ')[1]; // Assumes "Bearer <token>" format
      if (!token) {
        return res.status(401).json({ message: 'Token is missing' });
      }
  
      // Verify the token
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }
  
      const { id } = req.params; // Get the business profile ID from the request parameters
      const { name, description, offer, needs, equityOffered } = req.body;
  
      // Update the business profile
      const business = await Business.findOneAndUpdate(
        { _id: id, userId: decoded.userId }, // Ensure the profile belongs to the authenticated user
        { name, description, offer, needs, equityOffered },
        { new: true, runValidators: true }
      );
  
      if (business) {
        res.json(business);
      } else {
        res.status(404).json({ message: 'Business profile not found' });
      }
    } catch (error) {
      console.error('Error in updateBusiness:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
 const deleteProfile= async (req, res) => {
    try {
      const { id } = req.params;
      await Business.findByIdAndDelete(id);
      res.json({ message: 'Business profile deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting business profile', error: error.message });
    }
 };
module.exports = {getBusinessPost,Businesspost, findCreator, getBusinessbyId, updateBusiness, getBusinessesForUser, deleteProfile}