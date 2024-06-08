import bcrypt from "bcrypt";
import crypto from "crypto";
import userModel from "../models/userModel.js";
import nodemailer from "nodemailer"; // Assuming nodemailer is used for sending emails

export const signup = async (req, res) => {
  const saltRounds = 10;
  const myPlaintextPassword = req.body.password;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(myPlaintextPassword, salt);
  try {
    const newUser = new userModel({
      email: req.body.email,
      mobile: req.body.mobile,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: hash,
    });
    await newUser.save();
    res.status(200).send("User created successfully!");
  } catch (err) {
    console.log("err");
    res.status(400).send(err);
  }
};

export const login = async (req, res) => {
  const myPlaintextPassword = req.body.password;
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send("No user found!");
    }
    const isPasswordCorrect = bcrypt.compareSync(
      myPlaintextPassword,
      user.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).send("Wrong password!");
    }
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const { password, isAdmin, ...otherDetails } = user._doc;
    res
      .cookie("tstore_token", accessToken)
      .status(200)
      .json({ refreshToken, accessToken, ...otherDetails });
  } catch (err) {
    console.log("error while login", err);
    res.send(err);
  }
};

export const deleteUser = async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.params.id);
    res.status(200).json("User deleted successfully!");
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getAllUser = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getUser = async (req, res) => {
  try {
    const users = await userModel.find({ email: req.params.email });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const changePassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found!");
    }
    const isOldPasswordCorrect = bcrypt.compareSync(oldPassword, user.password);
    if (!isOldPasswordCorrect) {
      return res.status(400).send("Old password is incorrect!");
    }
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(newPassword, salt);
    user.password = hash;
    await user.save();
    res.status(200).send("Password changed successfully!");
  } catch (err) {
    console.log("Error changing password", err);
    res.status(500).send(err);
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found!");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hash = bcrypt.hashSync(resetToken, 10);

    user.resetPasswordToken = hash;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetURL = `http://${req.headers.host}/resetPassword/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "Gmail", // or another service
      auth: {
        user: "kishan9rajput@gmail.com",
        pass: "egqt iabp hxij eftz",
      },
    });

    const mailOptions = {
      to: user.email,
      from: "passwordreset@example.com",
      subject: "Password Reset",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process:\n\n
      ${resetURL}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    transporter.sendMail(mailOptions, (error, response) => {
      if (error) {
        console.error("Error sending email", error);
        res.status(500).send("Error sending email");
      } else {
        res.status(200).send("Password reset email sent successfully!");
      }
    });
  } catch (err) {
    console.log("Error in forgotPassword", err);
    res.status(500).send(err);
  }
};

export const resetPassword = async (req, res) => {
  const { newPassword } = req.body;
  const token = req.params.token;
  try {
    const user = await userModel.findOne({
      resetPasswordToken: { $exists: true },
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .send("Password reset token is invalid or has expired.");
    }

    const isTokenValid = bcrypt.compareSync(token, user.resetPasswordToken);
    if (!isTokenValid) {
      return res
        .status(400)
        .send("Password reset token is invalid or has expired.");
    }

    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(newPassword, salt);

    user.password = hash;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).send("Password has been reset successfully!");
  } catch (err) {
    console.log("Error in resetPassword", err);
    res.status(500).send(err);
  }
};
