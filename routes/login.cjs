const express = require("express");
const session = require("express-session");
const router = express.Router();
const path = require("path");
const jwt = require("jsonwebtoken");
const { Admin_User } = require("../models/UserData");

const secretKey = "xyz";

function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  });
}

router.get("/users-profile", authenticateToken, (req, res) => {
  res.render("users-profile", {
    title: "Users Profile",
    currentRoute: req.url
  });
});

// Configure session middleware
// router.use(session({
//     secret: "process.env.ACCESS_TOKEN_SECRET", // Replace with your own secret key
//     resave: true,
//     saveUninitialized: true,
// }));

// // Middleware to log session data
// const logSessionData = (req, res, next) => {
//     console.log('Session data',req.session);
//     next();
// };
// router.use(logSessionData);

router.get("/", (req, res) => {
  res.render("pages-login", { title: "Admin Login", currentRoute: req.url });
});

router.post("/login", async (req, res, next) => {
  // console.log(req.body);
  const name = req.body.username;
  const password = req.body.password;
  try {
    const data = await Admin_User.findOne({
      UserName: name,
      Password: password
    });
    if (data) {
      const token = jwt.sign({ name }, secretKey, { expiresIn: "1hr" });
      res.json({ token });
    } else {
      res.send("incorrect username or password");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

const isAuthenticated = (req, res, next) => {
  if (req.session.username) {
    next();
  } else {
    // console.log('auth nhi');
    res.status(401).json({ error: "Unauthorized" });
  }
};
module.exports = isAuthenticated;

router.get("/check-session", isAuthenticated, (req, res) => {
  if (req.session.username) {
    // Session is set
    res.json({ message: "Session is set", username: req.session.username });
    console.log({ message: "Session is set", username: req.session.username });
  } else {
    // Session is not set
    res.json({ message: "Session is not set" });
    // console.log({ message: "Session is not set" });
  }
});

router.post("/logout", (req, res) => {
  // console.log('Received logout request'); // Add this line for debugging
  req.session.destroy((err) => {
    if (err) {
      // console.error("Error destroying session:", err);
      res.status(500).json({ error: "Server error" });
    } else {
      // Respond with JSON instead of rendering a view
      res.json({ message: "Logout successful" });
      // console.log({ message: "Logout successful" });/
      // console.log({ mess: req.session });
    }
  });
});

module.exports = router;
