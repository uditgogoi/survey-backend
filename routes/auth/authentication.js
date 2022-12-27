const express = require("express");
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
var salt = 10;

const router = express.Router();

router.post("/signup", async(req, res) => {
  bcrypt.hash(req.body.password, salt, async(err, encrypted) => {
    if (err) {
      res.status(401).json({
        status:0,
        message:err.message
    });
    } else {
      try {
        const user= await User.findOne({email: req.body.email});
        if(user) {
            res.status(401).json({
                status:0,
                message:'User already exist'
            });
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
                    res.status(401).json({
                        status:0,
                        message:err.message,
                    });
                }
                res.status(201).json({
                    status:1,
                    message:'Successfull created new user',
                    data:{id:user._id, email:user.email, company:user.company}
                });
              });
        } else {
            res.status(200).json( {
                success:0,
                message:"Confirm Password and password doesn't match",
            })
        }
        
      } catch (e) {
        res.status(401).json( {
            success:0,
            message:e.message,
        })
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
                status:1,
                message:'Successfully logged in',
                data:{
                  accessToken:token,
                  userId:user._id,
                  company:user.company,
                  email:user.email
                }
            })
           } else {
            res.status(401).json({
                status:0,
                message:"Email and Password doesn't match"
            })
           }
        });
    } catch(e) {
        res.status(401).json({
            status:0,
            message:"Email doesn't exist"
        })
    }
   
})
router.get("/logout", async(res,req)=> {
  try {
    var token= req.headers['x-access-token'] || req.headers['authorization'];
    if(!token) {
        return res.status(401).send({ status:0, message: 'No token provided.' })
    }
    token = token.replace(/^Bearer\s+/, "");
    const decode= jwt.verify(token,process.env.TOKEN_KEY );
    destroyToken(decode.user_id);
    res.end()
  } catch(e){
    res.status(401).json({
      status:0,
      message:e.message
    })
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
