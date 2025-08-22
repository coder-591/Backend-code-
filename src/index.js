import dotenv from "dotenv";
import connectionDB from "./db/db.js";
import app from "./app.js";
dotenv.config({
  path: ".env",
});

const envPort = process.env.PORT || 5000;
// here it return promise so we handle it
connectionDB()
  .then(() => {
    app.listen(envPort, () => {
      console.log(`Server is running at port : ${envPort}`);
    });
  })
  .catch((err) => {
    console.log("Connection failed !!", err);
  });















  
// First approach is use in main file
// two step for connecting database
// 1 is always connnect database in try catch block
// 2 is always write in async await function
// Code
// import express from "express";
// const app = express();
// (async () => {
//   try {
//       await mongoose.connect(`${process.env.MONGO_URI}/${DB_Name}`);

//     app.on("Error", (error) => {
//       console.log("Error", error);
//       throw error;
//     });

//     app.listen(process.env.PORT, () => {
//       console.log(`App is listening on this port:${process.env.PORT}`);
//     });
//   } catch (error) {
//     console.error("Error :", error);
//     throw err;
//   }
// })();
