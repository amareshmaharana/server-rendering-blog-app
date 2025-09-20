import mongoose, { Schema } from "mongoose";

const blogSchema = new Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    coverImgURL: { type: String, required: false },
  },
  { timestamps: true }
);

export const Blog = mongoose.model("Blog", blogSchema);
