const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB =  () => {
 
     mongoose.connect(process.env.MONGO_URI).then(()=>{
      console.log("Connection successful")
  
     }).catch((err) => console.log("Connection failed " + err))
};

module.exports = connectDB;