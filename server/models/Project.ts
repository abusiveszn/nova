import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProjectDocument extends Document {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  rolesNeeded: string[];
  experienceLevelRequired: "beginner" | "intermediate" | "advanced";
  teamSize: number;
  status: "open" | "closed" | "in-progress";
  coverImage: string;
  founderId: string;
  founderName: string;
  category: string;
  budget?: string;
  duration?: string;
  tags?: string[];
  priority?: "low" | "medium" | "high";
  createdAt: number;
  updatedAt?: number;
}

const ProjectSchema = new Schema<IProjectDocument>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    requiredSkills: {
      type: [String],
      default: [],
    },
    rolesNeeded: {
      type: [String],
      default: [],
    },
    experienceLevelRequired: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "intermediate",
    },
    teamSize: {
      type: Number,
      default: 3,
    },
    status: {
      type: String,
      enum: ["open", "closed", "in-progress"],
      default: "open",
    },
    coverImage: {
      type: String,
      default: "",
    },
    founderId: {
      type: String,
      required: true,
      index: true,
    },
    founderName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "General",
    },
    budget: {
      type: String,
      default: "",
    },
    duration: {
      type: String,
      default: "",
    },
    tags: {
      type: [String],
      default: [],
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    createdAt: {
      type: Number,
      default: () => Date.now(),
    },
    updatedAt: {
      type: Number,
      default: () => Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

export const Project: Model<IProjectDocument> =
  (mongoose.models.Project as Model<IProjectDocument>) ||
  mongoose.model<IProjectDocument>("Project", ProjectSchema);
