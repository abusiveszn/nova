import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICompanyDocument extends Document {
  userId: string;
  role: "company";
  registeredRole?: string;
  fullName: string;
  username: string;
  avatarUrl: string;
  email: string;
  companyName: string;
  industry: string;
  companySize: string;
  website: string;
  bio: string;
  postedProjects: number;
  investmentFocus?: string[];
  investmentRange?: { min: number; max: number };
  previousInvestments?: number;
  createdAt: string;
  updatedAt: string;
}

const CompanySchema = new Schema<ICompanyDocument>(
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
      default: "company",
    },
    registeredRole: {
      type: String,
      default: "founder",
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
    companyName: {
      type: String,
      default: "",
      trim: true,
    },
    industry: {
      type: String,
      default: "Technology",
    },
    companySize: {
      type: String,
      default: "1-10",
    },
    website: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    postedProjects: {
      type: Number,
      default: 0,
    },
    investmentFocus: {
      type: [String],
      default: [],
    },
    investmentRange: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
    },
    previousInvestments: {
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

export const Company: Model<ICompanyDocument> =
  (mongoose.models.Company as Model<ICompanyDocument>) ||
  mongoose.model<ICompanyDocument>("Company", CompanySchema);
