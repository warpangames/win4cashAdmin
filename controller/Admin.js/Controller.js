

// // module.export const priceControllerOfGame = async (req, res, next) => {
// //     try {
// //       const {
// //         username,
// //         name,
// //         usereffral,
// //         verification,
// //         wallet,
// //         userphone,
// //         img,
// //         date,
// //         reffralcode,
// //         bonas,
// //         userotp
// //       } = req.body;
  
// //       const newUser = new userloginDatas({
// //         username,
// //         name,
// //         usereffral,
// //         verification,
// //         wallet,
// //         img,
// //         userphone,
// //         date,
// //         reffralcode,
// //         bonas,
// //         userotp
// //       });
// //       const savedUser = await newUser.save();
// //       res.status(201).json(savedUser);
// //     } catch (error) {
// //       console.error(error);
// //       if (error.name === "ValidationError") {
// //         return res.status(400).json({ error: error.message });
// //       }
// //       res.status(500).json({ error: "Server error" });
// //     }
// //   };


// const AdminData = require("../models/Admin.model.js");
// const returnmodel = require("../models/Return.model.js")


// const BatXupdate = async (req,res)=>{
//   try {
//     await returnmodel.ColorX.create({
//       color:req.body.color
//     })
//     await returnmodel.NumberX.create({
//       "0":req.body.on0,
//       "1":req.body.on1,
//       "2":req.body.on2,
//       "3":req.body.on3,
//       "4":req.body.on4,
//       "5":req.body.on5,
//       "6":req.body.on6,
//       "7":req.body.on7,
//       "8":req.body.on8,
//       "9":req.body.on9,


//     })
//     await returnmodel.BgX.create({
//       big:req.body.big,
//       small:req.body.small
//     })

//     res.json("Return Updated Sucessfully !")
//   } catch (error) {
//     console.log(error);
    
//   }
// }





// module.exports = {BatXupdate};
