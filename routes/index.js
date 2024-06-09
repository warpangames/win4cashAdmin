var express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const multer = require('multer');
// const {
//   priceControllerOfGame
// } = require("../controller/Admin.js/Controller.js");

const {
  ManualapprovePost,
  UserloginData,
  manualRejectPost,
  sendOTP,
  ReferWinDataController,
  ReferErnDataGet,
  ManualPaymentHistoryData,
  ReferEarnFixedAmt,
  ReferWinDataFixedAmt,
  refreeData,
  ManaualGetDataForapprov,
  ReferWinDataFixedAmtgetdata,
  ReferWinDataGet,
  DeletereferBounsAmount,
  paymentHistoryGetdata,
  WithdrawTextDatagetData,
  DeletereReferWin,
  FestivalBonusEdit,
  festivalgetAlldata,
  updateotp,
  deleteSIngleMailUser,
  getdailyBonusDatas,
  referwin,
  withdrowapprovePost,
  paymentHistoryGetdataSingle,
  SingleMailPost,
  DailyBonusData,
  withdrawgetAll,
  DailyBonusFetchData,
  MailHistorySchemaData,
  PlayasGuest,
  fetchSingleUserMailData,
  GameHistoryDataGet,
  FestivalBonus,
  DeletereReferEarnfixedData,
  SingleUserMailEdit,
  FestivalBonusforuserEditInFestival,
  GamePriceDataController,
  DeletereReferWinsecond,
  FestivalBonusHistory,
  validatebinding,
  DeletereReferEarn,
  FestivalBonusforuser,
  GamePriceGetwithoutid,
  ReferErnData,
  MailTextData,
  GameHistoryData,
  FestivalBonusDeleter,
  FestivalBonusforuserDelete,
  // updateotpByname,
  // updateotpByNumber,
  // updateotptwo,

  // withdrowrejectUpdate,
  Withdrowtext,
  // GetpancarDetails,

  // withdrowrejectGet,
  // withdrowapproveUpdate,

  withdrowapproveGet,
  TotalNumberUser,
  TotalNumberOfPendingWith,
  // withdrowgetdata,
  // walletupdate,
  // getcarromdatahistory,
  DeletereWithdrawfText,
  // withdrow,
  // userDetails,
  // CarromPriceData,
  // candidatepan,
  // GamePriceGet,f
  geimg,
  // Getalldatauser,
  //post admin
  AddAdmin,
  withdrowrejectPost,
  DailyDataforfrontenddata,
  // get Admin
  callbackpayemnt,
  GetAdminUser,
  //update admin
  UpdateAdmin,
  //change admin password
  manualgetdataForreject,
  ChangeAdminPassword,
  PaymentHistorinsert,
  //multerfimgaesupload
  UploadImgMulter,
  DeleteAdminImg,
  getManulDataPayment,
  // BankDeatilsOfUser,
  // UpiDeatilsOfUser,
  // BankDeatilsOfUser,
  // UpiDeatilsOfUserget,
  // BankDeatilsOfUserGet,
  // Gamehistory,
  justchekck,
  ManualPayment,
  EditName,
  referwin_Getdata,
  BankDetails,
  BankDetailsgets,
  upiDetails,
  UpiDetailsgets,
  withdraw,
  withdrawget,
  GamePricePostdelete,
  ManualPaymentHistoryDatagetData,
  SliderImages,
  MailForUserData,
  UploadImgMulter1,
  getSliderImages,
  DeleteManualPayment,
  updateManual,
  UploadImgMulter2,
  imgaesuploadNotice,
  getNoticeImages,
  MailUpdate,
  deletEeNoticeImage,
  updateNotice,
  Payment,
  UserFetchData,
  UserPersonalFetchData,
  SpinnerBonus,
  BindingData,
  MailForHistory,
  MailHistoryEditforUser,
  MailHistoryEdit,
  MailHistoryDeleteAllUser,
  UserPersonalTotalLoss,
  TotalNumberOfPendingRecharge,
  MailHistoryDelete,
  PaymentHistorUpdate,
  ReferEarnFixedAmtgetData
  // Gamehistory,
  // lobbyhistory
} = require("../controller/User/UserLofinController.js");
const upload = multer();
const secretKey = "xyz";

