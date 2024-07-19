const mongoose=require('mongoose');

const EquityRequestSchema = new mongoose.Schema({
    fromId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      toId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      fromType: {
        type: String,
        enum: ['creator', 'business'],
        required: true
      }, // 'creator' or 'business'
    equity: Number,
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
      }, // 'pending', 'approved', 'rejected'
    createdAt: { type: Date, default: Date.now }
  });
  
module.exports = mongoose.model('EquityRequest', EquityRequestSchema);