const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type: String,
        require: true,
    },

  profileImage: {
    type: String,
    default: 'https://via.placeholder.com/50' // default image URL
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  
  username: String,
  password: String
}, 
{ timestamps: true });

 
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);