function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  // console.log(token);
  if (!token) {
    return res.redirect("/");
  }
  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.redirect("/");
    }
    next();
  });
}

const router = express.Router();
// router.get("/userDetails", userDetails);
// router.get("/", async (req, res) => {
// try {
// Make multiple GET requests
// const [
// userDetailsResponse
// ludodataResponse,
// pooldataResponse,
// carromdataResponce
// ] = await Promise.all([
//   axios.get("https://landscapbackendproject6.onrender.com/userDetails")
// axios.get("https://landscapbackendproject6.onrender.com/getludodatahistory"),
// axios.get("https://landscapbackendproject6.onrender.com/getpoopdatahistory"),
// axios.get("https://landscapbackendproject6.onrender.com/getcarromdatahistory")
// ]);

// Extract data from the responses
// const userdata = userDetailsResponse.data;
// const ludodata = ludodataResponse.data;
// const pooldata = pooldataResponse.data;
// const carromdata = carromdataResponce.data;
// console.log("User Data:", userdata);
// console.log("Ludo Data:", ludodata);
// console.log("carrom Data:", carromdata);
// console.log("pool Data:", pooldata);

// Render the view with both sets of data


router.get("/home", authenticateToken,async (req, res) => {
  try {
    
    res.render("index", {
      title: "Dashboard",
      currentRoute: req.url,
      // TotalNumberUser,
      // TotalNumberWith,
      // TotalNumberOfRecharegData
    });
  } catch (error) {
    console.error("Error fetching game prices:", error);
    res.render("error", { error: "Failed to fetch game prices" });
  }
});



router.get("/player",authenticateToken, async (req, res) => {
  try {
       res.render("player", {
      title: "Entryfees",
      currentRoute: req.url,
      // userdata
    });
  } catch (error) {
    console.error("Error fetching game prices:", error);
    res.render("error", { error: "Failed to fetch game prices" });
  }
});

