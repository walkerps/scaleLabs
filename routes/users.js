const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const config = require('../config/database');
const Image = require('../models/dashboard');
var cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: 'walkerps',
  api_key: '682258887531887',
  api_secret: '7zI-Qp2OqQm58uX-adJQ4o4s81I'
});


// {Register}
router.post('/register',(req,res,next) => {
    let newUser = User({
        name:req.body.name,
        email:req.body.email,
        username:req.body.username,
        password:req.body.password
    });

    User.addUser(newUser, (err,user) => {
        if(err){
            res.json({success:false,message:"Failed to Register User"});
        }else{
            res.json({success:true,message:"User Registerd Successfully"});
        }
    });
});
// {Authenticate user/Login}
router.post('/authenticate',(req,res,next) =>{
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username,(err,user) => {
        if(err) throw err;
        if(!user){
            return res.json({success:false,msg:"User not Found"});
        }
        User.comparePassword(password,user.password,(err,isMatch) => {
            if(err) throw err;
            if(isMatch){
                const token = jwt.sign(user.toJSON(),config.secret,{
                    expiresIn : 604800 // expires in 1 week
                });

                return res.json({
                    success:true,
                    token:"JWT "+token,
                    user:{
                        userId:user._id,
                        name:user.name,
                        username:user.username,
                        email:user.email
                    }
                });
            }else{
                return res.json({success:false,msg:"User not found"});
            }
        });
    });
});

// {User Profile}
router.get('/profile',passport.authenticate('jwt',{session:false}),(req,res,next) => {
    res.json({user:req.user});
});

// {Show dashboard}
router.get('/dashboard', passport.authenticate('jwt',{session:false}),( req, res, next ) => {
    const community = "yes";
    Image.getCommunityImage(community, (err,data) => {
        if(err) throw err;
        return res.json({
            success:true,
            data:data
        });
    });
});

// {UploadImage}
router.post('/uploadImage',passport.authenticate('jwt',{session:false}),(req,res,next) => {
    console.log(req.body);
    let newImageToUpload = Image({
        userId:req.body.userId,
        imageUrl:req.body.imageUrl,
        imageDesc:req.body.imageDesc,
        imageTitle:req.body.imageTitle,
        community:req.body.community
    });
    Image.uploadImage(newImageToUpload,(err,image) => {
        if(err){
            return res.json({success:false,msg:"something went wrong",err:err});
        }else{
            return res.json({success:true,msg:"Successfully uploaded image"});
        }
    });

});
module.exports = router;
