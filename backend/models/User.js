import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    isEmailConfirmed: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    confirmEmailToken: String,
    confirmEmailExpire: Date,
  },
  { timestamps: true }
);

// Encrypting password using bcryptjs
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// check if password matches
UserSchema.methods.matchPasswords = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// get signed JWT token
UserSchema.methods.getSignedJWT = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// confirm email token
UserSchema.methods.generateVerificationToken = function (next) {
  const emailToken = crypto.randomBytes(20).toString("hex");

  this.confirmEmailToken = crypto
    .createHash("sha256")
    .update(emailToken)
    .digest("hex");

  const emailTokenExtend = crypto.randomBytes(100).toString("hex");
  const confirmTokenCombined = `${emailToken}.${emailTokenExtend}`;

  this.confirmEmailExpire = Date.now() + 10 * 60 * 1000;

  return confirmTokenCombined;
};

// UserSchema.methods.getResetPasswordToken = function () {
//   const resetToken = await crypto.randomBytes(20).toString('hex')
// }

export default mongoose.model("User", UserSchema);
