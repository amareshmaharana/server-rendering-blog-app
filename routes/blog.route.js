import { Router } from "express";
import multer from "multer";
import path from "path";

import { Blog } from "../models/Blog.model.js";
import { Comment } from "../models/comment.model.js";

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

// {/}
blogRouter.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({ blogId: req.params.id }).populate(
    "createdBy"
  );
  return res.render("blog", {
    blog,
    user: req.user,
    comments,
  });
});

// {/* COMMENT ROUTER */}
blogRouter.post("/comment/:blogId", async (req, res) => {
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });

  return res.redirect(`/blog/${req.params.blogId}`);
});

// {/* FULL BLOG ROUTER */}
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
