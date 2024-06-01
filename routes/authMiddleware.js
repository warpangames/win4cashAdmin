// authMiddleware.js

const isAuthenticated = (req, res, next) => {
  if (req.session.username) {
    // User is authenticated, proceed to the next middleware or route
    next();
    console.log("auth");
    // alert("nana")
  } else {
    console.log("auth nhi");
    res.status(401).json({ error: "Unauthorized" });
  }
  a;
};

module.exports = isAuthenticated;
