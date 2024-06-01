const Jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const path = require("path");
const bcrypt = require("bcryptjs");
const Joi = require("@hapi/joi");
const crypto = require("crypto");
const formidable = require("formidable");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const PaytmChecksum = require("../../PaytmChecksum");
const userloginDatas = require("../../models/LofinUserDetail");
const {
  Types: { ObjectId }
} = require("mongoose");
const GamePriceData = require("../../models/GamePriceData");
const withdraPostData = require("../../models/withdraPostData");
const Admin_User = require("../../models/UserData");
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
const axios = require("axios");
const { JustCheck, ImgModel } = require("../../models/Justcheck");
const BankDetail = require("../../models/BankDetails");
const UpiDetail = require("../../models/UpiDetails");
const {
  ImgCollectiondata,
  NoticeCollectiondata
} = require("../../models/ImagesColletion");

const { FestivalBonusData } = require("../../models/FestivalBonusCollection");
const {
  validateFestivalBonus
} = require("../../models/FestivalBonusCollection");

const { MaiBonusDataAll } = require("../../models/MailForAll");
const ReferEarnData = require("../../models/ReferEarn");
const UserDailyBonusData = require("../../models/DailyBonusData");
const ReferWinData = require("../../models/ReferWin");
const FixedAmountData = require("../../models/ReferEarnFixedAmnt");
const WithdrawTextData = require("../../models/WithdrawText");
const FixedAmountDataOfWin = require("../../models/FixedAmountDataWin");
const { ManualCollectData } = require("../../models/ManualPaymentGateway");

// const BankWithdrawDetails = require("../../models/BankWithdrawDetails");
// const UpiWithdrawDetails = require("../../models/UpiWithdrawDetails");
// const BankWithdrawDetails = require("../../models/BankWithdrawDetails");
// const GameHistorylobby = require("../../models/GameHistory");
// const historylobbygame = require("../../models/Lobbyhistory");

// const userloginDatas = require("../../models/LofinUserDetail");

