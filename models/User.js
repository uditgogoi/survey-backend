const mongoose = require("mongoose");
let Schema = mongoose.Schema;
let postSchema = new Schema(
    {
      email:{
        type:String,
        required: true
      },
      password: {
        type: String,
        required: true
      },
      company: {
        type:String
      },
      token:{
        type:String
      }
    },
  );
  
  let User = mongoose.model("Users", postSchema);
  
  module.exports = User;