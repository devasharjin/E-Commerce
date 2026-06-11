import mongoose from "mongoose";

export const addressSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true
    },
    pinCode: {
        type: String,
        required: true
    },
    isDefault: {
        type: Boolean,
        default: false
    }
}, { _id: false });

export const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true
  },

  name: String,

  email: {
    type: String,
    unique: true,
    trim: true
  },

  profilePicture: String,

  points: {
    type: Number,
    default: 0,
    min: 0
  },

  address: {
    type: [addressSchema],
    default: []
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },

  // 🔐 GOOGLE TOKENS 
  googleAccessToken: String,
  googleRefreshToken: String,
  googleTokenExpiry: Date,

  
  refreshToken: {
    type: String,
    default: null
  }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;