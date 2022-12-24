const mongoose = require("mongoose");
let Schema = mongoose.Schema;
let surveySchema = new Schema(
    {
        questionType: {
            type: String,
        },
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
        id:{
            type:String
        }
    },
  );
  
let optionSchema= new Schema({

})

  let Survey = mongoose.model("Survey", surveySchema);
  
  module.exports = Survey;