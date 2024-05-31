import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const signup = async (req, res) => {
  const saltRounds = 10;
  const myPlaintextPassword = req.body.password;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(myPlaintextPassword, salt);
  try {
    const newUser = new userModel({
      email: req.body.email,
      mobile: req.body.mobile,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      password: hash,
    });
    await newUser.save();
    res.status(200).send("User created successfully!");
  } catch (err) {
    res.send(err);
  }
};

export const login = async (req, res) => {
  const myPlaintextPassword = req.body.password;
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res.send(400, "No user found!");
    }
    const isPasswordCorrect = bcrypt.compareSync(
      myPlaintextPassword,
      user.password
    );
    if (!isPasswordCorrect) {
      return res.send(400, "Wrong password!");
    }
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const { password, isAdmin, ...otherDetails } = user._doc;
    res
      .cookie("accessToken", accessToken)
      .status(200)
      .json({ refreshToken, accessToken, ...otherDetails });
  } catch (err) {
    console.log("error while login", err)
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
