import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUserDocument extends Document {
  email: string;
  hash: string;
  name: string;
  phone?: string;
  registeredRole: string;
  verifiedAt: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    hash: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    registeredRole: {
      type: String,
      required: true,
      default: "builder",
    },
    verifiedAt: {
      type: String,
      default: () => new Date().toISOString(),
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite in development HMR
export const User: Model<IUserDocument> =
  (mongoose.models.User as Model<IUserDocument>) ||
  mongoose.model<IUserDocument>("User", UserSchema);
