import express from "express";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import { userRouter } from "./routes/user.route.js";
import { checkForAuthenticationCookie } from "./middlewares/auth.middleware.js";

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

// {/* ++++++ ROUTES ++++++ */}
app.get("/", (req, res) => {
  res.render("home", {
    user: req.user,
  });
});

app.use("/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on PORT happily: ${PORT}`);
});
