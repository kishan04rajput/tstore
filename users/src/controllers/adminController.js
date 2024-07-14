import bcrypt from "bcrypt";
import crypto from "crypto";
import adminModel from "../models/adminModel.js";
import staffModel from "../models/staffModel.js";
import nodemailer from "nodemailer";

export const signup = async (req, res) => {
  const saltRounds = 10;
  const myPlaintextPassword = req.body.password;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(myPlaintextPassword, salt);
  try {
    const isPresent = await adminModel.findOne({ email: req.body.email });
    if (isPresent) {
      console.log("isPresent");
      res.status(409).send("Admin already present!");
      return;
    }
    const newAdmin = new adminModel({
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: hash,
    });
    await newAdmin.save();
    res.status(201).send("Admin created successfully!");
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};

export const login = async (req, res) => {
  const myPlaintextPassword = req.body.password;
  try {
    const admin = await adminModel.findOne({ email: req.body.email });
    if (!admin) {
      return res.status(404).send("No admin found!");
    }
    const isPasswordCorrect = bcrypt.compareSync(
      myPlaintextPassword,
      admin.password
    );
    if (!isPasswordCorrect) {
      return res.status(401).send("Wrong password!");
    }

    const accessToken = admin.generateAccessToken();
    const refreshToken = admin.generateRefreshToken();

    admin.refreshToken = refreshToken;
    await admin.save({ validateBeforeSave: false });

    const { password, refreshToken: _, _id, __v, ...otherDetails } = admin._doc;
    res
      .cookie("tStoreAccessToken", accessToken)
      .status(200)
      .json({ ...otherDetails });
  } catch (err) {
    console.log("error while login", err);
    res.send(err);
  }
};

export const logout = async (req, res) => {
  res.clearCookie("tStoreAccessToken");
  res.status(200).send("Logged out");
};

export const deleteAdmin = async (req, res) => {
  try {
    await adminModel.findByIdAndDelete(req.params.id);
    res.status(200).json("Admin deleted successfully!");
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getAllAdmins = async (req, res) => {
  try {
    const admins = await adminModel.find();
    res.status(200).json(admins);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getAdmin = async (req, res) => {
  try {
    const admin = await adminModel.findOne({ email: req.params.email });
    res.status(200).json(admin);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const changePassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  try {
    const admin = await adminModel.findOne({ email });
    if (!admin) {
      return res.status(404).send("Admin not found!");
    }
    const isOldPasswordCorrect = bcrypt.compareSync(
      oldPassword,
      admin.password
    );
    if (!isOldPasswordCorrect) {
      return res.status(400).send("Old password is incorrect!");
    }
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(newPassword, salt);
    admin.password = hash;
    await admin.save();
    res.status(200).send("Password changed successfully!");
  } catch (err) {
    console.log("Error changing password", err);
    res.status(500).send(err);
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const admin = await adminModel.findOne({ email });
    if (!admin) {
      return res.status(404).send("Admin not found!");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hash = bcrypt.hashSync(resetToken, 10);

    admin.resetPasswordToken = hash;
    admin.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await admin.save();

    const resetURL = `http://${req.headers.host}/resetPassword/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "Gmail", // or another service
      auth: {
        user: "kishan9rajput@gmail.com",
        pass: "egqt iabp hxij eftz",
      },
    });

    const mailOptions = {
      to: admin.email,
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
    const admin = await adminModel.findOne({
      resetPasswordToken: { $exists: true },
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!admin) {
      return res
        .status(400)
        .send("Password reset token is invalid or has expired.");
    }

    const isTokenValid = bcrypt.compareSync(token, admin.resetPasswordToken);
    if (!isTokenValid) {
      return res
        .status(400)
        .send("Password reset token is invalid or has expired.");
    }

    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(newPassword, salt);

    admin.password = hash;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;

    await admin.save();

    res.status(200).send("Password has been reset successfully!");
  } catch (err) {
    console.log("Error in resetPassword", err);
    res.status(500).send(err);
  }
};

export const createStaff = async (req, res) => {
  const saltRounds = 10;
  const myPlaintextPassword = req.body.password;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(myPlaintextPassword, salt);
  try {
    const isPresent = await staffModel.findOne({ email: req.body.email });
    if (isPresent) {
      console.log("isPresent");
      res.status(409).send("Staff already present!");
      return;
    }
    const newStaff = new staffModel({
      email: req.body.email,
      mobile: req.body.mobile,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: hash,
    });
    await newStaff.save();
    res.status(201).send("Staff created successfully!");
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};

export const deleteStaff = async (req, res) => {
  try {
    await staffModel.findByIdAndDelete(req.params.id);
    res.status(200).json("Staff deleted successfully!");
  } catch (err) {
    res.status(500).json(err);
  }
};
