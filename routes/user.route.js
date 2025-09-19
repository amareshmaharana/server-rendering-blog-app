import { Router } from "express";

import { User } from "../models/user.model.js";

export const userRouter = Router();

userRouter.get("/signin", (req, res) => {
  return res.render("signin");
});

userRouter.get("/signup", (req, res) => {
  return res.render("signup");
});

// {/* SIGN IN */}
userRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.matchPassword(email, password);
  // if (!user) {
  //   return res.redirect("/signin");
  // }

  console.log("User found: ", user);
  return res.redirect("/");
});

// {/* SIGN UP */}
userRouter.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;

  await User.create({
    fullName,
    email,
    password,
  });

  return res.redirect("/");
});
