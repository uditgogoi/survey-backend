const express = require("express");
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
var salt = 10;
const { sendApiError } = require("../../utils/errorHandling");
const router = express.Router();

router.post("/signup", async(req, res) => {
  bcrypt.hash(req.body.password, salt, async(err, encrypted) => {
    if (err) {
      sendApiError(res, err.message);
    } else {
      try {
        const user= await User.findOne({email: req.body.email});
        if(user) {
          const message="User already exist"
          sendApiError(res, message);
          return;
        }
        if(req.body.password === req.body.confirmPassword) {
            let newUser = new User({
                email: req.body.email,
                password: encrypted,
                company: req.body.company,
              });
            
              newUser.save((err, user) => {
                if (err) {
                  sendApiError(res, err.message);
                  return;
                }
                res.status(201).json({
                    status:"OK",
                    message:'Successfull created new user',
                    data:{id:user._id, email:user.email, company:user.company}
                });
              });
        } else {
            res.status(200).json( {
                status:"OK",
                message:"Confirm Password and password doesn't match",
            })
        }
        
      } catch (e) {
        sendApiError(res, e.message);
      }
    }
  });
});

router.post("/login",async(req,res)=> {
    const body= req.body;
    try {
        const user= await User.findOne({email: body.email});
        bcrypt.compare(body.password, user.password, (err, result)=> {
           if(result) {
            const token= createToken(user._id);
            res.status(200).json({
                status:'OK',
                message:'Successfully logged in',
                data:{
                  accessToken:token,
                  userId:user._id,
                  company:user.company,
                  email:user.email
                }
            })
           } else {
            const message=err.message || "Email and Password doesn't match"
            sendApiError(res,message);
           }
        });
    } catch(e) {
        sendApiError(res,e.message);
    }
   
})


const maxAge= 3*24*60*60;
const createToken=(id)=> {
   // create token
   return jwt.sign(
    { user_id: id },
      process.env.TOKEN_KEY,
      {
        expiresIn:maxAge ,
      }
  )
}

const destroyToken=(id)=> {
  return jwt.sign(
    { user_id: id },
      process.env.TOKEN_KEY,
      {
        expiresIn: Date.now(),
      }
  )
}

module.exports = router;
