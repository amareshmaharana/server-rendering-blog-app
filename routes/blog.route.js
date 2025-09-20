import { Router } from "express";
import multer from "multer";
import path from "path";

import { Blog } from "../models/Blog.model.js";

export const blogRouter = Router();

// {/* MULTER FOR FILE STORAGE */}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()} - ${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

// {/* ROUTER */}
blogRouter.get("/add-new-blog", (req, res) => {
  return res.render("addBlog", { user: req.user });
});

blogRouter.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  return res.render("blog", { blog, user: req.user });
});

blogRouter.post("/", upload.single("coverImage"), async (req, res) => {
  const { title, content } = req.body;
  const blog = await Blog.create({
    title,
    body: content,
    createdBy: req.user._id,
    coverImageURL: `/uploads/${req.file.filename}`,
  });
  return res.redirect(`/blog/${blog._id}`);
});
