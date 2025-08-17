const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class UserController {
  static register = async (req, res) => {
    try {
      // console.log(req.body)
      const { name, email, password } = req.body;
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const data = await UserModel.create({
        name,
        email,
        password: hashedPassword,
      });
      res.json({
        data,
        msg: "user insert success",
      });
    } catch (error) {
      console.log(error);
    }
  };
  static login = async (req, res) => {
    try {
      console.log(req.body);
      const { email, password } = req.body;

      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      var token = jwt.sign(
        { ID: user._id },
        "pninfhhg7637246",
        { expiresIn: "2d" } // 2 din me token expire ho jayega
      );

      // Send token in HTTP-Only cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: true, // ✅ Netlify (HTTPS) के लिए true
        sameSite: "None", // ✅ Netlify और Render अलग domain हैं, तो "None" जरूरी
        maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
      });

      res.status(200).json({
        message: "Login successful",
        role: user.role,
        name: user.name,
        email: user.email,
        
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error", error });
    }
  };

  // 🚪 Logout
  static async logout(req, res) {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  }

  // 👤 Get profile
  static async getProfile(req, res) {
    try {
      const user = await User.findById(req.user._id).select("-password");
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Error fetching profile", error });
    }
  }

  static changePassword = async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;

      const user = await User.findById(req.user._id);
      if (!user || !user.password) {
        return res
          .status(404)
          .json({ message: "User not found or password missing" });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Old password is incorrect" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
      await user.save();

      return res.status(200).json({ message: "Password changed successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  };
}
module.exports = UserController;
