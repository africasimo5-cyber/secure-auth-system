import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password?: string;
  isVerified: boolean;
  otp?: string | null;
  otpExpiry?: Date | null;
  loginAttempts: number;
  lockUntil?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  isLocked(): boolean;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Don't return password by default
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpiry: {
      type: Date,
      default: null,
    },
    loginAttempts: {
      type: Number,
      default: 0,
      required: true,
    },
    lockUntil: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Checks if the user account is currently locked.
 * Account is locked if loginAttempts >= 5 and lockUntil is in the future.
 */
UserSchema.methods.isLocked = function(): boolean {
  if (!this.lockUntil) return false;
  return this.lockUntil > new Date() && this.loginAttempts >= 5;
};

// Check if the model is already defined to prevent overwriting during hot reloads
const User = models.User || model<IUser>('User', UserSchema);

export default User;
