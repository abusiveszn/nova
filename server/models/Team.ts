import mongoose, { Schema, Document, Model } from "mongoose";

// ==================== Team Room ====================
export interface ITeamRoomDocument extends Document {
  id: string;
  name: string;
  description: string;
  leaderId: string;
  inviteCode: string;
  memberIds: string[];
  createdAt: number;
  updatedAt?: number;
  visibility?: "private" | "public";
}

const TeamRoomSchema = new Schema<ITeamRoomDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    leaderId: { type: String, required: true },
    inviteCode: { type: String, required: true, unique: true },
    memberIds: { type: [String], default: [] },
    createdAt: { type: Number, default: () => Date.now() },
    updatedAt: { type: Number, default: () => Date.now() },
    visibility: {
      type: String,
      enum: ["private", "public"],
      default: "public",
    },
  },
  { timestamps: true }
);

export const TeamRoom: Model<ITeamRoomDocument> =
  (mongoose.models.TeamRoom as Model<ITeamRoomDocument>) ||
  mongoose.model<ITeamRoomDocument>("TeamRoom", TeamRoomSchema);

// ==================== Team Message ====================
export interface ITeamMessageDocument extends Document {
  id: string;
  roomId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: number;
  updatedAt?: number;
  pinned: boolean;
  edited?: boolean;
}

const TeamMessageSchema = new Schema<ITeamMessageDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    roomId: { type: String, required: true, index: true },
    authorId: { type: String, required: true },
    authorName: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Number, default: () => Date.now() },
    updatedAt: { type: Number, default: () => Date.now() },
    pinned: { type: Boolean, default: false },
    edited: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const TeamMessage: Model<ITeamMessageDocument> =
  (mongoose.models.TeamMessage as Model<ITeamMessageDocument>) ||
  mongoose.model<ITeamMessageDocument>("TeamMessage", TeamMessageSchema);
