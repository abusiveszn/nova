import mongoose, { Schema, Document, Model } from "mongoose";

// ==================== Investment Project ====================
export interface IInvestmentProjectDocument extends Document {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  targetFunding: number;
  raisedFunding: number;
  expectedROI: number;
  equityOffered: number;
  projectManagerId: string;
  projectManagerName: string;
  projectManagerAvatar: string;
  status: "funding" | "active" | "completed";
  deckUrl?: string;
  coverImage?: string;
  companyWebsite?: string;
  createdAt: number;
  updatedAt?: number;
  tags?: string[];
  fundingDeadline?: number;
  minInvestment?: number;
  sector?: string;
}

const InvestmentProjectSchema = new Schema<IInvestmentProjectDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    techStack: { type: [String], default: [] },
    targetFunding: { type: Number, default: 0 },
    raisedFunding: { type: Number, default: 0 },
    expectedROI: { type: Number, default: 0 },
    equityOffered: { type: Number, default: 0 },
    projectManagerId: { type: String, required: true },
    projectManagerName: { type: String, required: true },
    projectManagerAvatar: { type: String, default: "" },
    status: {
      type: String,
      enum: ["funding", "active", "completed"],
      default: "funding",
    },
    deckUrl: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    companyWebsite: { type: String, default: "" },
    createdAt: { type: Number, default: () => Date.now() },
    updatedAt: { type: Number, default: () => Date.now() },
    tags: { type: [String], default: [] },
    fundingDeadline: { type: Number },
    minInvestment: { type: Number, default: 1000 },
    sector: { type: String, default: "SaaS/AI" },
  },
  { timestamps: true }
);

export const InvestmentProject: Model<IInvestmentProjectDocument> =
  (mongoose.models.InvestmentProject as Model<IInvestmentProjectDocument>) ||
  mongoose.model<IInvestmentProjectDocument>(
    "InvestmentProject",
    InvestmentProjectSchema
  );

// ==================== Investment Agreement ====================
export interface IInvestmentAgreementDocument extends Document {
  id: string;
  investorId: string;
  projectId: string;
  amount: number;
  agreedReturnPercentage: number;
  status: "pending_signature" | "signed" | "funded";
  createdAt: number;
  signedAt?: number;
  fundedAt?: number;
  equityPercentage?: number;
  terms?: string;
}

const InvestmentAgreementSchema = new Schema<IInvestmentAgreementDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    investorId: { type: String, required: true, index: true },
    projectId: { type: String, required: true, index: true },
    amount: { type: Number, required: true },
    agreedReturnPercentage: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending_signature", "signed", "funded"],
      default: "pending_signature",
    },
    createdAt: { type: Number, default: () => Date.now() },
    signedAt: { type: Number },
    fundedAt: { type: Number },
    equityPercentage: { type: Number, default: 0 },
    terms: { type: String, default: "" },
  },
  { timestamps: true }
);

export const InvestmentAgreement: Model<IInvestmentAgreementDocument> =
  (mongoose.models.InvestmentAgreement as Model<IInvestmentAgreementDocument>) ||
  mongoose.model<IInvestmentAgreementDocument>(
    "InvestmentAgreement",
    InvestmentAgreementSchema
  );

// ==================== Investor Inquiry ====================
export interface IInvestorInquiryDocument extends Document {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  projectId: string;
  content: string;
  createdAt: number;
  read: boolean;
  attachments?: string[];
}

const InvestorInquirySchema = new Schema<IInvestorInquiryDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    senderId: { type: String, required: true, index: true },
    senderName: { type: String, required: true },
    receiverId: { type: String, required: true, index: true },
    projectId: { type: String, required: true, index: true },
    content: { type: String, required: true },
    createdAt: { type: Number, default: () => Date.now() },
    read: { type: Boolean, default: false },
    attachments: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const InvestorInquiry: Model<IInvestorInquiryDocument> =
  (mongoose.models.InvestorInquiry as Model<IInvestorInquiryDocument>) ||
  mongoose.model<IInvestorInquiryDocument>(
    "InvestorInquiry",
    InvestorInquirySchema
  );
