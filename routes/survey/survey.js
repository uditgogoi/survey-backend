const express = require("express");
const Survey = require("../../models/Survey");
const User = require("../../models/User");
const router = express.Router();
const jwt = require('jsonwebtoken');
const SECRET_TOKEN= require("../../nodemon.json")

router.get("/list",async(req,res)=> {
    console.log("this is running")

})

router.post("/add",async(req,res)=> {
   try{
    var token= req.headers['x-access-token'] || req.headers['authorization'];
    token = token.replace(/^Bearer\s+/, "");
    if(!token) {
        return res.status(401).send({ status:0, message: 'No token provided.' })
    }
    const decode= jwt.verify(token,process.env.TOKEN_KEY );    
    // add the survey
    const user= await findUser(decode.user_id);
    if(!user){
        res.status(401).send({status:0, message:"Error in adding"})
    }
    const newSurvey= new Survey({
        questionType:req.body.questionType,
        title:req.body.title,
        required:req.body.required,
        options:req.body.options,
        id:req.body.id
    })
    newSurvey.save((err, survey) => {
        if (err) {
            res.status(401).json({
                status:0,
                message:err.message,
                data:survey
            });
        }
        res.status(201).json({
            status:1,
            message:'Successfull added survey'
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
