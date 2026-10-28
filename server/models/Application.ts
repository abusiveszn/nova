import mongoose, { Schema, Document, Model } from "mongoose";

export interface IApplicationDocument extends Document {
  id: string;
  projectId: string;
  builderId: string;
  builderName: string;
  builderAvatar: string;
  status: "pending" | "accepted" | "rejected";
  message: string;
  createdAt: number;
  updatedAt?: number;
  respondedAt?: number;
}

const ApplicationSchema = new Schema<IApplicationDocument>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    projectId: {
      type: String,
      required: true,
      index: true,
    },
    builderId: {
      type: String,
      required: true,
      index: true,
    },
    builderName: {
      type: String,
      required: true,
    },
    builderAvatar: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    message: {
      type: String,
      default: "",
    },
    createdAt: {
      type: Number,
      default: () => Date.now(),
    },
    updatedAt: {
      type: Number,
      default: () => Date.now(),
    },
    respondedAt: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export const Application: Model<IApplicationDocument> =
  (mongoose.models.Application as Model<IApplicationDocument>) ||
  mongoose.model<IApplicationDocument>("Application", ApplicationSchema);
