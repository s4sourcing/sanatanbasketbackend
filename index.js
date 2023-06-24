const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
// const Stripe = require('stripe')

const app = express();
app.use(cors());
//app.use(express.json());
app.use(express.json({ limit: "50mb" }));

const PORT = process.env.PORT || 8080;

//mongodb connection
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connect to Databse"))
  .catch((err) => console.log(err));

//schema
const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  confirmPassword: String,
  image: String,
});

//model
const userModel = mongoose.model("user", userSchema);

//api
app.get("/", (req, res) => {
  res.send("Server is running");
});

//sign up
app.post("/signup", async (req, res) => {
  console.log(req.body);
  const { email } = req.body;

  userModel
    .findOne({ email: email })
    .then((result) => {
      console.log("Result :",result);
      if (!result) {
        //condition if email is not available in database
        const data = userModel(req.body);
        const save = data.save();
        res.send({ message: "Account created successfully", alert: true });
      }
      {
        // email id is already present
        //console.log("email id is already present");
        res.send({ message: "Email id is already registered", alert: false });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

//api login
app.post("/login", (req, res) => {
  console.log(req.body);
  const { email } = req.body;

  userModel
    .findOne({ email: email })
    .then((result) => {
      //console.log("Result :",result);
      if (result) {
        const dataSend = {
          _id: result._id,
          firstName: result.firstName,
          lastName: result.lastName,
          email: result.email,
          image: result.image,
        };
        console.log(dataSend);
        res.send({
          message: "Logged-in Successfully.",
          alert: true,
          data: dataSend,
        });
      } else {
        res.send({
          message: "Email id is not registered, please register",
          alert: false,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
  
});

//product section
const schemaProduct = mongoose.Schema({
  name: String,
  category:String,
  image: String,
  price: String,
  description: String,
});
const productModel = mongoose.model("product",schemaProduct)

//save product in data 
//api
app.post("/uploadProduct",async(req,res)=>{
  // console.log(req.body)
  const data = await productModel(req.body)
  const datasave = await data.save()
  res.send({message : "Uploaded successfully"})
})

//
app.get("/product",async(req,res)=>{
const data = await productModel.find({})
res.send(JSON.stringify(data))
})

//server is ruuning
app.listen(PORT, () => console.log("server is running at port : " + PORT));
