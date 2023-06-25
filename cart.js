const mongoose = require("mongoose");

const cart = new mongoose.Schema(
  {
  
    id:String,
    name:String,
    image:{type:String},
    Catogory:String,
    Colour:String,
    MRP:String
  }
,
  {
    collection: "Cart",
  }
);

mongoose.model("Cart", cart);