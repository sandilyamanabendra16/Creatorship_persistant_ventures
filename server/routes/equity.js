const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { SendRequest, getRequest, changeRequest, handleEquityRequest, handleShareEquity, updateRequestByCreator } = require('../controllers/EquityController');

router.post('/',auth, SendRequest);
router.get('/',auth, getRequest);
router.put('/:id', auth, changeRequest);
router.put('/requests/:businessId', auth, handleEquityRequest);
router.put('/creator/:creatorId', auth, handleShareEquity);
router.put('/creator/request/:creatorId', auth, updateRequestByCreator )

module.exports= router;