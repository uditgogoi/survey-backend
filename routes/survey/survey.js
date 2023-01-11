const express = require("express");
const Survey = require("../../models/Survey");
const User = require("../../models/User");
const router = express.Router();
const jwt = require('jsonwebtoken');
const { sendApiError } = require("../../utils/errorHandling");


// get list of all the surveys
router.post("/list",async(req,res)=> {
    try {
        // var token= req.headers['x-access-token'] || req.headers['authorization'];
        // if(!token) {
        //     return res.status(401).send({ status:0, message: 'No token provided.' })
        // }
        let token = req.body.accessToken;
         if(!token) {
            const message="No token provided";
            sendApiError(res, message);
            return;
        }
        const decode= jwt.verify(JSON.parse(token),process.env.TOKEN_KEY );
        const user= await findUser(decode.user_id);
        if(!user){
            const message="Error in finding user";
            sendApiError(res, message);
            return;
        }
        const surveys= await Survey.find({user:decode.user_id })
        res.status(200).json({
            status:'OK',
            message:'Successfully got surveys',
            data:surveys
        })
    } catch(e) {
        sendApiError(res, e.message);
    }

})

// get details of a specific survey
router.post("/list/id",async(req,res)=> {
    try {
        let token = req.body.accessToken;
        if(!token) {
            const message="No token provided";
            sendApiError(res, message);
            return;
        }
        const decode= jwt.verify(JSON.parse(token),process.env.TOKEN_KEY );
        const user= await findUser(decode.user_id);
        if(!user){
            const message="Error in finding user";
            sendApiError(res, message);
            return;
        }
        var id = req.body.id;
        const survey= await Survey.findOne({user:decode.user_id, _id:id })
        res.status(200).json({
            status:'OK',
            message:'Successfully got survey',
            data:survey
        })
    } catch(e) {
        sendApiError(res, e.message);
    }

})

// add new survey
router.post("/add",async(req,res)=> {
   try{
    let token = req.body.accessToken;
    if(!token) {
        const message="No token provided";
        sendApiError(res, message);
        return;
    }
    if(req.body.questions.length===0) {
        const message="No survey questions entered";
        sendApiError(res, message);
        return;
    }
    const decode= jwt.verify(JSON.parse(token),process.env.TOKEN_KEY );    
    // add the survey
    const user= await findUser(decode.user_id);
    if(!user){
        const message="Error in adding new survey";
        sendApiError(res, message);
        return;
    }
    const newSurvey= new Survey({
        questions:req.body.questions,
        title:req.body.title,
        user:decode.user_id
    })
    newSurvey.save((err, survey) => {
        if (err) {
            sendApiError(res, err.message);
            return;
        }
        res.status(201).json({
            status:'OK',
            message:'Successfull added survey',
            data:survey
        });
      })

   } catch(e) {
        sendApiError(res, e.message);
   }

})

const findUser=(userId) => {
    return new Promise(async(res,rej)=> {
        try{
            const user= await User.find({_id : userId});
            if(!user) {
                rej("error")
            }
            res(user)
        } catch(e) {
            rej(e)
        }
        
    })
}



module.exports = router;
