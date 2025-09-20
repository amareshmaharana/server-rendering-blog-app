import express from "express";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import { userRouter } from "./routes/user.route.js";
import { checkForAuthenticationCookie } from "./middlewares/auth.middleware.js";
import { blogRouter } from "./routes/blog.route.js";
import { Blog } from "./models/Blog.model.js";

const app = express();
const PORT = 3000;

// {/* ++++++ DATABASE CONNECTION ++++++ */}
mongoose
  .connect("mongodb://localhost:27017/blognode")
  .then((e) => console.log("DB successfully connected"))
  .catch((e) => console.log(e));

// {/* ++++++ EJS SETUP ++++++ */}
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// {/* ++++++ MIDDLEWARES ++++++ */}
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

// {/* ++++++ ROUTES ++++++ */}
app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({}).sort({ createdAt: -1 });
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.use("/user", userRouter);
app.use("/blog", blogRouter);

app.listen(PORT, () => {
  console.log(`Server is running on PORT happily: ${PORT}`);
});
