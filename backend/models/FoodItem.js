import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  image: {
    type: String,
    default: '',
  },

  description: {
    type: String,
    default: '',
  },

  category: {
    type: String,
    default: '',
  },

  chef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // 🔑 links food item to the chef who created it
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  approved: {
  type: Boolean,
  default: false,
},

});

export default mongoose.model('FoodItem', foodSchema);
