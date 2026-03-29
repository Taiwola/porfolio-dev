import mongoose, { Document, Schema, Model, CallbackError } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  id: string;
  email: string;
  password: string;
  fullName: string;
  avatar_url?: string;
  bio?: string;
  job_title?: string;
  stack?: string[];
  role: "user" | "admin";
  resume_url?: string;
  github_link?: string;
  linkedin_link?: string;
  twitter_link?: string;

  // Methods
  comparePassword(candidate: string): Promise<boolean>;
  updatePassword(newPassword: string): Promise<void>;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    avatar_url: { type: String },
    bio: { type: String },
    job_title: { type: String },
    stack: {
      type: [String],
      default: [],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    resume_url: { type: String },
    github_link: { type: String },
    linkedin_link: { type: String },
    twitter_link: { type: String },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error: any) {
    throw error;
  }
});

userSchema.methods.comparePassword = async function (
  candidate: string,
): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.updatePassword = async function (
  newPassword: string,
): Promise<void> {
  this.password = newPassword;
  await this.save();
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
