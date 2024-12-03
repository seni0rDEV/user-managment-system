import mongoose, { Schema } from "mongoose";
import { User } from "./UserTypes";

const UserSchema = new mongoose.Schema<User>(
  {
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
    mobile: {
      type: String,
      required: false,
    },

    role: {
      type: String,
      required: true,
      enum: ['user', 'admin', 'superadmin'],
    },

    verified: {
      type: Boolean,
      default: false, // Default is unverified
    },
    
    dob: {
      type: String,
      required: false,
    },
    doj: {
      type: String,
      required: false,
    },
    // _id: {
    //   type: Schema.Types.ObjectId,
    //   required: true,
    //   ref: 'User',
    // },

    token: {
      type: String,
      // required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
      // expires: 600,
    },

    resetPasswordToken: {
      type: String,
      required: false,
    },
    resetPasswordExpires: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);


export default mongoose.model<User>('User', UserSchema); 