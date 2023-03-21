const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let responseSchema = new Schema(
    {
        responses: [{
            question_id:{type:String},
            option_id:{type:String},
            resp_description:{type:String, require:false, default:''}
        }],
        survey_id:{
            type:String
        },
        user_id:{
            type:String
        }
    },
  );
  


  let Response = mongoose.model("Response", responseSchema);
  
  module.exports = Response;