// const SendOtp = async (userotp, userphone) => {
//   console.log("Before sending OTP:", userotp);
//   // console.log("Before sending OTP:", userphone);
//   try {
//     const response = await axios.post(
//       `https://landscapbackendproject6.onrender.com/send-otp`,
//       {
//         userphone: userphone,
//         userotp: userotp
//       }
//     );
//     if (response.data) {
//       // console.log("Data Sent Successfully", response.data);
//     }
//   } catch (error) {
//     console.error("Error sending OTP:", error);
//   }
//   // const userotp = Math.floor(1000 + Math.random() * 9000);
// };
exports.referwin = async (req, res, next) => {
  try {
    const { refer, referUser, newuser } = req.body;
    // Update the document directly without checking for existence
    const result = await Admin_User.User_refer_win.findOneAndUpdate(
      {},
      {
        refer,
        referUser,
        newuser
      },
      { upsert: true }
    );

    res.status(200).json({ message: "Data updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.referwin_Getdata = async (req, res, next) => {
  try {
    const data = await Admin_User.User_refer_win.find();
    res.send(data);
  } catch (error) {
    // console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
//  userlogin , referbonus, userReferbonus , Singin Bonus controller start

exports.UserloginData = async (req, res, next) => {
  const { username, userphone, reffralcode, usereffral, userotp } = req.body;
  // console.log(req.body);
  // console.log(username, userphone, reffralcode, usereffral, userotp);
  const responseEarn = await axios.get(
    "http://localhost:5000/ReferErnDataGet"
  );
  const ReferEarndataa = responseEarn.data;
  const UserBonusData = ReferEarndataa[0]?.newuser || 0;
  const firstParentdata = ReferEarndataa[0]?.firstParent || 0;
  const SecondParentdata = ReferEarndataa[0]?.SecondParent || 0;
  const ThirdParentdata = ReferEarndataa[0]?.ThirdParent || 0;
  const FourParentdata = ReferEarndataa[0]?.FourParent || 0;

  const UserBonusDataKey = "Child Bonus";
  const FirstParentKey = "First Parent";
  const SecondBonusKey = "Second Parent";
  const ThirdBonusKey = "Third Parent";
  const FourBonusKey = "Four Parent";
  const getDailyDayBonusData = await axios.get(
    "http://localhost:5000/getdailyBonusDatas"
  );
  const DayBonus = getDailyDayBonusData.data;
  // console.log(DayBonus);H
  const res_data_of_newuser_bonas = await axios.get(
    `http://localhost:5000/referwin_Getdata`
  );
  const firstDataObject = res_data_of_newuser_bonas.data[0];
  const newuser_singin = firstDataObject.newuser;
  const referUser_bonus = firstDataObject.referUser;
  const refer_bonus = firstDataObject.refer;
  const festivalgetAlldata = await axios.get(
    `http://localhost:5000/festivalgetAlldata`
  );
  const festivalData = festivalgetAlldata.data || "";

  const MailDataall = await axios.get(
    `http://localhost:5000/MailHistorySchemaData`
  );
  const MailData = MailDataall.data || "";

  const singupbonus = "sing in";
  const referbonus = "refer bonus";
  // const festivalbonus = "festival bonus";
  const referuser_bonus_text = "user refer bonus";
  try {
    const schema = Joi.object({
      username: Joi.string().allow(),
      reffralcode: Joi.string().allow(""),
      usereffral: Joi.string().allow(""),
      userphone: Joi.string().allow(),
      userotp: Joi.number().allow("")
    });
    //   // console.log(schema, "schema");
    const validationResult = schema.validate(req.body);
    if (validationResult.error) {
      return res
        .status(400)
        .json({ error: validationResult.error.details[0].message });
    } else {
      const existingUser = await userloginDatas.findOne({
        userphone: userphone
      });
      if (existingUser) {
        const updatedData = await userloginDatas.findOneAndUpdate(
          { userphone: userphone },
          { $set: { userotp: userotp } },
          { new: true }
        );

        const expirationDate = new Date();
        expirationDate.setMonth(expirationDate.getMonth() + 1);
        const expiresIn = Math.floor(
          (Date.now() + 30 * 24 * 60 * 60 * 1000) / 1000
        );
        const phone = Jwt.sign(
          {
            userphone: updatedData.userphone
          },
          "HiiiPlayers",
          { expiresIn: expiresIn }
        );
        res.status(200).json({
          message: "phone number already exists",
          userphone: phone
        });
      } else {
        // if usereffral exists
        if (usereffral) {
          try {
            const existingUser = await userloginDatas.findOne({
              reffralcode: usereffral
            });

            if (existingUser) {
              existingUser.bonus.push({
                date: Date.now(),
                status: referuser_bonus_text,
                price: referUser_bonus
              });

              let totalBonusExistingUser = 0;
              existingUser.bonus.forEach((bonusItem) => {
                totalBonusExistingUser += bonusItem.price;
              });
              existingUser.TotalBonus = totalBonusExistingUser;

              const savedExistingUser = await existingUser.save();

              let ReferEarnCollectionofMy =
                existingUser.ReferEarnCollection || [];

              if (
                ReferEarnCollectionofMy.length === 0 ||
                ReferEarnCollectionofMy.some(
                  (item) =>
                    item.firstParentId === 0 &&
                    item.SecondParentId === 0 &&
                    item.ThirdParentId === 0
                  //  &&
                  // item.FourParentId === 0
                )
              ) {
                ReferEarnCollectionofMy = [
                  { firstParentId: 0 },
                  { SecondParentId: 0 },
                  { ThirdParentId: 0 }
                  // { FourParentId: 0 }
                ];
              }
              const { _id: ParentUserID, ReferEarnCollection } = existingUser;
              const newReferEarnCollection = [ParentUserID.toString()]; // Assign value at index 0
              for (let i = 1; i < ReferEarnCollection.length && i < 3; i++) {
                const valueFromParentCollection = ReferEarnCollectionofMy[
                  i - 1
                ] || { firstParentId: 0 };
                newReferEarnCollection[i] = valueFromParentCollection; // Assign value at current index
              }
              // console.log(newReferEarnCollection,'hello')
              for (const userId of newReferEarnCollection) {
                // Find the user by ID
                let userToUpdate;
                if (userId != 0) {
                  userToUpdate = await userloginDatas.findById(userId);
                }

                let bonusData;

                // Check if the user exists
                if (userToUpdate) {
                  switch (newReferEarnCollection.indexOf(userId)) {
                    case 0:
                      bonusData = {
                        date: Date.now(),
                        status: FirstParentKey,
                        price: firstParentdata
                      };
                      break;
                    case 1:
                      bonusData = {
                        date: Date.now(),
                        status: SecondBonusKey,
                        price: SecondParentdata
                      };
                      break;
                    case 2:
                      bonusData = {
                        date: Date.now(),
                        status: ThirdBonusKey,
                        price: ThirdParentdata
                      };
                      break;
                    case 3:
                      bonusData = {
                        date: Date.now(),
                        status: FourBonusKey,
                        price: FourParentdata
                      };
                      break;
                    // Add more cases as needed for other indexes
                  }
                  userToUpdate.bonus.push(bonusData);
                  await userToUpdate.save();
                  userToUpdate.TotalBonus += bonusData.price;
                  await userToUpdate.save();
                }
              }

              const newUser = new userloginDatas({
                username,
                userphone,
                reffralcode,
                ReferEarnCollection: newReferEarnCollection,
                usereffral,
                isLogin: true,
                festivalBonusSchema: festivalData.map((festival) => ({
                  festivalbonusdataname: festival.festivalbonusdataname,
                  festivalBonusdata: festival.festivalBonusdata,
                  date: festival.date,
                  status: true
                })),
                MailForAllUser: MailData.map((MailData) => ({
                  MailType: MailData.MailType,
                  MailTypetext: MailData.MailTypetext,
                  date: MailData.date
                })),

                userotp,
                bonus: [
                  {
                    date: Date.now(),
                    status: singupbonus,
                    price: newuser_singin
                  },
                  {
                    date: Date.now(),
                    status: referbonus,
                    price: refer_bonus
                  }
                  // {
                  //   date: Date.now(),
                  //   status: UserBonusDataKey,
                  //   price: UserBonusData
                  // }
                ],
                DailyBonus: DayBonus.map((dailyData) => ({
                  value: dailyData.value,
                  status: dailyData.status,
                  claimed: dailyData.claimed
                }))
              });

              let totalBonusNewUser = 0;
              newUser.bonus.forEach((bonusItem) => {
                totalBonusNewUser += bonusItem.price;
              });
              newUser.TotalBonus = totalBonusNewUser;

              const savedNewUser = await newUser.save();

              const expirationDate = new Date();
              expirationDate.setMonth(expirationDate.getMonth() + 1);
              const expiresIn = Math.floor(
                (Date.now() + 30 * 24 * 60 * 60 * 1000) / 1000
              );

              // console.log('hello0')

              const phone = Jwt.sign(
                {
                  userphone: savedNewUser.userphone
                },
                "HiiiPlayers",
                { expiresIn: expiresIn }
              );

              // console.log(phone, "hello");

              res.status(200).json({
                message: "data save successfully",
                userphone: phone
              });
            } else {
              res.status(404).json({
                error: "Invalid Referral code"
              });
            }
          } catch (error) {
            console.error("Error processing referral code:", error);
            res.status(500).json({ error: "Internal Server Error" });
          }
        } else {
          // if user login without using refral code then he will get bonus only singin bonus
          const newUser = new userloginDatas({
            username,
            userphone,
            reffralcode,
            usereffral,
            userotp,
            festivalBonusSchema: festivalData.map((festival) => ({
              festivalbonusdataname: festival.festivalbonusdataname,
              festivalBonusdata: festival.festivalBonusdata,
              date: festival.date,
              status: true // Set status as needed
            })),
            MailForAllUser: MailData.map((MailData) => ({
              MailType: MailData.MailType,
              MailTypetext: MailData.MailTypetext,
              date: MailData.date
            })),
            isLogin: true,
            DailyBonus: DayBonus.map((dailyData) => ({
              value: dailyData.value,
              status: dailyData.status,
              claimed: dailyData.claimed
            })),
            bonus: [
              {
                date: Date.now(),
                status: singupbonus,
                price: newuser_singin
              }
            ]
          });

          // Calculate total bonus
          let totalBonus = 0;
          newUser.bonus.forEach((bonusItem) => {
            totalBonus += bonusItem.price;
          });

          // Set TotalBonus field
          newUser.TotalBonus = totalBonus;

          // Save the user data
          const savedUser = await newUser.save();

          const expirationDate = new Date();
          expirationDate.setMonth(expirationDate.getMonth() + 1);
          const expiresIn = Math.floor(
            (Date.now() + 30 * 24 * 60 * 60 * 1000) / 1000
          ); // 30 days expiration

          const phone = Jwt.sign(
            {
              userphone: savedUser.userphone
            },
            "HiiiPlayers", // Change this to your secret key
            { expiresIn: expiresIn } // expiresIn is in seconds
          );

          res.status(200).json({
            message: "data save successfully",
            userphone: phone
          });
        }
      }
    }
    // if server internal error
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
//fetch data of user details
exports.UserFetchData = async (req, res, next) => {
  // console.log("khg");
  try {
    const bankDetail = await userloginDatas.find();
    if (!bankDetail) {
      return res.status(404).json({ error: "user detail not found" });
    }
    return res.json(bankDetail);
  } catch (error) {
    // Handle errors
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.TotalNumberUser = async (req, res) => {
  try {
    const userCount = await userloginDatas.countDocuments();
    return res.json(userCount);
  } catch (error) {
    // Handle errors
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.TotalNumberOfPendingWith = async (req, res) => {
  try {
    const users = await userloginDatas.find();
    if (!users) {
      return res.status(404).json({ error: "User details not found" });
    }

    let totalWithdrawCount0 = 0;
    let totalWithdrawCount1 = 0;

    users.forEach((user) => {
      user.withdraw.forEach((withdraw) => {
        if (withdraw.status === 0) {
          totalWithdrawCount0++;
        } else if (withdraw.status === 1) {
          totalWithdrawCount1++;
        }
      });
    });

    return res.json({ totalWithdrawCount0, totalWithdrawCount1 });
  } catch (error) {
    // Handle errors
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.TotalNumberOfPendingRecharge = async (req, res) => {
  try {
    // Count users with status 0
    const usersCountStatus0 = await userloginDatas.aggregate([
      { $unwind: "$PaymentHistoryData" }, // Unwind the PaymentHistoryData array
      { $match: { "PaymentHistoryData.status": 0 } }, // Match documents where status is 0
      { $count: "totalUsersStatus0" } // Count the number of users with status 0
    ]);

    // Count users with status 1
    const usersCountStatus1 = await userloginDatas.aggregate([
      { $unwind: "$PaymentHistoryData" }, // Unwind the PaymentHistoryData array
      { $match: { "PaymentHistoryData.status": 1 } }, // Match documents where status is 1
      { $count: "totalUsersStatus1" } // Count the number of users with status 1
    ]);

    // Initialize variables to hold the counts, defaulting to 0 if data is not found
    let totalUsersStatus0 = 0;
    let totalUsersStatus1 = 0;

    // Check if usersCountStatus0 is not found or has length 0
    if (!usersCountStatus0 || usersCountStatus0.length === 0) {
      // Set totalUsersStatus0 to 0
      totalUsersStatus0 = 0;
    } else {
      // Extract the count from usersCountStatus0
      totalUsersStatus0 = usersCountStatus0[0].totalUsersStatus0;
    }

    // Check if usersCountStatus1 is not found or has length 0
    if (!usersCountStatus1 || usersCountStatus1.length === 0) {
      // Set totalUsersStatus1 to 0
      totalUsersStatus1 = 0;
    } else {
      // Extract the count from usersCountStatus1
      totalUsersStatus1 = usersCountStatus1[0].totalUsersStatus1;
    }

    // Return JSON response with total counts
    return res.json({ totalUsersStatus0, totalUsersStatus1 });
  } catch (error) {
    // Handle errors
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.UserPersonalTotalLoss = async (req, res, next) => {
  try {
    // Assuming you have access to userId in req object
    const { userId } = req.params;
    // Query UserLoginData collection to find the user by userId
    const user = await userloginDatas.findOne({ _id: userId });
    if (!user) {
      // Handle case where user with provided userId is not found
      return res.status(404).json({ message: "User not found" });
    }
    let totalloss = 0;

    // Iterate over each GameHistory object in the GameHistory array of the UserLoginData document
    user.GameHistore.forEach((gameHistory) => {
      // Check if status is 2
      if (gameHistory.status == 2) {
        // Add totalbonus to totalBonus
        totalloss += gameHistory.TotalLoss;
      }
    });

    // If there are no matching documents, set totalBonus to 0
    const totalLossData = totalloss || 0;

    // Now you can use totalBonus as needed
    res.status(200).json({ totalLossData });
    // For example, you can update a field in the UserLoginData collection
    // Replace 'totalBonusField' with the actual field in UserLoginData where you want to store the totalBonus
    // user.totalBonusField = totalBonus;
    // await user.save();

    // Proceed with your logic
  } catch (error) {
    console.error(error);
    // Handle errors appropriately
    res.status(500).json({ message: "Internal server error" });
  }
};
//fetch data of user details personal details
exports.UserPersonalFetchData = async (req, res, next) => {
  try {
    const { userId } = req.params; // Change to req.params.id
    // console.log("skkbs", userId);
    const userPersonaldata = await userloginDatas.findOne({ _id: userId });
    if (!userPersonaldata) {
      return res.status(404).json({ error: "userPersonaldata not found" });
    }
    return res.json(userPersonaldata);
  } catch (error) {
    // Handle errors
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

//  userlogin , referbonus, userReferbonus , Singin Bonus controller end
// bank detail controller for post api  start
exports.BankDetails = async (req, res, next) => {
  try {
    const { AccountNumber, UserName, IFSC, BankName, Email, UniqeId } =
      req.body;

    // Validate request body using Joi
    const schema = Joi.object({
      AccountNumber: Joi.number().required(),
      UserName: Joi.string().required(),
      IFSC: Joi.string().required(),
      BankName: Joi.string().required(),
      Email: Joi.string().email().required(),
      UniqeId: Joi.string().required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Check if UniqeId already exists
    let bankDetail;
    const existingBankDetail = await BankDetail.findOne({ UniqeId });
    if (existingBankDetail) {
      // If UniqeId exists, update the details
      bankDetail = await BankDetail.updateOne(
        { UniqeId },
        { AccountNumber, UserName, IFSC, BankName, Email }
      );
    } else {
      // If UniqeId doesn't exist, insert new details
      bankDetail = await BankDetail.create({
        AccountNumber,
        UserName,
        IFSC,
        BankName,
        Email,
        UniqeId
      });
    }
    return res.status(200).json({
      message: "Bank details validated and saved successfully"
    });
  } catch (error) {
    // Handle unexpected errors
    return res.status(500).json({ error: error.message });
  }
};
// bank detail controller for post api end
// bank detail controller for get api start
exports.BankDetailsgets = async (req, res, next) => {
  try {
    const { UniqeId } = req.params;
    const bankDetail = await BankDetail.findOne({ UniqeId });
    if (!bankDetail) {
      return res.status(404).json({ error: "Bank detail not found" });
    }
    return res.json({ bankDetail, UpiDetail });
  } catch (error) {
    // Handle errors
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
// bank detail controller for get api end

// Upi detail controller  for post api start

exports.upiDetails = async (req, res, next) => {
  try {
    const { PhoneNumber, UserName, UpiAddress, UniqeId } = req.body;
    // Convert PhoneNumber to string
    const phoneNumberString = PhoneNumber.toString();
    // Validate request body using Joi
    const schema = Joi.object({
      PhoneNumber: Joi.string().required(),
      UserName: Joi.string().required(),
      UpiAddress: Joi.string().required(),
      UniqeId: Joi.string().required()
    });
    const { error } = schema.validate({
      PhoneNumber: phoneNumberString,
      UserName,
      UpiAddress,
      UniqeId
    });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Check if UniqeId already exists
    let UpiDetaildata;
    const existingUpiDetail = await UpiDetail.findOne({ UniqeId });
    if (existingUpiDetail) {
      // If UniqeId exists, update the details
      UpiDetaildata = await UpiDetail.updateOne(
        { UniqeId },
        { PhoneNumber: phoneNumberString, UserName, UpiAddress }
      );
    } else {
      // If UniqeId doesn't exist, insert new details
      UpiDetaildata = await UpiDetail.create({
        PhoneNumber: phoneNumberString,
        UserName,
        UpiAddress,
        UniqeId
      });
    }
    return res.status(200).json({
      message: "Upi details validated and saved successfully"
    });
  } catch (error) {
    // Handle unexpected errors
    return res.status(500).json({ error: error.message });
  }
};

// Upi details Controller for post api end
// upi detail controller for get api start

exports.UpiDetailsgets = async (req, res, next) => {
  try {
    const { UniqeId } = req.params;
    const bankDetail = await UpiDetail.findOne({ UniqeId });
    if (!bankDetail) {
      return res.status(404).json({ error: "Bank detail not found" });
    }
    return res.json(bankDetail);
  } catch (error) {
    // Handle errors
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Upi details Controller for get api end
// withdraw details Controller for post api start
exports.withdraw = async (req, res, next) => {
  try {
    const { Amount, uniqeId, PhoneNumber, UserName, IFSC } = req.body;

    const WithdrawDataFinalValue = await axios.get(
      "http://localhost:5000/WithdrawTextDatagetData"
    );
    const WithdraTextVal = WithdrawDataFinalValue.data;

    const existingUser = await userloginDatas.findOne({ _id: uniqeId });
    const walletVal =
      existingUser && existingUser.WinWallet ? existingUser.WinWallet : 0;
    // console.log(WithdraTextVal[0].FixedAmount, "jljol");
    // Check if WithdraTextVal is a valid percentage
    let amt;
    if (WithdraTextVal[0].FixedAmount >= 0) {
      let deduct = WithdraTextVal[0].FixedAmount;
      // Convert percentage to decimal
      const deductionAmount = Amount * percentage;
      // Deduct the percentage amount from the provided Amount
      amt = Amount - deductionAmount;
      // console.log(Amount);
    }
    const updatedWallet = walletVal - Amount;

    existingUser.WinWallet = updatedWallet;
    if (existingUser) {
      existingUser.withdraw.push({
        Amount: amt,
        PhoneNumber,
        UserName,
        AccountNumber,
        IFSC
      });
      await existingUser.save();
      return res
        .status(200)
        .json({ message: "Withdrawal data saved successfully", existingUser });
    } else {
      return res.status(404).json({ error: "Please Login first" });
    }
  } catch (error) {
    res.status(404).json({
      message: error
    });
  }
};

// withdraw details Controller for post api end
// withdraw details Controller for get api start

exports.withdrawget = async (req, res, next) => {
  try {
    const { UniqeId } = req.params;
    const userData = await userloginDatas.findOne({ _id: UniqeId });
    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }
    const withdrawalData = userData.withdraw;
    return res.json({ withdrawalData });
  } catch (error) {
    // Handle errors
    console.error("Error fetching withdrawal data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.withdrawgetAll = async (req, res, next) => {
  try {
    const userData = await userloginDatas.find({}, { withdraw: 1 });
    res.status(200).json(userData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//gameprice and game winningPrice and gameMember and gamePlayer post api
exports.GamePriceDataController = async (req, res, next) => {
  try {
    const { gameName, gamePrice, winerPrice, player } = req.body;
    const newUser = new GamePriceData({
      gameName,
      gamePrice,
      winerPrice,
      player
    });
    const savedUser = await newUser.save();
    res.status(200).json({
      message: "data save succefully",
      userphone: savedUser.userphone
    });
  } catch (error) {
    res.status(404).json({
      message: "Internal Server error",
      userphone: savedUser.userphone
    });
  }
};
// validate Binding User
exports.validatebinding = async (req, res, next) => {
  try {
    const { userphone, otp, actualId } = req.body;
    const existingUser = await userloginDatas.findOne({ userphone: userphone });

    if (existingUser) {
      // If user already exists, return an error response
      return res.status(200).json({ message: "Phone number already exists" });
    } else {
      // If user does not exist, update the user document
      const updatedUser = await userloginDatas.findOneAndUpdate(
        { _id: actualId },
        { $set: { userphone: userphone, userotp: otp } },
        { new: true } // To return the updated document
      );
      // Respond with a success message
      res.status(201).json({ message: "User updated successfully" });
    }
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//binding submit form controller
exports.BindingData = async (req, res, next) => {
  const res_data_of_newuser_bonas = await axios.get(
    `http://localhost:5000/referwin_Getdata`
  );
  const firstDataObject = res_data_of_newuser_bonas.data[0];
  const newuser_singin = firstDataObject.newuser;
  const referUser_bonus = firstDataObject.referUser;
  const refer_bonus = firstDataObject.refer;
  // Get the bonus status types
  const singupbonus = "sing in";
  const referbonus = "refer bonus";
  try {
    const { userotp, userphone, username, actualId } = req.body;
    // Find the user document with the matching userId
    const updatedUser = await userloginDatas.findOne({
      _id: actualId
    });
    // Convert the incoming userotp to an integer
    const incomingUserotp = parseInt(userotp, 10);

    if (updatedUser.userotp === incomingUserotp) {
      // Update the user document with the new bonus data
      updatedUser.username = username;
      updatedUser.isLogin = true;
      updatedUser.bonus = {
        date: Date.now(),
        status: singupbonus,
        price: newuser_singin
      };

      // Calculate the total bonus
      let totalBonusUpdatedUser = updatedUser.TotalBonus || 0;

      totalBonusUpdatedUser += newuser_singin;
      // Update the TotalBonus field
      updatedUser.TotalBonus = totalBonusUpdatedUser;

      // Save the updated user document
      const savedUpdatedUser = await updatedUser.save();

      // Generate JWT token
      const expirationDate = new Date();
      expirationDate.setMonth(expirationDate.getMonth() + 1);
      const expiresIn = Math.floor(
        (Date.now() + 30 * 24 * 60 * 60 * 1000) / 1000
      ); // 30 days expiration
      const token = Jwt.sign(
        {
          _id: updatedUser._id,
          userphone: updatedUser.userphone,
          username: updatedUser.username
        },
        "HiiiPlayers", // Change this to your secret key
        { expiresIn: expiresIn } // expiresIn is in seconds
      );

      // Send response
      res.status(200).send({
        msg: "Update Successfully",
        status: true,
        token: token
      });
    } else {
      // If userotp does not match, return invalid otp
      return res.status(400).json({ msg: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

//gameprice and game winningPrice and gameMember and gamePlayer get api

exports.GamePriceGetwithoutid = async (req, res, next) => {
  try {
    const GamePriceGet = await GamePriceData.find();
    if (!GamePriceGet) {
      return res.status(404).json({ error: "GamePriceGet detail not found" });
    }
    return res.json(GamePriceGet);
  } catch (error) {
    // Handle errors
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.GamePricePostdelete = async (req, res, next) => {
  try {
    // Delete the document with the specified _id
    const { id } = req.params;
    const result = await GamePriceData.deleteOne({ _id: id });
    if (result) {
      // Send a success response if the document is deleted
      res.status(200).json({ message: "Document deleted successfully." });
    } else {
      // console.log("Document not found.");
      // Send a not found response if the document doesn't exist
      res.status(404).json({ error: "Document not found." });
    }
  } catch (error) {
    console.error("Error deleting document:", error);
    // Send an error response if an error occurs during deletion
    res.status(500).json({ error: "Error deleting document." });
  }
};
exports.sendOTP = async (req, res, next) => {
  try {
    const { userphone, userotp } = req.body;
    // console.log("le bhai me bhi aa gya", userphone, userotp);
    const response = await axios.get("https://sms.bulksmslab.com/SMSApi/send", {
      params: {
        userid: "gamezone",
        password: "Royal@12",
        sendMethod: "quick",
        mobile: userphone, // Use the correct phone number
        msg: `Your+OTP+is${userotp}for+Phone+Verification.OTPSTE`,
        senderid: "OTPSTE",
        msgType: "text",
        duplicatecheck: true,
        output: "json"
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Server error" });
  }
};

//gamehistorydata delete post api

exports.updateotp = async (req, res, next) => {
  const { userphone, enteredOtp } = req.body;
  try {
    const userToUpdate = await userloginDatas.findOne({
      userphone: userphone,
      userotp: enteredOtp
    });

    if (!userToUpdate) {
      return res.status(400).send({
        message: "Invalid userphone or OTP",
        status: 404
      });
    }
    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 1);
    const expiresIn = Math.floor(
      (Date.now() + 30 * 24 * 60 * 60 * 1000) / 1000
    ); // 30 days expiration

    const token = Jwt.sign(
      {
        _id: userToUpdate._id,
        userphone: userToUpdate.userphone,
        username: userToUpdate.username
      },
      "HiiiPlayers", // Change this to your secret key
      { expiresIn: expiresIn } // expiresIn is in seconds
    );

    res.status(200).send({
      msg: "Update Successfully",
      status: true,
      token: token
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
//play as guest  datasave process
exports.PlayasGuest = async (req, res, next) => {
  const festivalgetAlldata = await axios.get(
    `http://localhost:5000/festivalgetAlldata`
  );
  const festivalData = festivalgetAlldata.data || "";
  const getDailyDayBonusData = await axios.get(
    "http://localhost:5000/getdailyBonusDatas"
  );
  const DayBonus = getDailyDayBonusData.data;
  // console.log("datatattaa", getDailyDayBonusData.data);
  const MailDataall = await axios.get(
    `http://localhost:5000/MailHistorySchemaData`
  );
  const MailData = MailDataall.data || "";
  try {
    const { result, reffralcode } = req.body;
    // console.log(result, reffralcode);
    const newUser = new userloginDatas({
      guestid: result,
      isLogin: false,
      festivalBonusSchema: festivalData.map((festival) => ({
        festivalbonusdataname: festival.festivalbonusdataname,
        festivalBonusdata: festival.festivalBonusdata,
        date: festival.date,
        status: true // Set status as needed
      })),
      MailForAllUser: MailData.map((MailData) => ({
        MailTypetextdata: MailData.MailTypetextdata,
        MailTypedata: MailData.MailTypedata,
        dateMail: MailData.dateMail
      })),
      DailyBonus: DayBonus.map((dailyData) => ({
        value: dailyData.value,
        status: dailyData.status,
        claimed: dailyData.claimed
      })),
      reffralcode: reffralcode
    });
    const savedUser = await newUser.save();
    const expiresIn = 30 * 24 * 60 * 60; // 30 days expiration in seconds

    const token = Jwt.sign(
      { _id: savedUser._id },
      "HiiiPlayers", // Change this to your secure secret key
      { expiresIn }
    );
    res.status(200).send({
      message: "Guest Id Saved Successfully",
      status: true,
      token: token
    });
  } catch (error) {
    console.error("Internal Error:", error);
    res.status(500).send({
      error: "Internal Server Error"
    });
  }
};

// referwin controller start

// //Admin_user post data
exports.AddAdmin = async (req, res) => {
  try {
    await Admin_User.Admin_User.create(req.body).then(() => {
      res.send({ message: "User Created Successfully" });
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Admin_User get data
exports.GetAdminUser = async (req, res) => {
  try {
    const data = await Admin_User.Admin_User.findOne({});
    // console.log(data);
    res.send(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// update admin details
const storage = multer.diskStorage({
  destination: "uploads",
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage: storage });
exports.UploadImgMulter = upload.single("ProfileImg");

exports.UpdateAdmin = async (req, res) => {
  if (req.file) {
    const ImgPath = req.file.path;
    const updatedAdmin = await Admin_User.Admin_User.findOneAndUpdate(
      {},
      { $set: { ...req.body, ProfileImg: ImgPath } },
      { new: true }
    );
  } else {
    const updatedAdmin = await Admin_User.Admin_User.findOneAndUpdate(
      {},
      { $set: { ...req.body } },
      { new: true }
    );
  }

  res.redirect("/users-profile");
};

// change admin password
exports.ChangeAdminPassword = async (req, res) => {
  const password = req.body.CurrentPassword;
  // console.log("change password data is", req.body);
  try {
    const updatedDocument = await Admin_User.Admin_User.findOneAndUpdate(
      { Password: password },
      { $set: { Password: req.body.NewPassword } },
      { new: true }
    );

    if (!updatedDocument) {
      return res.status(404).send("Incorrect Password");
    }

    // console.log("Updated document:", updatedDocument);
    res.send({ message: true });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

//delete admin profile img
exports.DeleteAdminImg = async (req, res) => {
  const email = req.body.email.trim();
  // console.log("received email", email);
  try {
    const result = await Admin_User.Admin_User.updateOne(
      { Email: email },
      { $unset: { ProfileImg: true } }
    );

    if (result.nModified > 0) {
      // console.log("Image deleted successfully");
      res.send({ message: true });
    } else {
      // console.log("No document found with the provided email");
      res.send({ message: false });
    }
  } catch (error) {
    console.error("Error deleting profile image:", error);
    res.status(500).send({ message: false });
  }
};

exports.justchekck = async (req, res, next) => {
  try {
    const { useremail } = req.body;
    // console.log(useremail);

    // Validate using Joi
    await Joi.object({
      useremail: Joi.string().email().lowercase().required()
    }).validateAsync({ useremail });

    // Create a new document using Mongoose
    const newUser = new JustCheck({ useremail });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    // console.error(error); // Log the error for debugging

    if (error.isJoi) {
      // Handle Joi validation error
      return res.status(400).json({ error: error.details[0].message });
    }

    if (error.name === "MongoError" && error.code === 11000) {
      // Handle duplicate key error (unique constraint violation)
      return res.status(400).json({ error: "Email already exists" });
    }

    res.status(500).json({ error: "Server error" });
  }
};

const storageIcon = multer.memoryStorage(); // Store as buffer in memory
const uploadicon = multer({ storage: storageIcon });

exports.UploadImgMulter1 = uploadicon.single("SliderImg");
exports.ManualPayment = async (req, res) => {
  try {
    console.log("hii", req.body);
    // Check if a file has been uploaded
    if (!req.file && !req.body.SliderName) {
      return res.status(400).json({ error: "No file or SliderName uploaded." });
    }

    if (req.file && req.body.SliderName) {
      const newImgCollection = new ManualCollectData({
        Sliderimages: [
          {
            UpiName: req.body.SliderName,
            PaymentGateway: req.file.buffer
          }
        ]
      });
      await newImgCollection.save();
      return res
        .status(201)
        .json({ message: "Image and name uploaded successfully." });
    } else if (req.file) {
      const newImgCollection = new ManualCollectData({
        Sliderimages: [
          {
            PaymentGateway: req.file.buffer
          }
        ]
      });
      await newImgCollection.save();
      return res.status(201).json({ message: "Image uploaded successfully." });
    } else if (req.body.SliderName) {
      const newImgCollection = new ManualCollectData({
        Sliderimages: [
          {
            UpiName: req.body.SliderName
          }
        ]
      });
      console.log("check", newImgCollection);
      await newImgCollection.save();
      return res.status(201).json({ message: "Name uploaded successfully." });
    }
  } catch (error) {
    // Handle errors appropriately
    console.error("Error uploading data:", error);
    res.status(500).json({ error: "Server error." });
  }
};

exports.getSliderImages = async (req, res, next) => {
  try {
    // Fetch all documents from the ImgCollectiondata collection
    const sliderImages = await ImgCollectiondata.find({}, "Sliderimages");
    // Send the fetched sliderImages array as the response
    res.status(200).json(sliderImages);
  } catch (error) {
    // Handle errors
    console.error("Error fetching slider images:", error);
    res.status(500).json({ error: "Server error." });
  }
};

exports.getManulDataPayment = async (req, res, next) => {
  try {
    // Fetch all documents from the ImgCollectiondata collection
    const sliderImages = await ManualCollectData.find({}, "Sliderimages");
    // Send the fetched sliderImages array as the response
    res.status(200).json(sliderImages);
  } catch (error) {
    // Handle errors
    console.error("Error fetching slider images:", error);
    res.status(500).json({ error: "Server error." });
  }
};

exports.DeleteManualPayment = async (req, res) => {
  try {
    const { carromId } = req.body;
    // Use findOneAndDelete to find the document and delete it based on the provided _id
    const result = await ManualCollectData.findOneAndDelete(
      { _id: carromId }
    );
    if (result) {
      res.status(200).json({ message: "Section deleted successfully." });
    } else {
      res.status(404).json({ error: "Document not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Error deleting section." });
  }
};

exports.UploadImgMulter1 = uploadicon.single("SliderImg");
exports.updateManual = async (req, res, next) => {
  const { SliderName, carromId, sliderImageIds, SliderImg } = req.body;
  try {
    // Find the document based on carromId
    const document = await ManualCollectData.findById(carromId);

    // Update the slider image and name for the specified sliderImageIds
    document.Sliderimages.forEach((slider) => {
      if (sliderImageIds.includes(slider._id)) {
        if (SliderName) {
          slider.UpiName = SliderName;
        }
        if (req.file) {
          slider.PaymentGateway = req.file.buffer; // Assuming req.file.buffer contains the image data
        }
      }
    });

    await document.save();
    res.status(200).json({ message: "Slider updated successfully." });
  } catch (error) {
    // Handle errors
    console.error("Error updating slider:", error);
    res.status(500).json({ error: "Error updating slider." });
  }
};
// exports.updateManual = async (req, res, next) => {
//   const { SliderName, carromId, sliderImageIds, SliderImg } = req.body;
//   try {
//     // Find the document based on carromId
//     const document = await ImgCollectiondata.findById(carromId);

//     // Update the slider image and name for the specified sliderImageIds
//     document.Sliderimages.forEach((slider) => {
//       if (sliderImageIds.includes(slider._id)) {
//         if (SliderName) {
//           slider.SliderName = SliderName;
//         }
//         if (req.file) {
//           slider.SliderImg = req.file.buffer; // Assuming req.file.buffer contains the image data
//         }
//       }
//     });

//     await document.save();
//     res.status(200).json({ message: "Slider updated successfully." });
//   } catch (error) {
//     // Handle errors
//     console.error("Error updating slider:", error);
//     res.status(500).json({ error: "Error updating slider." });
//   }
// };

// Notice img Upload controller start

exports.UploadImgMulter2 = uploadicon.single("NoticeImg");
exports.imgaesuploadNotice = async (req, res) => {
  try {
    // Check if a file has been uploaded
    // console.log(req.file);
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }
    const { NoticeName } = req.body;
    const newImgCollection = new NoticeCollectiondata({
      images: [
        {
          NoticeName: NoticeName,
          NoticeImg: req.file.buffer
        }
      ]
    });
    await newImgCollection.save();
    res.status(201).json({ message: "Image uploaded successfully." });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Server error." });
  }
};
//upload noticeImg controller end
// get NoticeImg Controller start
exports.getNoticeImages = async (req, res, next) => {
  try {
    const NoticeImages = await NoticeCollectiondata.find({}, "images");
    // Send the fetched sliderImages array as the response
    res.status(200).json(NoticeImages);
  } catch (error) {
    // Handle errors
    console.error("Error fetching slider images:", error);
    res.status(500).json({ error: "Server error." });
  }
};
//get Notice Images Controller End
//Delete Notice Images Controller Start
exports.deletEeNoticeImage = async (req, res) => {
  try {
    const { NticeinnerId, sliderImageIds } = req.body;
    const result = await NoticeCollectiondata.findOneAndUpdate(
      { _id: NticeinnerId },
      { $pull: { images: { _id: sliderImageIds } } },
      { new: true } // To return the modified documentfv
    );
    if (result) {
      res.status(200).json({ message: "Notice image deleted successfully." });
    } else {
      res.status(404).json({ error: "Document not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Error deleting Notice image." });
  }
};
//Delete Notice Images Controller end
// update Notice Images Controller Start

exports.UploadImgMulter2 = uploadicon.single("NoticeImg");
exports.updateNotice = async (req, res, next) => {
  const { NoticeName, carromId, NoticeImageIds, Name } = req.body;
  try {
    // Find the document based on carromId
    const document = await NoticeCollectiondata.findById(carromId);
    // Update the slider image and name for the specified sliderImageIds
    document.images.forEach((slider) => {
      if (NoticeImageIds.includes(slider._id.toString())) {
        // Convert _id to string for comparison
        slider.NoticeName = NoticeName;
        if (req.file) {
          slider.NoticeImg = req.file.buffer; // Assuming req.file.buffer contains the image data
        }
      }
    });
    await document.save();
    res.status(200).json({ message: "Slider updated successfully." });
  } catch (error) {
    // Handle errors
    console.error("Error updating slider:", error);
    res.status(500).json({ error: "Error updating slider." });
  }
};

//payment controller start

exports.Payment = async (req, res, next) => {
  const { amount, phone, userId, percentageVal } = req.body;
  const amnt = JSON.stringify(amount);
  const orderId = uuidv4();

  // const hashedSecret = await bcrypt.hash(secret, 10);
  const paytmParams = {
    upiuid: "paytmqr6jekaptpvl@paytm",
    token: "a92cab-731b3f-d97358-308145-7fe14a",
    orderId: orderId,
    txnAmount: amount,
    percentageVal: percentageVal,
    txnNote: "Test",
    callback_url: "https://getway.maxwayinfotech.shop/trial/txnResult.php",
    gateway_type: "Advanced",
    cust_Mobile: phone,
    secret: "hashedSecret",
    merchantKey: "EPLudu14203694874891" // Retrieve merchant key from environment variable,
  };
  /**
   * Generate checksum by parameters we have
   * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys
   */
  const merchantKey = "EPLudu14203694874891"; // Replace "YOUR_MERCHANT_KEY" with your actual merchant key
  if (!merchantKey) {
    console.error("Merchant key is not defined.");
    res.status(500).json({ error: "Merchant key is not defined." });
  } else {
    PaytmChecksum.generateSignature(paytmParams, merchantKey)
      .then(async function (checksum) {
        paytmParams.CHECKSUMHASH = checksum; // Add checksum to the parameters

        try {
          // Save the paytmParams directly in the paymentHistorySchema
          const data = await userloginDatas.findById(userId);
          // Push the payment parameters to the payment history schema
          data.PaymentHistoryData.push(paytmParams);
          // Save the updated user data
          await data.save();
          res.json(paytmParams); // Send the saved document as JSON response
        } catch (error) {
          console.error("Error saving paytmParams:", error);
          res.status(500).json({ error: "Error saving payment details" });
        }
      })
      .catch(function (error) {
        // console.log(error); // Log any error that occurred during checksum generation
        res.status(500).json({ error: "Error generating checksum" }); // Send an error response
      });
  }
};
//controller of callback url
exports.callbackpayemnt = (req, res) => {
  // console.log("hhhjhhjhj");
  // const form = new formidable.IncomingForm();
  // form.parse(req, (err, fields, file) => {});
};

//spinner bonus post controller
exports.SpinnerBonus = async (req, res, next) => {
  try {
    // Extract data from the request body
    const { uniqeId, spinnerBonus, walletdata, spinnerType } = req.body;
    // const spinnerType = "Spinner Bonus";
    const user = await userloginDatas.findOne({ _id: uniqeId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update wallet data

    user.wallet = walletdata;

    // Add bonus to user
    user.bonus.push({
      date: new Date(),
      status: spinnerType,
      price: spinnerBonus
    });

    // Update TotalBonus
    let totalBonus = user.TotalBonus || 0; // Get the current TotalBonus or default to 0
    let spinnerBonusAsNumber = parseFloat(spinnerBonus); // Convert spinnerBonus to a number
    totalBonus += spinnerBonusAsNumber; // Increase totalBonus with the new spinnerBonus
    if (isNaN(totalBonus)) {
      // Handle case where totalBonus is not a number
      return res
        .status(400)
        .json({ message: "TotalBonus is not a valid number" });
    }

    user.TotalBonus = totalBonus;
    const savedUser = await user.save();
    return res
      .status(200)
      .json({ message: "Spinner bonus added successfully", user: savedUser });
  } catch (error) {
    // Handle any errors
    console.error("Error in SpinnerBonus:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.GameHistoryData = async (req, res) => {
  try {
    const {
      gameName,
      winerPrice,
      player,
      username,
      gamePrice,
      WinWallet,
      userId,
      NewWallet,
      TotalBonus,
      BootValue,
      TotalWin,
      TotalLoss,
      status
    } = req.body;

    const userPersonaldata = await userloginDatas.findOne({ _id: userId });
    if (userPersonaldata) {
      // Push the new GameHistory object into the GameHistory array
      userPersonaldata.GameHistore.push({
        gameName,
        winerPrice,
        player,
        username,
        BootValue,
        gamePrice,
        TotalWin,
        TotalLoss,
        status
      });

      // Update wallet and TotalBonus fields
      userPersonaldata.wallet = NewWallet;
      userPersonaldata.WinWallet = WinWallet;
      userPersonaldata.TotalBonus = TotalBonus;

      // Save the updated user document
      await userPersonaldata.save();
      res
        .status(200)
        .json({ message: "Game history data inserted successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.GameHistoryDataGet = async (req, res) => {
  try {
    const { id } = req.params;
    // Find the user document by userId
    const userPersonaldata = await userloginDatas.findOne({ _id: id });
    if (userPersonaldata) {
      // Extract the GameHistory field from the user document
      const gameHistory = userPersonaldata.GameHistore;
      res.status(200).json({ gameHistory });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//MAil for all user In userloginDatas
exports.MailForUserData = async (req, res) => {
  try {
    const { MailTypedata, MailTypetextdata, dateMail } = req.body;
    // Find all users
    const users = await userloginDatas.find();
    // Iterate over each user
    for (const user of users) {
      // Push the new festival bonus data into the festivalBonusSchema array for each user
      user.MailForAllUser.push({
        MailType: MailTypedata,
        MailTypetext: MailTypetextdata,
        date: dateMail
      });
      await user.save();
    }
    // Respond with a success message
    res.status(201).json({
      message: "Mail data inserted successfully for all users"
    });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error saving festival bonus data for all users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.MailForHistory = async (req, res) => {
  try {
    const { MailTypedata, MailTypetextdata, dateMail } = req.body;
    const newFestivalBonusData = new MaiBonusDataAll({
      MailType: MailTypedata,
      MailTypetext: MailTypetextdata,
      date: dateMail
    });
    // Save the new festival bonus data
    await newFestivalBonusData.save();
    // Respond with a success message
    res
      .status(201)
      .json({ message: "Festival bonus data inserted successfully" });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error saving festival bonus data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.MailHistoryEdit = async (req, res) => {
  try {
    const { MailTypeedit, MailTypetextedit, datamailtype, Id } = req.body;
    // Use findOneAndUpdate to find the document by its ID and update it
    const updatedFestivalBonusData = await MaiBonusDataAll.findOneAndUpdate(
      { _id: Id },
      {
        $set: {
          MailType: MailTypeedit,
          MailTypetext: MailTypetextedit,
          date: new Date()
        }
      },
      { new: true } // To return the modified document
    );
    // console.log(updatedFestivalBonusData);
    if (!updatedFestivalBonusData) {
      // If no document is found, return a 404 Not Found response
      return res.status(404).json({ message: "Document not found" });
    }
    // console.log("Updated Document:", updatedFestivalBonusData);
    res.status(200).json({
      message: "Festival bonus data updated successfully",
      updatedFestivalBonusData
    });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
//delete single mail user data
exports.deleteSIngleMailUser = async (req, res) => {
  try {
    const { Id, UserId } = req.body;

    const updatedUserData = await userloginDatas.findOneAndUpdate(
      {
        _id: UserId
      },
      {
        $pull: {
          SingleMailText: { _id: Id }
        }
      },
      { new: true } // Return the updated document
    );

    if (!updatedUserData) {
      return res.status(404).json({ error: "User data not found" });
    }

    // console.log(updatedUserData);
    res.status(200).json({ message: "SingleMailUser deleted successfully" });
  } catch (error) {
    console.error("Error deleting SingleMailUser:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.MailHistoryEditforUser = async (req, res) => {
  try {
    const { MailTypeedit, MailTypetextedit, datamailtype, Id } = req.body;
    // Update the festival bonus data for all users where editMailName exists
    const result = await userloginDatas.updateMany(
      { "MailForAllUser.MailType": datamailtype },
      {
        $set: {
          "MailForAllUser.$.MailType": MailTypeedit,
          "MailForAllUser.$.MailTypetext": MailTypetextedit
        }
      }
    );
    // console.log(result);

    res.status(200).json({
      message: "Festival bonus data updated successfully for all users"
    });
  } catch (error) {
    console.error("Error updating festival bonus data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.MailHistoryDeleteAllUser = async (req, res) => {
  try {
    const { Id, Name } = req.body;

    // Delete festival data for all users where festivalbonusdataname matches Name
    const result = await userloginDatas.updateMany(
      {},
      { $pull: { MailForAllUser: { MailType: Name } } }
    );
    // Check if any documents were modified
    if (result.nModified === 0) {
      return res.status(404).json({ message: "No matching documents found" });
    }
    // Respond with a success message
    res
      .status(200)
      .json({ message: "Festival data deleted successfully for all users" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.MailHistoryDelete = async (req, res) => {
  try {
    const { Id, Name } = req.body;
    const deletedFestivalData = await MaiBonusDataAll.findOneAndDelete({
      _id: Id
    });
    if (!deletedFestivalData) {
      // If no document is found, return a 404 Not Found response
      return res.status(404).json({ message: "Document not found" });
    }
    // Respond with a success message
    res.status(200).json({ message: "Mail data deleted successfully" });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// exports.MailHistorySchemaDataSingle=async (req,res)

exports.MailHistorySchemaData = async (req, res) => {
  try {
    const uniqueFestivalNames = await MaiBonusDataAll.find();
    // const data = await FestivalBonusData.find({ status: true });
    if (uniqueFestivalNames) {
      res.status(200).json(uniqueFestivalNames);
    } else {
      res.status(400).json("data not found");
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.DailyDataforfrontenddata = async (req, res) => {
  try {
    // Aggregate to get single DailyBonus data
    const result = await userloginDatas.find([
      // Unwind the DailyBonus array to deconstruct the array elements
      { $unwind: "$DailyBonus" },
      // Group all documents and push each DailyBonus object into an array
      {
        $group: {
          _id: null,
          dailyBonus: { $addToSet: "$DailyBonus" }
        }
      }
    ]);

    // Check if any result is obtained
    if (result.length > 0) {
      // Get the single DailyBonus data
      const singleDailyBonus = result[0].dailyBonus[0];
      res.status(200).json(singleDailyBonus);
    } else {
      res.status(404).json({ message: "No DailyBonus data found." });
    }
  } catch (error) {
    console.error("Error retrieving DailyBonus data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// controller for single mail

exports.FestivalBonusforuser = async (req, res) => {
  try {
    const { festivalbonusdataname, festivalBonusdata, dateFestival } = req.body;
    // Find all users
    const users = await userloginDatas.find();
    // Iterate over each user
    for (const user of users) {
      // Push the new festival bonus data into the festivalBonusSchema array for each user
      user.festivalBonusSchema.push({
        festivalbonusdataname: festivalbonusdataname,
        festivalBonusdata: festivalBonusdata,
        date: dateFestival,
        status: true
      });
      await user.save();
    }
    // Respond with a success message
    res.status(201).json({
      message: "Festival bonus data inserted successfully for all users"
    });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error saving festival bonus data for all users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.FestivalBonus = async (req, res) => {
  try {
    const { festivalbonusdataname, festivalBonusdata, dateFestival } = req.body;
    const newFestivalBonusData = new FestivalBonusData({
      festivalbonusdataname: festivalbonusdataname,
      festivalBonusdata: festivalBonusdata,
      date: dateFestival,
      status: true
    });
    // Save the new festival bonus data
    await newFestivalBonusData.save();
    // Respond with a success message
    res
      .status(201)
      .json({ message: "Festival bonus data inserted successfully" });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error saving festival bonus data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.festivalgetAlldata = async (req, res) => {
  try {
    const uniqueFestivalNames = await FestivalBonusData.find();
    // const uniqueFestivalNames = await userloginDatas.aggregate([
    //   {
    //     $unwind: "$festivalBonusSchema" // Deconstruct the array
    //   },
    //   {
    //     $group: {
    //       _id: "$festivalBonusSchema.festivalbonusdataname", // Group by festival bonus data name
    //       data: { $first: "$festivalBonusSchema" } // Take the first document encountered for each group
    //     }
    //   },
    //   {
    //     $replaceRoot: { newRoot: "$data" } // Replace the root with the data from the group
    //   }
    // ]);

    // const data = await FestivalBonusData.find({ status: true });
    if (uniqueFestivalNames) {
      res.status(200).json(uniqueFestivalNames);
    } else {
      res.status(400).json("data not found");
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.FestivalBonusEdit = async (req, res) => {
  try {
    const { festivalBonusdata, editMailName, festName, Id } = req.body;
    // Use findOneAndUpdate to find the document by its ID and update it
    const updatedFestivalBonusData = await FestivalBonusData.findOneAndUpdate(
      { _id: Id },
      {
        $set: {
          festivalbonusdataname: editMailName,
          festivalBonusdata: festivalBonusdata,
          date: new Date(),
          status: true
        }
      },
      { new: true } // To return the modified document
    );

    if (!updatedFestivalBonusData) {
      // If no document is found, return a 404 Not Found response
      return res.status(404).json({ message: "Document not found" });
    }
    // console.log("Updated Document:", updatedFestivalBonusData);
    res.status(200).json({
      message: "Festival bonus data updated successfully",
      updatedFestivalBonusData
    });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.FestivalBonusforuserEditInFestival = async (req, res) => {
  try {
    const { festivalBonusdata, editMailName, festName, Id } = req.body;
    // Update the festival bonus data for all users where editMailName exists
    const result = await userloginDatas.updateMany(
      { "festivalBonusSchema.festivalbonusdataname": festName },
      {
        $set: {
          "festivalBonusSchema.$.festivalbonusdataname": editMailName,
          "festivalBonusSchema.$.festivalBonusdata": festivalBonusdata
        }
      }
    );
    // console.log(result);

    res.status(200).json({
      message: "Festival bonus data updated successfully for all users"
    });
  } catch (error) {
    console.error("Error updating festival bonus data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
//festival row delete
exports.FestivalBonusDeleter = async (req, res) => {
  try {
    const { Id, Name } = req.body;
    const deletedFestivalData = await FestivalBonusData.findOneAndDelete({
      _id: Id
    });
    if (!deletedFestivalData) {
      // If no document is found, return a 404 Not Found response
      return res.status(404).json({ message: "Document not found" });
    }
    // Respond with a success message
    res.status(200).json({ message: "Festival data deleted successfully" });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.FestivalBonusforuserDelete = async (req, res) => {
  try {
    const { Id, Name } = req.body;

    // Delete festival data for all users where festivalbonusdataname matches Name
    const result = await userloginDatas.updateMany(
      {},
      { $pull: { festivalBonusSchema: { festivalbonusdataname: Name } } }
    );
    // Check if any documents were modified
    if (result.nModified === 0) {
      return res.status(404).json({ message: "No matching documents found" });
    }
    // Respond with a success message
    res
      .status(200)
      .json({ message: "Festival data deleted successfully for all users" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// MailTextData controller
exports.MailTextData = async (req, res) => {
  try {
    const { MailTypetextdata, MailTypedata, dateMail } = req.body;
    const users = await userloginDatas.find({});

    // Iterate over each user and insert new data
    for (const user of users) {
      user.MailForAllUser.push({
        date: dateMail,
        MailType: MailTypedata,
        MailTypetext: MailTypetextdata
      });

      // Save the updated user
      await user.save();
    }

    res.status(200).json("Mail Text Save successfully");
  } catch (error) {
    res.status(500).json("Internal server error");
  }
};
//single mail update controller
exports.SingleMailPost = async (req, res) => {
  try {
    const { MailTypetextdata, SingleMailUseredata, MailTypedata, dateMail } =
      req.body;
    // console.log(MailTypetextdata, SingleMailUseredata, MailTypedata, dateMail);
    // Find all users
    const users = await userloginDatas.find({ _id: SingleMailUseredata });
    // Iterate over each user
    for (const user of users) {
      // Push the new festival bonus data into the festivalBonusSchema array for each user
      user.SingleMailText.push({
        MailType: MailTypedata,
        MailTypetext: MailTypetextdata,
        date: dateMail
      });
      await user.save();
    }
    // Respond with a success message
    res.status(201).json({
      message: "Mail data inserted successfully for all users"
    });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error saving festival bonus data for all users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.fetchSingleUserMailData = async (req, res) => {
  const { SingleMailUseredata } = req.params; // Assuming the ID is passed as a route parameter

  try {
    // Find the document by its ID
    const user = await userloginDatas.findById(SingleMailUseredata);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract _id and Singlemailtext fields from the document
    const { _id, SingleMailText } = user;

    res.status(200).json({ _id, SingleMailText });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.SingleUserMailEdit = async (req, res) => {
  try {
    const { MailTypeedit_single, MailTypetextedit_single, usertype_id, Id } =
      req.body;

    const updatedUserData = await userloginDatas.findOneAndUpdate(
      {
        _id: usertype_id,
        "SingleMailText._id": Id // Match the user ID and the mail ID
      },
      {
        $set: {
          "SingleMailText.$.MailType": MailTypeedit_single,
          "SingleMailText.$.MailTypetext": MailTypetextedit_single
        }
      },
      { new: true } // Return the updated document
    );

    if (!updatedUserData) {
      return res
        .status(404)
        .json({ error: "User data or SingleMailText not found" });
    }

    res.status(200).json({ message: "SingleMailText updated successfully" });
  } catch (error) {
    console.error("Error updating SingleMailText:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.MailUpdate = async (req, res) => {
  try {
    const { MailTypeedit, MailTypetextedit, Mailtextdateedit, Id } = req.body;
    // Use findOneAndUpdate to find the document by its ID and update it
    const updatedFestivalBonusData = await userloginDatas.findOneAndUpdate(
      { _id: Id },
      {
        $set: {
          MailForAllUser: {
            MailTypetext: MailTypetextedit,
            MailType: MailTypeedit,
            date: Mailtextdateedit
          }
        }
      },
      { new: true } // To return the modified document
    );

    if (!updatedFestivalBonusData) {
      // If no document is found, return a 404 Not Found response
      return res.status(404).json({ message: "Document not found" });
    }
    // console.log("Updated Document:", updatedFestivalBonusData);
    res.status(200).json({
      message: "Mail data updated successfully",
      updatedFestivalBonusData
    });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.FestivalBonusHistory = async (req, res) => {
  const { festivalName, FestivalBonus, userId, festivalId } = req.body;
  userloginDatas
    .findOneAndUpdate(
      { _id: userId }, // Filter condition
      {
        $push: {
          // Add new data to the bonus array
          bonus: {
            date: Date.now(),
            status: festivalName,
            price: FestivalBonus
          }
        },
        $inc: {
          // Increment the TotalBonus field
          TotalBonus: FestivalBonus
        }
      },
      { new: true } // To return the updated document
    )
    .then((updatedUser) => {
      // Find the index of the festival bonus data within the festivalBonusSchema array
      const index = updatedUser.festivalBonusSchema.findIndex((data) =>
        data._id.equals(festivalId)
      );
      // console.log(index, "index");
      if (index !== -1) {
        // Update the status to false for the festival bonus data with the specified _id
        updatedUser.festivalBonusSchema[index].status = false;
      }
      // Save the updated user document
      return updatedUser.save();
    })
    .then(() => {
      // Respond with a success message
      res.status(201).json({
        message: "Festival bonus data updated successfully"
      });
    })
    .catch((error) => {
      // Handle any errors that occur during the process
      console.error("Error updating festival bonus data:", error);
      res.status(500).json({ message: "Internal server error" });
    });
};
exports.EditName = async (req, res) => {
  try {
    const { id, username } = req.body;
    const updatedUser = await userloginDatas.findOneAndUpdate(
      { _id: id },
      { $set: { username: username } },
      { new: true } // To return the updated document
    );
    if (updatedUser) {
      res
        .status(200)
        .json({ message: "Username updated successfully", updatedUser });
    } else {
      res.status(404).json({ error: "Data not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
//withdrowapprovePost post controller
exports.withdrowapprovePost = async (req, res) => {
  try {
    const { withdraw_id, userIDval, widthStatus } = req.body;
    const updatedUserData = await userloginDatas.findOneAndUpdate(
      {
        _id: userIDval,
        "withdraw._id": withdraw_id // Match the user ID and the mail ID
      },
      {
        $set: {
          "withdraw.$.status": widthStatus
        }
      },
      { new: true } // Return the updated document
    );

    if (!updatedUserData) {
      return res
        .status(404)
        .json({ error: "User data or SingleMailText not found" });
    }
    res.status(200).json({ message: "SingleMailText updated successfully" });
  } catch (error) {
    console.error("Error updating SingleMailText:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.ManaualGetDataForapprov = async (req, res) => {
  try {
  } catch (error) {}
};
exports.ManualapprovePost = async (req, res) => {
  try {
    const { amount, userIDval, widthStatus } = req.body;
    console.log(amount, userIDval, widthStatus);

    // Find the user document
    const userData = await userloginDatas.findOne({
      "ManualPaymentHistoryData._id": userIDval
    });

    if (!userData) {
      // If no user found with the provided userIDval in ManualPaymentHistoryData, return message
      return res
        .status(404)
        .json({ error: "User not found in ManualPaymentHistoryData" });
    }

    // Find the payment data with status 0
    const paymentData = userData.ManualPaymentHistoryData.find(
      (payment) => payment._id == userIDval && payment.status == 0
    );

    if (!paymentData) {
      // If no payment with status 0 found, return message
      return res.status(404).json({ error: "No payment with status 0 found" });
    }

    // Update payment status
    paymentData.status = widthStatus;

    // Increase wallet amount if status is not 0
    if (widthStatus !== 0) {
      // Assuming wallet is a property of userData
      userData.wallet += amount;
    }

    // Save the updated user document
    await userData.save();

    res.status(200).json({ message: "Payment status updated successfully" });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.withdrowrejectPost = async (req, res) => {
  try {
    const { withdraw_id, userIDval, widthStatus, amount } = req.body;

    // Parse the amount string into a number
    const parsedAmount = parseFloat(amount);
    // Find the user's wallet value
    const user = await userloginDatas.findById(userIDval);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    t;
    user.wallet += parsedAmount;
    // Update the user's data including the wallet and withdraw status
    const updatedUserData = await userloginDatas.findOneAndUpdate(
      {
        _id: userIDval,
        "withdraw._id": withdraw_id // Match the user ID and the mail ID
      },
      {
        $set: {
          "withdraw.$.status": widthStatus,
          wallet: user.wallet // Update the wallet value
        }
      },
      { new: true } // Return the updated document
    );

    if (!updatedUserData) {
      return res
        .status(404)
        .json({ error: "User data or SingleMailText not found" });
    }

    res.status(200).json({ message: "SingleMailText updated successfully" });
  } catch (error) {
    console.error("Error updating SingleMailText:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.manualRejectPost = async (req, res) => {
  try {
    const { amount, userIDval, widthStatus } = req.body;
    // Find the user document
    const userData = await userloginDatas.findOne({
      "ManualPaymentHistoryData._id": userIDval
    });

    if (!userData) {
      // If no user found with the provided userIDval in ManualPaymentHistoryData, return message
      return res
        .status(404)
        .json({ error: "User not found in ManualPaymentHistoryData" });
    }

    // Find the payment data with status 0
    const paymentData = userData.ManualPaymentHistoryData.find(
      (payment) => payment._id == userIDval && payment.status == 0
    );

    if (!paymentData) {
      // If no payment with status 0 found, return message
      return res.status(404).json({ error: "No payment with status 0 found" });
    }

    // Update payment status
    paymentData.status = widthStatus;

    // Save the updated user document
    await userData.save();

    res.status(200).json({ message: "Payment status updated successfully" });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
//controller for insert DailBonus Data with all user

exports.getdailyBonusDatas = async (req, res) => {
  try {
    const getdailydata = await UserDailyBonusData.find();

    let getDailyDaysDatas = [];
    if (getdailydata.length > 0) {
      // If data exists in the database
      getDailyDaysDatas = getdailydata[0].DailyBonus;
    } else {
      // If data doesn't exist in the database, set default values
      getDailyDaysDatas = [
        { value: 0, status: false, claimed: false },
        { value: 0, status: false, claimed: false },
        { value: 0, status: false, claimed: false },
        { value: 0, status: false, claimed: false },
        { value: 0, status: false, claimed: false },
        { value: 0, status: false, claimed: false },
        { value: 0, status: false, claimed: false }
      ];
    }

    res.status(200).json(getDailyDaysDatas); // Send the data as a response
  } catch (error) {
    console.error("Error fetching daily bonus data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Assuming userloginDatas is your Mongoose model representing the collection
exports.DailyBonusData = async (req, res) => {
  try {
    const {
      dayoneBonus,
      dayTwobonus,
      dayThreeBonus,
      dayFourBonus,
      dayfiveBonus,
      daysixbonus,
      daysevenbonus
    } = req.body;
    // Define the update operation
    const updateOperation = {
      $set: {}
    };

    // Set the value for each day within the nested array
    const defaultDays = [
      { value: dayoneBonus ? dayoneBonus : 0, status: true }, // Set status of the first day to true
      { value: dayTwobonus ? dayTwobonus : 0, status: false }, // Set statuses of other days to false
      { value: dayThreeBonus ? dayThreeBonus : 0, status: false },
      { value: dayFourBonus ? dayFourBonus : 0, status: false },
      { value: dayfiveBonus ? dayfiveBonus : 0, status: false },
      { value: daysixbonus ? daysixbonus : 0, status: false },
      { value: daysevenbonus ? daysevenbonus : 0, status: false }
    ];

    // Prepare the update operation
    updateOperation.$set["DailyBonus"] = defaultDays;

    // Update all userloginDatas documents
    const result = await userloginDatas.updateMany({}, updateOperation, {
      upsert: true
    });
    const resultdata = await UserDailyBonusData.updateMany(
      {},
      updateOperation,
      {
        upsert: true
      }
    );
    // Check if any document was modified
    if (result.nModified === 0) {
      return res.status(404).json({ error: "No documents were updated" });
    }

    return res
      .status(200)
      .json({ message: "Daily bonuses updated successfully", result });
  } catch (error) {
    console.error("Error updating daily bonuses:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//controller for fetching data with all user
exports.DailyBonusFetchData = async (req, res) => {
  const { Id, dailybonudata, dailybonusId } = req.body;
  try {
    let user = await userloginDatas.findById(Id);
    if (!user) {
      return res.status(404).json({ error: "User Id Not Found" });
    }

    const bonusIndex = user.DailyBonus.findIndex(
      (bonus) => bonus._id.toString() === dailybonusId
    );
    if (bonusIndex === -1) {
      return res.status(404).json({ error: "Daily Bonus Id Not Found" });
    }

    // Update the status of the DailyBonus for the user
    user.DailyBonus.forEach((bonus, index) => {
      bonus.status = index === bonusIndex ? false : bonus.status;
    });
    await user.save();

    const dailyBonusValue = parseFloat(dailybonudata);
    // Add the bonus value to the TotalBonus field
    user.TotalBonus += dailyBonusValue;
    await user.save();

    // Set a timeout to reactivate the bonus status after 24 hours
    try {
      const updatedUser = await userloginDatas.findById(Id);
      if (updatedUser && updatedUser.DailyBonus.length === 7) {
        // Find the current day index
        const currentDayIndex = updatedUser.DailyBonus.findIndex(
          (bonus) => bonus._id == dailybonusId
        );
        const nextDayIndex = (currentDayIndex + 1) % 7; // Calculate the index of the next day
        // Check if currentDayIndex and nextDayIndex are within bounds
        if (currentDayIndex !== -1 && nextDayIndex !== -1) {
          // Set current day status to false and claimed to true
          updatedUser.DailyBonus[currentDayIndex].status = false;
          updatedUser.DailyBonus[currentDayIndex].clamed = true;
          // If the current day's status was true and index is 6 (7th day), set its claimed flag to false
          if (currentDayIndex === 6) {
            updatedUser.DailyBonus[0].clamed = false;
            updatedUser.DailyBonus[1].clamed = false;
            updatedUser.DailyBonus[2].clamed = false;
            updatedUser.DailyBonus[3].clamed = false;
            updatedUser.DailyBonus[4].clamed = false;
            updatedUser.DailyBonus[5].clamed = false;
            updatedUser.DailyBonus[6].clamed = false;
          }
          // Save the changes immediately
          await updatedUser.save();
          // Set a timeout to update next day status to true after 10 seconds
          setTimeout(async () => {
            updatedUser.DailyBonus[nextDayIndex].status = true;
            await updatedUser.save();
          }, 10000); // 10 seconds
        } else {
          console.error("Invalid currentDayIndex or nextDayIndex");
        }
      } else {
        console.error(
          "User or DailyBonus array not found or not structured correctly"
        );
      }
    } catch (error) {
      console.error("Error updating daily bonus:", error);
    }

    return res
      .status(200)
      .json({ message: "Daily bonus deactivated for 24 hours", user });
  } catch (error) {
    console.error("Error deactivating daily bonus:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//DeletereferBounsAmount

exports.DeletereferBounsAmount = async (req, res) => {
  try {
    const { Id } = req.body;

    // Find the document by ID and delete it
    const deletedData = await Admin_User.User_refer_win.findByIdAndDelete(Id);

    if (!deletedData) {
      return res.status(404).json({ error: "Data not found" });
    }

    return res.status(200).json({ message: "Data deleted successfully" });
  } catch (error) {
    console.error("Error deleting data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
//payment gateway controller
exports.PaymentHistorinsert = async (req, res) => {
  try {
    // Destructure the validated request body
    const {
      userId,
      orderId,
      cust_Email,
      cust_Mobile,
      gateway_type,
      merchantKey,
      secret,
      token,
      txnAmount,
      upiuid,
      status
    } = req.body;

    const User = await userloginDatas.findById(userId);
    if (!User) {
      res.status(404).json("user not found");
    }
    const hashedSecret = await bcrypt.hash(secret, 10);
    const newPaymentHistory = {
      orderId,
      cust_Email,
      cust_Mobile,
      gateway_type,
      merchantKey,
      secret: hashedSecret,
      token,
      txnAmount,
      upiuid,
      status
    };

    // Push the new payment history object into the PaymentHistoryData array
    User.PaymentHistoryData.push(newPaymentHistory);
    await User.save();
    res.status(201).json("payment history inserted ");
  } catch (error) {
    console.error("Error adding payment history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.ManaualGetDataForapprov = async (req, res) => {
  try {
    // Find users where status is 0
    const users = await userloginDatas.find({
      "ManualPaymentHistoryData.status": 1
    });
    // Extract ManualPaymentHistoryData from each user and flatten the array
    const manualPaymentHistoryData = users
      .map((user) => user.ManualPaymentHistoryData)
      .flat();
    // Send the manualPaymentHistoryData as the response
    res.status(200).json(manualPaymentHistoryData);
  } catch (error) {
    // Handle errors
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.manualgetdataForreject = async (req, res) => {
  try {
    // Find users where status is 0
    const users = await userloginDatas.find({
      "ManualPaymentHistoryData.status": 2
    });
    // Extract ManualPaymentHistoryData from each user and flatten the array
    const manualPaymentHistoryData = users
      .map((user) => user.ManualPaymentHistoryData)
      .flat();
    // Send the manualPaymentHistoryData as the response
    res.status(200).json(manualPaymentHistoryData);
  } catch (error) {
    // Handle errors
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.PaymentHistorUpdate = async (req, res) => {
  // try {
  // Destructure the request body
  const { userId, orderId, status } = req.body;
  // console.log(userId, orderId, status);
  const responseFixeddata = await axios.get(
    "http://localhost:5000/ReferWinDataFixedAmtgetdata"
  );
  const resFixeddata = responseFixeddata.data;
  const fixedAmountOfWin = resFixeddata[0]?.FixedAmount || 0;

  const responseFixeddataofEarn = await axios.get(
    "http://localhost:5000/ReferEarnFixedAmtgetData"
  );
  const resFixeddataern = responseFixeddataofEarn.data;
  const fixedAmountOfEarn = resFixeddataern[0]?.FixedAmount || 0;

  const responseWin = await axios.get(
    "http://localhost:5000/ReferWinDataGet"
  );
  const vresponseWinData = responseWin.data;
  const UserWinData = vresponseWinData[0]?.child || 0;
  const FirstData = vresponseWinData[0]?.firstParent || 0;
  const SecondParentWin = vresponseWinData[0]?.SecondParent || 0;
  const ThirdParentWin = vresponseWinData[0]?.ThirdParent || 0;

  const UserBonusWinKey = "Child Bonus Win Bonus";
  const FirstParentWinKey = "First Parent Win Bonus";
  const SecondBonusWinKey = "Second Parent Win Bonus";
  const ThirdBonusWinKey = "Third Parent Win Bonus";

  const responseEarn = await axios.get(
    "http://localhost:5000/ReferErnDataGet"
  );
  const ReferEarndataa = responseEarn.data;
  const UserBonusData = ReferEarndataa[0]?.newuser || 0;
  const firstParentdata = ReferEarndataa[0]?.firstParent || 0;
  const SecondParentdata = ReferEarndataa[0]?.SecondParent || 0;
  const ThirdParentdata = ReferEarndataa[0]?.ThirdParent || 0;

  const UserBonusDataKey = "Child Bonus Earn Bonus";
  const FirstParentKey = "First Parent Earn Bonus";
  const SecondBonusKey = "Second Parent Earn Bonus";
  const ThirdBonusKey = "Third Parent Earn Bonus";

  // Find the user by userId
  // Find the user by userId
  const user = await userloginDatas.findById(userId);
  if (!user) {
    return res.status(404).json("User not found");
  }

  // Find the payment in user's PaymentHistorySchema by orderId
  const payment = user.PaymentHistoryData.find(
    (payment) => payment.orderId === orderId
  );

  if (!payment) {
    return res.status(404).json("Payment not found");
  }
  if (payment.status != status) {
    payment.status = status;
    await user.save();
    if (status === 1) {
      // Add txnAmount to the user's wallet
      user.wallet += payment.txnAmount;
      if (payment.percentageVal) {
        user.TotalBonus += payment.percentageVal || 0;
      }
      await user.save();
    }
    // Calculate total txnAmount where status is 1
    const totalTxnAmountdata = user.PaymentHistoryData.reduce(
      (total, payment) => {
        if (payment.status === 1) {
          return total + payment.txnAmount;
        }
        return total;
      },
      0
    );
    let referredUser;
    if (user.fixedAmntStatus != 1) {
      if (totalTxnAmountdata >= fixedAmountOfWin) {
        const valuefirst = (FirstData / 100) * totalTxnAmountdata;
        const valueSecod = (SecondParentWin / 100) * totalTxnAmountdata;
        const valueThird = (ThirdParentWin / 100) * totalTxnAmountdata;
        const valueUser = (UserWinData / 100) * totalTxnAmountdata;
        for (const referUserId of user.ReferEarnCollection) {
          if (referUserId && referUserId != 0) {
            // console.log(referUserId);
            referredUser = await userloginDatas.findById(referUserId);
          }
          if (referredUser) {
            let bonusData;
            switch (user.ReferEarnCollection.indexOf(referUserId)) {
              case 0:
                bonusData = {
                  date: Date.now(),
                  status: FirstParentWinKey,
                  price: valuefirst
                };
                break;
              case 1:
                bonusData = {
                  date: Date.now(),
                  status: SecondBonusWinKey,
                  price: valueSecod
                };
                break;
              case 2:
                bonusData = {
                  date: Date.now(),
                  status: ThirdBonusWinKey,
                  price: valueThird
                };
                break;
            }
            // Add bonus to the user
            referredUser.bonus.push(bonusData);
            // Add bonus to TotalBonus
            // Add bonus to TotalBonus or initialize it if undefined
            referredUser.TotalBonus =
              (referredUser.TotalBonus || 0) + (bonusData.price || 0);
            await referredUser.save();
          }
        }
        let userBonusdata = {
          date: Date.now(),
          status: UserBonusWinKey,
          price: valueUser
        };
        user.bonus.push(userBonusdata);
        user.TotalBonus += userBonusdata.price || 0;
        user.fixedAmntStatus = 1;
        await user.save();
      }
    }
    // Find userloginDatas by userId
    const userforearn = await userloginDatas.findById(userId);
    // console.log(userforearn, "userforearn");
    // Check if fixedAmontStatus is 1
    // console.log(userforearn);
    if (userforearn.fixedAmntStatus == 1) {
      // Find the upcoming order by orderId
      // console.log("ander aa gya");
      const upcomingOrder = userforearn.PaymentHistoryData.find(
        (order) => order.orderId == orderId
      );
      // console.log(upcomingOrder);
      // Check if txnAmount of the upcoming order is greater than a fixed amount
      if (upcomingOrder.txnAmount >= fixedAmountOfEarn) {
        const valuefirst = (firstParentdata / 100) * upcomingOrder.txnAmount;
        const valueSecod = (SecondParentdata / 100) * upcomingOrder.txnAmount;
        const valueThird = (ThirdParentWin / 100) * upcomingOrder.txnAmount;
        const valueUser = (UserBonusData / 100) * upcomingOrder.txnAmount;
        // Apply bonus to referred users
        for (const referUserId of userforearn.ReferEarnCollection) {
          if (referUserId && referUserId != 0) {
            referredUser = await userloginDatas.findById(referUserId);
          }
          if (referredUser) {
            let bonusData;
            switch (user.ReferEarnCollection.indexOf(referUserId)) {
              case 0:
                bonusData = {
                  date: Date.now(),
                  status: FirstParentKey,
                  price: valuefirst
                };
                break;
              case 1:
                bonusData = {
                  date: Date.now(),
                  status: SecondBonusKey,
                  price: valueSecod
                };
                break;
              case 2:
                bonusData = {
                  date: Date.now(),
                  status: ThirdBonusKey,
                  price: valueThird
                };
                break;
            }
            // Add bonus to the user
            referredUser.bonus.push(bonusData);
            // Add bonus to TotalBonus or initialize it if undefined
            referredUser.TotalBonus =
              (referredUser.TotalBonus || 0) + (bonusData.price || 0);
            await referredUser.save();
          }
        }
        let userBonusdata = {
          date: Date.now(),
          status: UserBonusDataKey,
          price: valueUser
        };
        userforearn.bonus.push(userBonusdata);
        userforearn.TotalBonus += userBonusdata.price || 0;
        userforearn.fixedAmntStatus = 1;
        await userforearn.save();
      }
    }

    return res.status(200).json("You Get Refer Win and refer earn Bonus");

    // Send user details as response
  } else {
    return res.status(400).json("Payment status is already updated");
  }
};

exports.paymentHistoryGetdataSingle = async (req, res) => {
  try {
    // Extract the userId from the request parameters
    const { userId } = req.params;
    const user = await userloginDatas.findById(userId);

    // If user is not found, return 404 error
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Extract the PaymentHistoryData from the user
    const paymentHistoryData = user.PaymentHistoryData;
    // Return the PaymentHistoryData
    return res.status(200).json(paymentHistoryData);
  } catch (error) {
    console.error("Error retrieving payment history data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.ReferErnData = async (req, res) => {
  try {
    const { child, firstParent, SecondParent, ThirdParent } = req.body;
    // Try to find the document
    let existingData = await ReferEarnData.findOne();
    if (existingData) {
      // If the document exists, update its fields
      existingData.child = child;
      existingData.firstParent = firstParent;
      existingData.SecondParent = SecondParent;
      existingData.ThirdParent = ThirdParent;
      await existingData.save();
      res.status(200).json({
        message: "ReferEarnData updated successfully",
        data: existingData
      });
    } else {
      // If the document doesn't exist, create a new one
      existingData = new ReferEarnData({
        child,
        firstParent,
        SecondParent,
        ThirdParent
      });
      await existingData.save();
      res.status(201).json({
        message: "ReferEarnData created successfully",
        data: existingData
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.DeletereReferWinsecond = async (req, res) => {
  try {
    const { Id } = req.body;
    // console.log(Id);
    const data = await FixedAmountDataOfWin.findByIdAndDelete(Id);
    if (data) {
      res.status(200).json("Data Delete Successfully");
    } else {
      res.status(404).json("User Id Not found");
    }
  } catch (error) {
    res.status(404).json(error);
  }
};
exports.DeletereReferEarnfixedData = async (req, res) => {
  try {
    const { Id } = req.body;
    // console.log(Id);
    const data = await FixedAmountData.findByIdAndDelete(Id);
    if (data) {
      res.status(200).json("Data Delete Successfully");
    } else {
      res.status(404).json("User Id Not found");
    }
  } catch (error) {
    res.status(404).json(error);
  }
};

exports.ReferWinDataController = async (req, res) => {
  try {
    const { child, firstParent, SecondParent, ThirdParent } = req.body;
    // console.log(child, firstParent, SecondParent, ThirdParent, FourParent);
    // Try to find the document
    let existingData = await ReferWinData.findOne();

    if (existingData) {
      // If the document exists, update its fields
      existingData.child = child;
      existingData.firstParent = firstParent;
      existingData.SecondParent = SecondParent;
      existingData.ThirdParent = ThirdParent;
      // existingData.FourParent = FourParent;s
      await existingData.save();
      res.status(200).json({
        message: "ReferEarnData updated successfully",
        data: existingData
      });
    } else {
      // If the document doesn't exist, create a new one
      existingData = new ReferWinData({
        child,
        firstParent,
        SecondParent,
        ThirdParent
        // FourParent
      });
      await existingData.save();
      res.status(201).json({
        message: "ReferEarnData created successfully",
        data: existingData
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.ReferEarnFixedAmt = async (req, res) => {
  try {
    const { FixedAmount } = req.body;
    // console.log(FixedAmount);
    // Try to find the document
    let existingData = await FixedAmountData.findOne();

    if (existingData) {
      // If the document exists, update its fields
      existingData.FixedAmount = FixedAmount;
      // existingData.FourParent = FourParent;s
      await existingData.save();
      res.status(200).json({
        message: "ReferEarnData Fixed Amount updated successfully",
        data: existingData
      });
    } else {
      // If the document doesn't exist, create a new one
      existingData = new FixedAmountData({
        FixedAmount
      });
      await existingData.save();
      res.status(201).json({
        message: "ReferEarnData Fixed Amount created successfully",
        data: existingData
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.DeletereReferWin = async (req, res) => {
  try {
    const { Id } = req.body;
    const data = await ReferWinData.findByIdAndDelete(Id);
    if (data) {
      res.status(200).json("Data Delete Successfully");
    } else {
      res.status(404).json("User Id Not found");
    }
  } catch (error) {
    res.status(404).json(error);
  }
};
exports.ReferEarnFixedAmtgetData = async (req, res) => {
  try {
    const data = await FixedAmountData.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error });
  }
};
exports.ReferWinDataGet = async (req, res) => {
  try {
    const data = await ReferWinData.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error });
  }
};
exports.ReferWinDataFixedAmt = async (req, res) => {
  try {
    const { FixedAmount } = req.body;
    // console.log(FixedAmount);
    // Try to find the document
    let existingData = await FixedAmountDataOfWin.findOne();
    if (existingData) {
      // If the document exists, update its fields
      existingData.FixedAmount = FixedAmount;
      // existingData.FourParent = FourParent;
      await existingData.save();
      res.status(200).json({
        message: "ReferWinData Fixed Amount updated successfully",
        data: existingData
      });
    } else {
      // If the document doesn't exist, create a new one
      existingData = new FixedAmountDataOfWin({
        FixedAmount
      });
      await existingData.save();
      res.status(201).json({
        message: "ReferWinData Fixed Amount created successfully",
        data: existingData
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.ReferWinDataFixedAmtgetdata = async (req, res) => {
  try {
    const data = await FixedAmountDataOfWin.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error });
  }
};
exports.ReferErnDataGet = async (req, res) => {
  try {
    const data = await ReferEarnData.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error });
  }
};
exports.DeletereReferEarn = async (req, res) => {
  try {
    const { Id } = req.body;
    const data = await ReferEarnData.findByIdAndDelete(Id);
    if (data) {
      res.status(200).json("Data Delete Successfully");
    } else {
      res.status(404).json("User Id Not found");
    }
  } catch (error) {
    res.status(404).json(error);
  }
};
// refree data get controller
exports.refreeData = async (req, res) => {
  try {
    const { Id } = req.params;

    // Fetch user data
    const userData = await userloginDatas.findById(Id);

    // Check if user data exists
    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if ReferEarnCollection exists and contains IDs
    if (
      !userData.ReferEarnCollection ||
      userData.ReferEarnCollection.length === 0
    ) {
      return res
        .status(200)
        .json({ message: "No bonus data found for this user" });
    }

    // Array to store filtered bonus data
    let filteredBonusData = [];

    // Iterate over ReferEarnCollection IDs
    for (const refId of userData.ReferEarnCollection) {
      // Find bonus data for each refId
      if (refId != 0) {
        const bonusData = await userloginDatas.findById(refId);
        // If bonus data is found and contains "Earn Bonus" or "Win Bonus" status, push to filteredBonusData
        if (bonusData && bonusData.bonus && bonusData.bonus.length > 0) {
          // Iterate over the bonus array
          for (const bonusItem of bonusData.bonus) {
            // Check if the status of the bonusItem includes "Earn Bonus" or "Win Bonus"
            if (
              bonusItem.status.includes("Earn Bonus") ||
              bonusItem.status.includes("Win Bonus")
            ) {
              // If yes, push the bonusData to filteredBonusData and break the loop
              filteredBonusData.push(bonusItem);
              break;
            }
          }
        }
      } else {
        // If refId is 0, send a response indicating no bonus data is available and return
        return res.status(200).json({ message: "No Bonus Data Available" });
      }
    }

    // Send the filtered bonus data
    res.status(200).json(filteredBonusData);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.Withdrowtext = async (req, res) => {
  try {
    const { FixedAmount } = req.body;
    let existingData = await WithdrawTextData.findOne();

    if (existingData) {
      // If the document exists, update its fields
      existingData.FixedAmount = FixedAmount;
      // existingData.FourParent = FourParent;s
      await existingData.save();
      res.status(200).json({
        message: "Withdraw Text Saved",
        data: existingData
      });
    } else {
      // If the document doesn't exist, create a new one
      existingData = new WithdrawTextData({
        FixedAmount
      });
      await existingData.save();
      res.status(201).json({
        message: "Withdraw  Text created successfully",
        data: existingData
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.DeletereWithdrawfText = async (req, res) => {
  try {
    const { Id } = req.body;
    // console.log(Id);
    const data = await WithdrawTextData.findByIdAndDelete(Id);
    if (data) {
      res.status(200).json("Data Delete Successfully");
    } else {
      res.status(404).json("User Id Not found");
    }
  } catch (error) {
    res.status(404).json(error);
  }
};
exports.WithdrawTextDatagetData = async (req, res) => {
  try {
    const data = await WithdrawTextData.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error });
  }
};
exports.ManualPaymentHistoryData = async (req, res) => {
  try {
    const { transaction_id, Amount, ScreenShot, userId } = req.body;
    console.log(transaction_id, Amount, ScreenShot, userId);
    // Check if any field is missing
    if (!transaction_id || !Amount || !ScreenShot || !userId) {
      return res.status(400).json({ error: "All fields are required." });
    }
    const data = await userloginDatas.findOne({ _id: userId });
    const manualPayment = {
      Transaction_id: transaction_id,
      Amount: Amount,
      ScreenRecord: ScreenShot
    };
    data.ManualPaymentHistoryData.push(manualPayment); // Assuming ManualPaymentHistoryData is an array
    await data.save();
    // Send success response
    res
      .status(200)
      .json({ success: true, message: "Payment data saved successfully." });
  } catch (error) {
    // Handle errors
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.ManualPaymentHistoryDatagetData = async (req, res) => {
  try {
    // Find users where status is 0
    const users = await userloginDatas.find({
      "ManualPaymentHistoryData.status": 0
    });
    // Extract ManualPaymentHistoryData from each user and flatten the array
    const manualPaymentHistoryData = users
      .map((user) => user.ManualPaymentHistoryData)
      .flat();
    // Send the manualPaymentHistoryData as the response
    res.status(200).json(manualPaymentHistoryData);
  } catch (error) {
    // Handle errors
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.geimg = async (req, res) => {
  try {
    const data = await ImgModel.find();
    res.json(data);
    // console.log(data)
  } catch (error) {
    // Handle errors
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
