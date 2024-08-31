const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dob: { type: Date, required: true },
    email: { type: String, unique: true, sparse: true },
    isEmailVerified: { type: Boolean, default: false },
    phone: { type: String, unique: true, sparse: true },
    isPhoneVerified: { type: Boolean, default: false },
    aadhar: { type: String, unique: true, sparse: true },
    isAadharVerified: { type: Boolean, default: false },
    pan: { type: String, unique: true, sparse: true },
    isPanVerified: { type: Boolean, default: false },
    bankAccount: { type: String, unique: true, sparse: true },
    isBankAccountVerified: { type: Boolean, default: false },
    gst: { type: String, unique: true, sparse: true },
    isGstVerified: { type: Boolean, default: false }
  }, { timestamps: true });
  
  module.exports = mongoose.model('User', userSchema);
  