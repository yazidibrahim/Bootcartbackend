const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const cors = require("cors");
app.use(cors());
const bcrypt = require("bcryptjs");
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

const jwt = require("jsonwebtoken");
const JWT_SECRET =
  "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe";

const mongoUrl =
  "mongodb+srv://yazidibrahim:yazidibrahim@cluster0.0qegvnd.mongodb.net/ht?retryWrites=true&w=majority";

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => console.log(e));

require("./userDetails");
require("./cart");
require("./cardItem");
const User = mongoose.model("UserInfo");
const Cart = mongoose.model("Cart");
const CardItem = mongoose.model("cardItems");



//signup or registration api
app.post("/register", async (req, res) => {
  const { fname, lname, email, password, userType, data } = req.body;

  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.json({ error: "User Exists" });
    }
    await User.create({
      fname,
      lname,
      email,
      password: encryptedPassword,
      userType,
      profileImage: data.image
    });
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error" });
  }
});

//cart api
app.post("/home", async (req, res) => {
  const { id, name, image, Catogory, Colour, MRP} = req.body;
  try {
    await Cart.create({
      id,
      name,
      image,
      Catogory,
      Colour,
      MRP
    });
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error" });
  }
}
);

//login api
app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ error: "User Not found" });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ email: user.email }, JWT_SECRET, {
      expiresIn: "1hr",
    });

    if (res.status(201)) {
      return res.json({ status: "ok", data: token,redirectUrl: '/'  });
      
    } else {
      return res.json({ error: "error" });
    }
  }
  res.json({ status: "error", error: "InvAlid Password" });
});


//userhome api
app.post("/userData", async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET, (err, res) => {
      if (err) {
        return "token expired";
      }
      return res;
    });
    console.log(user);
    if (user == "token expired") {
      return res.send({ status: "error", data: "token expired" });
    }
    const useremail = user.email;
    User.findOne({ email: useremail })
      .then((data) => {
        res.send({ status: "ok", data: data });
      })
      .catch((error) => {
        res.send({ status: "error", data: error });
      });
  } catch (error) { }
});


//getallusers for admin
app.get("/getAllUser", async (req, res) => {
  try {
    const allUser = await User.find({});
    res.send({ status: "ok", data: allUser });
  } catch (error) {
    console.log(error);
  }
});

//getItems for userhome
app.get("/getItems", async (req, res) => {
  try {
    const allUser = await Cart.find({});
    res.send({ status: "ok", data: allUser });
  } catch (error) {
    console.log(error);
  }
});



//post carditem for cart
app.post("/cardItem", async (req, res) => {
  const {pId,email,location } = req.body;
  try {
    await CardItem.create({

      pId,
      email,
      location
    });
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error" });
  }
}
)





//delete user by admin
app.post("/deleteUser", async (req, res) => {
  const { userid } = req.body;
  try {
    User.deleteOne({ _id: userid }, function (err, res) {
      console.log(err);
    });
    res.send({ status: "Ok", data: "Deleted" });
  } catch (error) {
    console.log(error);
  }
});


//listen api
app.listen(5000, () => {
  console.log("Server Started");
});