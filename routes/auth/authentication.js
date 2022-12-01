const express = require("express");
const User = require("../../models/User");
const bcrypt = require("bcrypt");
var salt = 10;

const router = express.Router();

router.post("/signup", async(req, res) => {
  bcrypt.hash(req.body.password, salt, async(err, encrypted) => {
    if (err) {
      console.log(err);
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
      
              newUser.save((err, post) => {
                if (err) {
                    res.status(401).json({
                        status:0,
                        message:err.message
                    });
                }
                res.status(201).json({
                    status:1,
                    message:'Successfull created new user'
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

router.get("/login",async(req,res)=> {
    const body= req.body;
    try {
        const user= await User.findOne({email: body.email});
        console.log(body.password, user.password)
        bcrypt.compare(body.password, user.password, (err, result)=> {
           if(result) {
            res.status(200).json({
                status:1,
                message:'Successfully logged in'
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

router.get("/list", async (req, res) => {
  try {
    let users = await User.find();
    res.status(200).json({
      status: 200,
      data: users,
    });
  } catch (e) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
});

module.exports = router;
