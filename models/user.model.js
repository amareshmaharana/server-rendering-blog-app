import { createHmac, randomBytes } from "crypto";
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    salt: { type: String, required: true },
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

export const User = mongoose.model("User", userSchema);
