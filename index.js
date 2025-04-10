require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose'); 
const cors = require('cors');
const authRouter = require('./routes/auth'); 
const serviseRouter = require('./routes/servise');
const categoryRouter = require('./routes/category');
const doctorRouter = require('./routes/doctor');
const videoRouter = require('./routes/video');
const VendorRouter = require('./routes/vendor'); 
const helpMessageRouter = require('./routes/help_message');
const emailRouter = require('./routes/email');
// const App = require('./routes/google_sign_in');
const port = process.env.PORT || 4000;

const app = express();
 const DB = "mongodb+srv://mudassirmohibali:mudassirali@cluster0.3iphi.mongodb.net/";
 app.use(express.json());
 app.use(cors());
 app.use(authRouter);
 app.use(serviseRouter);
 app.use(categoryRouter);
 app.use(doctorRouter);
 app.use(videoRouter);
 app.use(VendorRouter);
 app.use(helpMessageRouter);
 app.use(emailRouter);
//  app.use(App);
 mongoose.connect(DB).then(()=>{
    console.log("mongodb connect");
 });
app.listen(port, "0.0.0.0",function(){
    console.log(`server is runing on prot ${port}`);
});