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

  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);

    return res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.render("signin", { error: "Invalid email or password" });
  }
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

// {/* SIGN OUT */}
userRouter.get("/signout", (req, res) => {
  return res.clearCookie("token").redirect("/");
});