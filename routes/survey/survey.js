const express = require("express");
const Survey = require("../../models/Survey");
const User = require("../../models/User");
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post("/list",async(req,res)=> {
    try {
        // var token= req.headers['x-access-token'] || req.headers['authorization'];
        // if(!token) {
        //     return res.status(401).send({ status:0, message: 'No token provided.' })
        // }
        let token = req.body.accessToken;
         if(!token) {
            return res.status(401).send({ status:0, message: 'No token provided.' })
        }
        const decode= jwt.verify(JSON.parse(token),process.env.TOKEN_KEY );
        const user= await findUser(decode.user_id);
        if(!user){
            res.status(401).send({status:0, message:"Error in finding user"})
        }
        const surveys= await Survey.find({user:decode.user_id })
        res.status(200).json({
            status:200,
            message:'Successfully got surveys',
            data:surveys
        })
    } catch(e) {
        res.status(401).json({
            status:0,
            message:e.message,
        })
    }

})

router.post("/list/id",async(req,res)=> {
    try {
        let token = req.body.accessToken;
        if(!token) {
            return res.status(401).send({ status:0, message: 'No token provided.' })
        }
        const decode= jwt.verify(JSON.parse(token),process.env.TOKEN_KEY );
        const user= await findUser(decode.user_id);
        if(!user){
            res.status(401).send({status:0, message:"Error in finding user"})
        }
        var id = req.body.id;
        const survey= await Survey.find({user:decode.user_id, _id:id })
        res.status(200).json({
            status:0,
            message:'Successfully got survey',
            data:survey
        })
    } catch(e) {
        res.status(401).json({
            status:0,
            message:e.message,
        })
    }

})

router.post("/add",async(req,res)=> {
   try{
    let token = req.body.accessToken;
    if(!token) {
        return res.status(401).send({ status:0, message: 'No token provided.' })
    }
    if(req.body.questions.length===0) {
        return res.status(401).send({ status:0, message: 'No survey questions entered' })
    }
    const decode= jwt.verify(JSON.parse(token),process.env.TOKEN_KEY );    
    // add the survey
    const user= await findUser(decode.user_id);
    if(!user){
        res.status(401).send({status:0, message:"Error in adding"})
    }
    const newSurvey= new Survey({
        questions:req.body.questions,
        title:req.body.title,
        user:decode.user_id
    })
    newSurvey.save((err, survey) => {
        if (err) {
            res.status(401).json({
                status:0,
                message:err.message,
            });
        }
        res.status(201).json({
            status:1,
            message:'Successfull added survey',
            data:survey
        });
      })

   } catch(e) {
        res.status(401).json({
            status:0,
            message:"error is " + e.message
        });
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
