const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

// Define the User schema.
const userSchema = mongoose.Schema({
  fullname:  String,
  username:  String,
  password:  String,
  email : String,
  contact : Number,
  profileImage : String,
  board : {
    type : Array,
    default :[]
  },
  posts : [
    {
      type : mongoose.Schema.Types.ObjectId,
      ref : "post"
    }
  ]
  
});

userSchema.plugin(plm);//passport ko serialize user and deserialize user use krne k liye permet de rhe ho

module.exports = mongoose.model("user", userSchema);