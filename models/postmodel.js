const mongoose = require('mongoose');

// Define the User schema.
const postSchema = mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    },
    postImage : String,
  postTitle:  String,
  postDescription:  String,
    
});


module.exports = mongoose.model("post", postSchema);