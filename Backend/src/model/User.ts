import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name?: string;
  email: string;
  avatar?: string;
  trips: string[];
}

const userSchema = new Schema<IUser>(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    avatar: String,
    trips: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
