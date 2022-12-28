const mongoose = require("mongoose");
let Schema = mongoose.Schema;
let questionType= new Schema({
    title:{
        type:String,
    },
    required: {
        type: Boolean,
    },
    options: [
        {
            id:{type:String},
            value:{type:String},
            displaySequence:{type:Number}
        }
    ],
})

let surveySchema = new Schema(
    {
        questions: [{
            type: questionType,
            default : []
        }],
        title:{
            type:String
        },
        user:{
            type:String
        }
    },
  );
  


  let Survey = mongoose.model("Survey", surveySchema);
  
  module.exports = Survey;