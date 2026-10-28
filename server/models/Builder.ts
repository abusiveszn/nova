import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBuilderDocument extends Document {
  userId: string;
  role: "builder";
  fullName: string;
  username: string;
  avatarUrl: string;
  email: string;
  skills: string[];
  experienceLevel: "beginner" | "intermediate" | "advanced";
  bio: string;
  portfolioLinks: string[];
  availabilityStatus: "available" | "busy";
  hoursPerWeek: number;
  reputationScore: number;
  completedProjects: number;
  createdAt: string;
  updatedAt: string;
}

const BuilderSchema = new Schema<IBuilderDocument>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    role: {
      type: String,
      required: true,
      default: "builder",
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    avatarUrl: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    experienceLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    bio: {
      type: String,
      default: "",
    },
    portfolioLinks: {
      type: [String],
      default: [],
    },
    availabilityStatus: {
      type: String,
      enum: ["available", "busy"],
      default: "available",
    },
    hoursPerWeek: {
      type: Number,
      default: 40,
    },
    reputationScore: {
      type: Number,
      default: 0,
    },
    completedProjects: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: String,
      default: () => new Date().toISOString(),
    },
    updatedAt: {
      type: String,
      default: () => new Date().toISOString(),
    },
  },
  {
    timestamps: true,
  }
);

export const Builder: Model<IBuilderDocument> =
  (mongoose.models.Builder as Model<IBuilderDocument>) ||
  mongoose.model<IBuilderDocument>("Builder", BuilderSchema);
