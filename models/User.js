const mongoose = require("mongoose");
let Schema = mongoose.Schema;
let postSchema = new Schema(
    {
      id: {
        type: String,
      },
      email:{
        type:String,
      },
      password: {
        type: String,
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