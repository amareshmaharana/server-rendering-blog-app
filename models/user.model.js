import { createHmac, randomBytes } from "crypto";
import mongoose, { Schema } from "mongoose";

import { createTokenForUser } from "../utils/authentication.js";

const userSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    salt: { type: String },
    password: { type: String, required: true },
    profileImgURL: {
      type: String,
      default: "/public/images/defaultProImg.png",
    },
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return;

  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.password = hashedPassword;
  this.salt = salt;
  next();
});

userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email });

    if (!user) throw new Error("User not found!!");

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHashedPassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    if (userProvidedHashedPassword !== hashedPassword)
      throw new Error("Invalid password!!");

    const token = createTokenForUser(user);
    return token;
  }
);

export const User = mongoose.model("User", userSchema);
