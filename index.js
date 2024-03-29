const express = require('express');
const app= express();
const mongoose = require('mongoose');
const bodyParser = require("body-parser");


//connect to mongoose
mongoose.connect('mongodb+srv://sumedhbhatkar80:mPqt9HvRshpHGa9r@Cluster0.eapj2k8.mongodb.net/PKTP?retryWrites=true&w=majority');

// Load environment variables
// require('dotenv').config();

// // Define the port
// const port = process.env.PORT || 3000;

// // Connect to MongoDB
// mongoose.connect(process.env.MONGODB_CONNECT_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     console.log("MongoDB connected");
    
//     app.listen(port, () => {
//       console.log(`Server is running on port ${port}`);
//     });
//   })
//   .catch(err => {
//     console.error("Error connecting to MongoDB:", err);
//     process.exit(1);
//   });

//create dataschema
const userSchema={
     name:String,
      email:String, 
      phoneNumber:Number,
      Message:String,
      subject:String,}

const User=mongoose.model("Users",userSchema);

app.get("/",(req, res)=>{
     res.sendFile(__dirname+"/index.html");
    })
app.get("/index1",(req, res)=>{
         res.sendFile(__dirname+"/index1.html");
    })

//Middleware for data validation
const validateFormData=(req, res, next)=>{
     const phoneNumber= req.body.phoneNumber;
 
     //check if number has exactly 10 digits and no space
    if(/^\d{10}$/.test(phoneNumber)){
         next();
        }
     else{ 
        res.status(400).send(res.send('<script>alert("Enter correct phone number");window.location.href="/";</script>'));
    }}

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

//route for submission
 app.post("/", validateFormData,(req,res)=>{
     const phoneNumber= req.body.phoneNumber;

     //check if phone number already exists in the db  
 User.findOne({phoneNumber:phoneNumber})
  .then(existingFormData=>{
     if(existingFormData){
         res.send('<script>alert("phone number already exists. You cannot proceed.");window.location.href="/";</script>')
          //res.sendFile(__dirname+"/failed.html")       
         }else{
            console.log(req)
             //phone number doesnot exist, save the formdata to mongodb         
               let newUser= new User({
                name:req.body.name,
                email:req.body.email,
                phoneNumber:req.body.phoneNumber,
                Message:req.body.message, subject:req.body.subject,})
                newUser.save();

                res.redirect("/index1");
 }})})
 app.listen(3000,()=>{
     console.log("server is running ");
    })