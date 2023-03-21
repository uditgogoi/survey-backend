const express = require("express");
const Survey = require("../../models/Survey");
const Response= require("../../models/Response");
const User = require("../../models/User");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { sendApiError } = require("../../utils/errorHandling");
var ObjectId = require('mongodb').ObjectId;

// get surveys based on userID and surveyID
// this is for the client side
router.post("/survey", async (req, res) => {
  if (!req.body.user_id || !req.body.survey_id) {
    const message = "Invalid parameters sent";
    sendApiError(res, message);
    return;
  }
  try {
    const clientRequestData= req.body;
    let userID = clientRequestData.user_id+'';
    const surveyID = clientRequestData.survey_id+'';
    const user = await User.findById({ _id:new ObjectId(userID)});
    if (!user) {
      const message = "No user found";
      sendApiError(res, message);
      return;
    }
    const survey = await Survey.findOne({_id:new ObjectId(surveyID),user:userID});
    if (!survey) {
      const message = "No survey found";
      sendApiError(res, message);
      return;
    }
    res.status(201).json({
        status:1,
        message:'Request successfull',
        data:{
            id:survey._id,
            questions:survey.questions,
            title: survey.title
        }
    })
  } catch (e) {
    sendApiError(res, e.message);
  }
});

router.post("/responses", async (req, res)=> {
  if(!req.body.user_id || !req.body.survey_id || !req.body.responses) {
    const message = "Invalid parameters sent";
    sendApiError(res, message);
    return;
  }
  try {
    const clientRequestData= req.body;
    let userID = clientRequestData.user_id+'';
    const user = await User.findById({ _id:new ObjectId(userID)});
    if (!user) {
      const message = "No user found";
      sendApiError(res, message);
      return;
    }
    const survey = await Survey.findOne({_id:new ObjectId(surveyID),user:userID});
    if (!survey) {
      const message = "No survey found";
      sendApiError(res, message);
      return;
    }
    const responses= new Response({
      responses: req.body.responses,
      survey_id: req.body.survey_id,
      user_id: req.body.user_id
    })
    responses.save((err) => {
      if (err) {
          sendApiError(res, err.message);
          return;
      }
      res.status(201).json({
          status:'OK',
          message:'Successfull added response',
      });
    })
  } catch(e){

  }
})

module.exports = router;
