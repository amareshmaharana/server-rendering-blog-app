import express from "express";
import path from "path";
import mongoose from "mongoose";

import { userRouter } from "./routes/user.route.js";

const app = express();
const PORT = 3000;

// for database
mongoose
  .connect("mongodb://localhost:27017/blognode")
  .then((e) => console.log("DB successfully connected"))
  .catch((e) => console.log(e));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("home");
});

app.use("/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on PORT happily: ${PORT}`);
});
