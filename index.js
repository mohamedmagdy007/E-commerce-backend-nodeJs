require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const mongoose = require("mongoose");
const db = require("./helpers/dbConnetion");
const cors =require("cors")
const path = require('path');
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product")
const cartRoute = require("./routes/cart")
const orderRoute = require("./routes/order")
const stripeRoute = require("./routes/stripe")

const PORT = process.env.PORT || 8000;

db.connectDB();
app.use(morgan("dev"));
app.use(express.json());
app.use(cors())
app.use("/images", express.static(path.join(__dirname, "/images")));
// app.use("/images", express.static("images"));
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/checkout", stripeRoute);

app.use((err, req, res, next) => {
  res.status(500).json({ message: err });
});
app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
