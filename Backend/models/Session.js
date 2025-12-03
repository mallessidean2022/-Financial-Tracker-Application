const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 604800 // Auto-delete after 7 days
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  }
});

// Index for efficient cleanup of expired sessions
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Static method to clean up expired sessions
sessionSchema.statics.cleanupExpired = async function() {
  return await this.deleteMany({ expiresAt: { $lt: new Date() } });
};

module.exports = mongoose.model('Session', sessionSchema);
