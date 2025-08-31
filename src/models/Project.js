import mongoose from "mongoose";
import { LinkSchema } from "./common.js";
const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, index: true },
    description: String,
    skills: [{ type: String, index: true }],
    links: [LinkSchema],
  },
  { timestamps: true }
);
ProjectSchema.index({ title: "text", description: "text", skills: "text" });
export default mongoose.model("Project", ProjectSchema);
