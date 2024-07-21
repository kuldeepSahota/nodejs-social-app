const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const updateFields = require("../utils/updateFields");
const { sendEmail, success, error } = require("../utils/helpers");
const { response } = require("express");

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        code: 400,
        message: "User already exists",
      });
    }
    const otp = Math.floor(1000 + Math.random() * 9000);

    user = new User({ username, email, password, otp });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5 days" },
      (err, token) => {
        if (err) throw err;
        const userResponse = user.toObject();
        delete userResponse.password;
        delete userResponse.otp;
        sendEmail(`${otp} is your OTP`, userResponse.email, "OTP verification");
        res.json({
          success: true,
          code: 200,
          message: "User register successfully",
          body: {
            token,
            user: userResponse,
          },
        });
      }
    );
  } catch (error) {
    console.error(error?.message);
    res.status(500).send("Server Error");
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email } = req.body;
    let check = await User.findOne({ email });
    console.log("User saved",check)
    if (!check) {
      return res.status(400).json({
        success: false,
        code: 400,
        message: "User not found",
      });
    } else {
      if (check.otp === req.body.otp) {
        check.isVerify = true;
        check.otp = null;
        await check.save();
        return success(res, true, 200, "OTP verified successfully",check);
      } else {
        return success(res, false, 200, "Invalid OTP");
      }
    }
  } catch (err) {
    return error(res, 500, "Internal server error");
  }
};

exports.sendOtp = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return success(res, false, 404, "User not found");
    } else {
      const otp = Math.floor(1000 + Math.random() * 9000);
      user.otp = otp;
      await user.save();
      sendEmail(`${otp} is your OTP`, user.email, "OTP verification");
    
      return success(res, true, 200, "OTP send successfully",otp);
    }
  } catch (error) {
    return error(res, 500, "Internal server error");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body; 

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        code: 400,
        message: "Invalid credentials",
      });
    }
    if (!user.isVerify) {
        return res.status(400).json({
          success: false,
          code: 400,
          message: "User is not verified",
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        code: 400,
        message: "Invalid credentials",
      });
    }

    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5 days" },
      (err, token) => {
        if (err) throw err;
        const userResponse = user.toObject();
        delete userResponse.password;
        res.json({
          success: true,
          code: 200,
          message: "User logged in successfully",
          body: {
            token,
            user: userResponse,
          },
        });
      }
    );
  } catch (error) {
    console.error("Error", error);
    res.status(500).send("Server error");
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.id });
    if (!user) {
      return res.status(404).json({
        success: false,
        code: 400,
        message: "User not found",
      });
    }

    await updateFields(req.body, user);
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      code: 200,
      message: "User updated successfully",
      body: userResponse,
    });
  } catch (error) {
    res.json({
      success: false,
      code: 500,
      message: "Server error",
    });
  }
};