router.get("/user",authenticateToken, async (req, res) => {
  const userId = req.query.id;
  try {
   
    res.render("user", {
      title: "Entryfees",
      currentRoute: req.url,
      // userdata1,
      // gameHistoryData,
      // withdrawdata,
      // paymentHistorydata,
      // TotalLossData
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.render("error", { error: "Failed to fetch user data" });
  }
});

router.get("/users-profile",authenticateToken, (req, res) => {
  res.render("users-profile", {
    title: "Users Profile",
    currentRoute: req.url
  });
});

router.get("/Man_rech_pe",authenticateToken, async (req, res) => {
  try {
    res.render("Man_rech_pe", {
      title: "Man_rech_pe",
      currentRoute: req.url,
    });
  } catch (error) {
    console.error("Error fetching refer bonus data:", error);
    return res.render("error", { error: "Failed to fetch notice data" }); // Add return here
    // res.render("error", { error: "Failed to fetch game prices" });
  }
});

router.get("/Man_rech_app",authenticateToken, async (req, res) => {
  try {
    res.render("Man_rech_app", {
      title: "Man_rech_app",
      currentRoute: req.url,
      // withdrawapprove
    });
  } catch (error) {
    // console.error("Error fetching ImgSlider:", error);s
    res.render("error", { error: "Failed to fetch game prices" });
  }
});
router.get("/man_rech_rej",authenticateToken, async (req, res) => {
  try {
    res.render("Man_rech_rej", {
      title: "Man_rech_rej",
      currentRoute: req.url,
    });
  } catch (error) {
    // console.error("Error fetching ImgSlider:", error);s
    res.render("error", { error: "Failed to fetch game prices" });
  }
});

router.get("/pages-register",authenticateToken, (req, res) => {
  res.render("pages-register", {
    title: "pages-register",
    currentRoute: req.url
  });
});

router.get("/pages-contact",authenticateToken, (req, res) => {
  res.render("pages-contact", { title: "Bonus", currentRoute: req.url });
});

router.get("/Bonus", authenticateToken,async (req, res) => {
  try {
  
    res.render("bonus", {
      title: "bonus",
      currentRoute: req.url,
    });
  } catch (error) {
    console.error("Error fetching refer bonus data:", error);
    return res.render("error", { error: "Failed to fetch notice data" }); // Add return here
    // res.render("error", { error: "Failed to fetch game prices" });
  }
  // res.render("Bonus", { title: "Bonus", currentRoute: req.url });
});

router.get("/Refer",authenticateToken, async (req, res) => {
  try {

    res.render("refer", {
      title: "Approval",
      currentRoute: req.url,
      // ReferEarndata,
      // ReferEarnFixedAmt
    });
  } catch (error) {
    // console.error("Error fetching ImgSlider:", error);
    res.render("error", { error: "Failed to fetch game prices" });
  }
});

router.post("/DeletereReferEarn",authenticateToken, DeletereReferEarn);

router.get("/Win_lose",authenticateToken, (req, res) => {
  res.render("Win_lose", { title: "Win", currentRoute: req.url });
});

router.get("/slider",authenticateToken, async (req, res) => {
  try {
    res.render("slider", {
      title: "Slider",
      currentRoute: req.url,
      // ImgNotice: ImgNotice
    });
  } catch (error) {
    console.error("Error fetching ImgSlider:", error);
    return res.render("error", { error: "Failed to fetch notice data" }); 
  }
});

router.get("/tic_re",authenticateToken, (req, res) => {
  res.render("tic_re", { title: "Ticket Request", currentRoute: req.url });
});

router.get("/tic_app",authenticateToken, (req, res) => {
  res.render("tic_app", { title: "Ticket Approval", currentRoute: req.url });
});
router.get("/ReferWin",authenticateToken, async (req, res) => {
  try {
    res.render("ReferWin", {
      title: "Refer Win",
      currentRoute: req.url,
      referwindata: referwin,
      // referwinfixeddata
    });
  } catch (error) {
    console.error("Error fetching ImgSlider:", error);
    return res.render("error", { error: "Failed to fetch notice data" }); // Add return here
    // res.render("error", { error: "Failed to fetch game prices" });
  }
});
router.post("/DeletereReferWin",authenticateToken, DeletereReferWin);
// router.get("/Carrom", (req, res) => {
//   res.render("Carrom", { title: "Ticket Approval", currentRoute: req.url });
// });

router.get("/rech_rej",authenticateToken, async (req, res) => {
  try {
    res.render("rech_rej", {
      title: "Recharge Reject",
      currentRoute: req.url,
      // userdata: userdata
    });
  } catch (error) {
    console.error("Error fetching ImgSlider:", error);
    return res.render("error", { error: "Failed to fetch notice data" }); // Add return here
    // res.render("error", { error: "Failed to fetch game prices" });
  }
});

router.get("/rech_pe",authenticateToken, async (req, res) => {
  try {
    res.render("rech_pe", {
      title: "Recharge Request",
      currentRoute: req.url,
      // userdata: userdata
    });
  } catch (error) {
    console.error("Error fetching ImgSlider:", error);
    return res.render("error", { error: "Failed to fetch notice data" }); // Add return here
    // res.render("error", { error: "Failed to fetch game prices" });
  }
});

router.get("/rech_app",authenticateToken, async (req, res) => {
  try {
    res.render("rech_app", {
      title: "Recharge Approval",
      currentRoute: req.url,
    });
  } catch (error) {
    console.error("Error fetching ImgSlider:", error);
    return res.render("error", { error: "Failed to fetch notice data" }); // Add return here
    // res.render("error", { error: "Failed to fetch game prices" });
  }
});

router.get("/paymentManul",authenticateToken, async (req, res) => {
  try {
    res.render("paymentManul", {
      title: "paymentManul",
      currentRoute: req.url,
      // ImgSlider
    });
  } catch (error) {
    console.error("Error fetching refer bonus data:", error);
    return res.render("error", { error: "Failed to fetch notice data" });
  }
});

router.get("/Ludo",authenticateToken, (req, res) => {
  res.render("Ludo", { title: "Ludo", currentRoute: req.url });
});

router.get("/Carrom", authenticateToken,async (req, res) => {
  try {
    res.render("Carrom", {
      title: "Carrom",
      currentRoute: req.url,
      // carromPrices
    });
  } catch (error) {
    console.error("Error fetching game prices:", error);
    res.render("error", { error: "Failed to fetch game prices" });
  }
});

router.get("/Slide",authenticateToken, async (req, res) => {
  try {
    res.render("Slide", {
      title: "Reject",
      currentRoute: req.url,
      // ImgSlider
    });
  } catch (error) {
    // console.error("Error fetching ImgSlider:", error);s
    res.render("error", { error: "Failed to fetch game prices" });
  }
});

router.get("/with_re",authenticateToken, async (req, res) => {
  try {
    
    res.render("with_re", {
      title: "Approval",
      currentRoute: req.url,
      // withdrawrequest,
      // withdrawtxt
    });
  } catch (error) {
    // console.error("Error fetching ImgSlider:", error);s
    res.render("error", { error: "Failed to fetch game prices" });
  }
});
router.get("/with_app",authenticateToken, async (req, res) => {
  try {
    
    res.render("with_app", {
      title: "Approval",
      currentRoute: req.url,
      // withdrawapprove
    });
  } catch (error) {
    // console.error("Error fetching ImgSlider:", error);s
    res.render("error", { error: "Failed to fetch game prices" });
  }
});
router.get("/mail",authenticateToken, async (req, res) => {
  try {
 
    res.render("mail_page", {
      title: "Approval",
      currentRoute: req.url,
      // festivaldata
    });
  } catch (error) {
    // console.error("Error fetching ImgSlider:", error);s
    res.render("error", { error: "Failed to fetch game prices" });
  }
});
router.get("/mailBonus",authenticateToken, async (req, res) => {
  try {
    res.render("mailPageBonus", {
      title: "Approval",
      currentRoute: req.url,
      // Mailldatacollection,
      // UserFetchDataforMail
    });
  } catch (error) {
    console.error("Error fetching User:", error);
    res.render("error", { error: "Failed to fetch User" });
  }
});
router.get("/SingleMalForUser/:id",authenticateToken, async (req, res) => {
  try {
    // Make a GET request to the GamePriceGet API  fetchSingleUserMailData
    const { id } = req.params;
    res.render("mailPageBonusSingleUser", {
      title: "Approval",
      currentRoute: req.url,
      // fetchSingleUserMailDatadetails
    });
  } catch (error) {
    console.error("Error fetching User:", error);
    res.render("error", { error: "Failed to fetch User" });
  }
});

router.get("/with_rej", authenticateToken,async (req, res) => {
  try {
    res.render("with_rej", {
      title: "Approval",
      currentRoute: req.url,
      // withdrawapprove
    });
  } catch (error) {
    // console.error("Error fetching ImgSlider:", error);s
    res.render("error", { error: "Failed to fetch game prices" });
  }
});

router.get("/festival",authenticateToken, async (req, res) => {
  try {
  
    res.render("festival", {
      title: "Approval",
      currentRoute: req.url,
      // dailybonsdatas
    });
  } catch (error) {
    // console.error("Error fetching ImgSlider:", error);s
    res.render("error", { error: "Failed to fetch game prices" });
  }
});

router.post("/UserloginData",authenticateToken, UserloginData);
// withdrwa reject and request post router

//add admin
router.post("/AddAdmin", AddAdmin);

// update admin
router.post("/users-profile",authenticateToken, UploadImgMulter, UpdateAdmin);

//getAdmin
router.get("/AdminData",authenticateToken, GetAdminUser);

// change admin password
router.post("/ChangeAdminPassword",authenticateToken, ChangeAdminPassword);
//delete admin profile img router
router.post("/DeleteAdminImg",authenticateToken, DeleteAdminImg);

// router.post("/profitmulti",Admin.BatXupdate)
// router.get("/batdata",Logic.AdminSending);
// router.post("/adminresult",Logic.IncomingResultfromAdmin);

// router.get("/pendingreq",async (req,res)=>{
//     const data = returnmodel.find({satuts:"pending"}).sort({_id:-1})
//     res.json(data);
// })
// router.get("/rejectreq",async (req,res)=>{
//     const data = returnmodel.find({satuts:"reject"}).sort({_id:-1})
//     res.json(data);
// })
// router.get("/acceptreq",async (req,res)=>{
//     const data = returnmodel.find({satuts:"accept"}).sort({_id:-1})
//     res.json(data);
// })



// module.exports = router;
 module.exports = router;
