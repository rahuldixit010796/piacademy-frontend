import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  role: "admin" | "user";
  avatar?: {
    url?: string;
    public_id?: string;
  };
  className?: string;
  collegeName?: string;
  contact?: string;
  favoriteSubject?: string;
  dream?: string;
    about?: string;   // ✅ add this

}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    avatar: {
      url: { type: String },
      public_id: { type: String },
    },
    // ✅ New optional fields for About Me
    className: { type: String, default: "" },
    collegeName: { type: String, default: "" },
    contact: { type: String, default: "" },
    favoriteSubject: { type: String, default: "" },
    dream: { type: String, default: "" },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
