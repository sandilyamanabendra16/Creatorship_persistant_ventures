const Business = require('../models/Business');
const Creator = require('../models/Creator');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const SendRequest = async (req, res) => {
    const { toId, equity } = req.body;
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

    const fromId = decoded.userId;
    const user = await User.findById(fromId);

    if (user.userType === 'business') {
        const creator = await Creator.findOne({ userId: toId });
        if (!creator) {
            return res.status(404).json({ message: 'Creator not found' });
        }
        creator.equityRequests.push({
            businessId: fromId,
            equity,
            status: 'pending'
        });
        await creator.save();
    } else {
        const business = await Business.findOne({ userId: toId });
        if (!business) {
            return res.status(404).json({ message: 'Business not found' });
        }
        business.equityRequests.push({
            creatorId: fromId,
            equity,
            status: 'pending'
        });
        await business.save();
    }

    res.json({ message: 'Equity request created' });
};

// Route to get equity requests for a user
const getRequest = async (req, res) => {
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
        } catch (error) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        const userId = decoded.userId;
        const user = await User.findById(userId);
        let requests = [];

        if (user.userType === 'business') {
            // Fetch all businesses owned by this user
            const businesses = await Business.find({ userId: userId });

            for (let business of businesses) {
                // Include all requests, regardless of status
                const populatedRequests = await Promise.all(business.equityRequests.map(async (request) => {
                    const creator = await User.findById(request.creatorId);
                    return {
                        ...request.toObject(),
                        businessId: business._id,
                        businessName: business.name,
                        creatorName: creator ? creator.name : 'Unknown Creator',
                        creatorEmail: creator ? creator.email : 'No email provided'
                    };
                }));

                requests = requests.concat(populatedRequests);
            }
        } else if (user.userType === 'creator') {
            const creator = await Creator.findOne({ userId });
            if (creator) {
                // For creators, show all their requests
                requests = await Promise.all(creator.equityRequests.map(async (request) => {
                    const business = await Business.findById(request.businessId);
                    return {
                        ...request.toObject(),
                        businessName: business ? business.name : 'Unknown Business',
                        businessDescription: business ? business.description : 'No description provided'
                    };
                }));
            }
        }

        res.status(200).json(requests);
    } catch (err) {
        console.error('Error fetching requests:', err);
        res.status(500).json({ message: 'An error occurred while fetching requests', error: err.message });
    }
};

    

// Route to update an equity request status

const changeRequest = async (req, res) => {
    try {
        const { id } = req.params; // This is the business ID
        const { requestId, status } = req.body; // We need the specific request ID as well

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
        } catch (error) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        const userId = decoded.userId;
        const user = await User.findById(userId);

        if (user.userType !== 'business') {
            return res.status(403).json({ message: 'Only business users can update equity requests' });
        }

        const business = await Business.findById(id);
        if (!business) {
            return res.status(404).json({ message: 'Business not found' });
        }

        // Find the specific equity request
        const requestIndex = business.equityRequests.findIndex(req => req._id.toString() === requestId);
        if (requestIndex === -1) {
            return res.status(404).json({ message: 'Equity request not found' });
        }

        // Update the status of the specific request
        business.equityRequests[requestIndex].status = status;
        await business.save();

        const updatedRequest = business.equityRequests[requestIndex];

        res.json({ 
            message: 'Equity request updated successfully', 
            request: updatedRequest
        });
    } catch (error) {
        console.error('Error updating equity request:', error);
        res.status(500).json({ message: 'An error occurred while updating the equity request' });
    }
};

