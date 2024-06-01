var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
const cors = require("cors");
var crypto = require("crypto");
var config = require("./config/Config.js");
var mongoose = require("mongoose");
const bodyParser = require("body-parser");
const sidebarLinks = require("./data/sidebarLinks.cjs");
var logoutRouter = require("./routes/logout");
var Router = require("./routes/index.js");
// userrouter
var userrouter = require("./routes/users.js");

var loginRouter = require("./routes/login.cjs");

var app = express();
// const allowedDomains = [
//   "https://port.ocean369.com",
//   "https://portland.ocean369.com",
//   "http://localhost:3000",
//   "https://landscapbackendproject6.onrender.com"
// ];
// const corsOptions = {
//   origin: "http://localhost:3000", // Allow requests only from localhost:3000
//   methods: "GET,POST", // Allow only GET and POST requests
//   credentials: true // Allow credentials like cookies to be sent with the requests
// };
// "http://localhost:5000",
// "http://localhost:5000",
// "https://lobby.teenpattirummycircle.com"
//"http://localhost:5000", "https://rummykaadda.online"

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5000",
  "https://teenpattiultra.online",
  "https://lobby.teenpattiultra.online"
];

// Configure CORS
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error("Not allowed by CORS")); // Deny the request
    }
  }
};

// Use the CORS middleware with the configured options
app.use(cors(corsOptions));
// app.use(cors({ origin: "port.ocean369.com));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Make sidebarLinks available to your entire application
app.locals.sidebarLinks = sidebarLinks;

app.use(bodyParser.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html"); // Change the view engine to 'html'
app.engine("html", require("ejs").renderFile); // Use ejs to render HTML files

// app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", Router);
app.use("/", loginRouter);

app.use("/users", userrouter);
// Serve static files from the 'public' directory
app.use(express.static("public"));
// app.use('/api', loginRouter)
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    writeConcern: {
      w: "majority",
      wtimeout: 0,
      provenance: "clientSupplied"
    }
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// Enable Mongoose debugging
// mongoose.set('debug', true);

// const allowedOrigins = ["http://localhost:3000/"];
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // Allow requests with no origin (e.g., from mobile apps or curl requests)
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true // enable passing cookies, authorization headers, etc.
//   })
// );
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

const port = config.port;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// // Drop the index
// db.candidatepancarddatas.dropIndex("candidateName_1");

module.exports = app;
