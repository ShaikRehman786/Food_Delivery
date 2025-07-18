import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ['user', 'chef', 'admin'],
    default: 'user',
  },


  approved: {
  type: Boolean,
  default: function () {
    return this.role !== 'chef';
  },
},

otp: {
  type: String
}



});

export default mongoose.model('User', userSchema);