const handleEquityRequest = async (req, res) => {
    try{
    const { businessId } = req.params;
    const { equity } = req.body;

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
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }

    const creatorId = decoded.userId;
    const creator = await Creator.findOne({ userId: creatorId });
    if (!creator) {
        return res.status(404).json({ message: 'Creator not found' });
    }

    const business = await Business.findOne({ _id: businessId });
    if (!business) {
        return res.status(404).json({ message: 'Business not found' });
    }

    // Check if an equity request already exists
    const existingRequestIndex = business.equityRequests.findIndex(
        req => req.creatorId.toString() === creatorId
    );

    if (existingRequestIndex !== -1) {
        // Update existing request
        business.equityRequests[existingRequestIndex].equity = equity;
        business.equityRequests[existingRequestIndex].status = 'pending';
    } else {
        // Create new request
        business.equityRequests.push({
            creatorId,
            equity,
            status: 'pending'
        });
    }

    await business.save();

    res.status(200).json(business);
}catch(err){
    res.status(500).json(err)
}
};

const handleShareEquity = async (req, res) => {
    try {
        const { creatorId } = req.params;
        const { equity } = req.body;

        // Verify token
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
        } catch (error) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        const businessUserId = decoded.userId;

        // Find the business
        const business = await Business.findOne({ userId: businessUserId });
        if (!business) {
            return res.status(404).json({ message: 'Business not found' });
        }

        // Find the creator
        const creator = await Creator.findById(creatorId);
        if (!creator) {
            return res.status(404).json({ message: 'Creator not found' });
        }

        // Check if an equity request already exists
        const existingRequestIndex = business.equityRequests.findIndex(
            req => req.creatorId.toString() === creatorId
        );

        if (existingRequestIndex !== -1) {
            // Update existing request
            business.equityRequests[existingRequestIndex].equity = equity;
            business.equityRequests[existingRequestIndex].status = 'pending';
        } else {
            // Create new request
            business.equityRequests.push({
                creatorId,
                equity,
                status: 'pending'
            });
        }

        await business.save();

        // Add the request to the creator's equityRequests as well
        const creatorRequestIndex = creator.equityRequests.findIndex(
            req => req.businessId.toString() === business._id.toString()
        );

        if (creatorRequestIndex !== -1) {
            creator.equityRequests[creatorRequestIndex].equity = equity;
            creator.equityRequests[creatorRequestIndex].status = 'pending';
        } else {
            creator.equityRequests.push({
                businessId: business._id,
                equity,
                status: 'pending'
            });
        }

        await creator.save();

        res.status(200).json({ message: 'Equity share request sent successfully' });
    } catch (error) {
        console.error('Error handling equity share request:', error);
        res.status(500).json({ message: 'An error occurred while processing the equity share request', error: error.message });
    }
};

const updateRequestByCreator = async (req, res) => {
    try {
      const { creatorId } = req.params;
      const { requestId, status } = req.body;
  
      if (!creatorId || !requestId || !status) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      const creator = await Creator.findOne({ userId: req.userId });
      if (!creator) {
        return res.status(404).json({ message: 'Creator not found' });
      }
  
      const requestIndex = creator.equityRequests.findIndex(req => req._id.toString() === requestId);
      if (requestIndex === -1) {
        return res.status(404).json({ message: 'Equity request not found' });
      }
  
      creator.equityRequests[requestIndex].status = status;
      await creator.save();
  
      // Update the business's request as well
      const businessId = creator.equityRequests[requestIndex].businessId;
      const business = await Business.findOne({ userId: businessId });
      if (business) {
        const businessRequestIndex = business.equityRequests.findIndex(req => req.creatorId.toString() === creator._id.toString());
        if (businessRequestIndex !== -1) {
          business.equityRequests[businessRequestIndex].status = status;
          await business.save();
        }
      }
  
      res.json({ message: 'Request updated successfully' });
    } catch (error) {
      console.error('Error in updateRequestByCreator:', error);
      res.status(500).json({ message: 'Error updating request', error: error.message });
    }
  };
module.exports = { SendRequest, getRequest, changeRequest, handleEquityRequest, handleShareEquity, updateRequestByCreator};
// module.exports = { SendRequest, getRequest, changeRequest };