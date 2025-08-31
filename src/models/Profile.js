import mongoose from "mongoose";
import { LinkSchema, EducationSchema, WorkSchema } from "./common.js";
const ProfileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    summary: String,
    links: {
      github: String,
      linkedin: String,
      portfolio: String,
      other: [LinkSchema],
    },
    education: [EducationSchema],
    work: [WorkSchema],
    skills: [{ type: String, index: true }],
  },
  { timestamps: true }
);
export default mongoose.model("Profile", ProfileSchema);
