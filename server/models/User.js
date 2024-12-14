const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  age: {
    type: Number,
    min: [0, 'Age cannot be negative']
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  isSupervisor: {
    type: Boolean,
    default: false
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization'
  }
}, {
  timestamps: true 
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    if (!this.password) {
      const user = await this.constructor.findById(this._id).select('+password');
      return await bcrypt.compare(candidatePassword, user.password);
    }
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.error('Error in comparePassword:', error);
    throw error;
  }
};

const User = mongoose.model('User', userSchema);
module.exports = User;
