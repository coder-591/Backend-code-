import mongoose from "mongoose";
import { DB_Name } from "../constants.js";
// when ever async function runs it return a Promise
const connectionDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/${DB_Name}`);
    console.log(`Database is connected!! and DB host`);
  } catch (error) {
    console.error("Mongo DB Error", error);
    throw error;
  }
};

export default connectionDB;
