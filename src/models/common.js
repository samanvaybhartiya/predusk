import mongoose from "mongoose";
export const LinkSchema = new mongoose.Schema(
  { label: String, url: String },
  { _id: false }
);
export const EducationSchema = new mongoose.Schema(
  { school: String, degree: String, start: String, end: String },
  { _id: false }
);
export const WorkSchema = new mongoose.Schema(
  {
    company: String,
    role: String,
    start: String,
    end: String,
    description: String,
  },
  { _id: false }
);
