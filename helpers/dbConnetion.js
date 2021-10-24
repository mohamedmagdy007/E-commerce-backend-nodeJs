const mongoose = require("mongoose");

const connectDB = () => {
  mongoose
    .connect(process.env.Mongo_Url)
    .then(() => console.log("DB connction"))
    .catch((err) => {
      console.log(err);
    });
};
exports.connectDB= connectDB;
