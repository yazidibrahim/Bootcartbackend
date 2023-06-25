const mongoose = require("mongoose");

const cardItem = new mongoose.Schema(
  {
  
    pId: String,
    email:{ type: String, unique: true },
    location: String,
  },
  {
    collection: "cardItems",
  }
);

mongoose.model("cardItems", cardItem);