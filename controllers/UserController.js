const User = require('../models/user');
const message =require("../Utilities/message")
const bcrypt= require('bcryptjs');
const _ =require('lodash');
const jwt=require('jsonwebtoken');
const randtoken = require('rand-token');
const keys = require('../Utilities/Keys')

const RefreshTokens=[]


module.exports.addUser = async (req, res, next) => {

try {
    
    const newUser = new User(_.pick(req.body,['name','password','phone']));

    newUser.pic="https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png";
    newUser.about="Available"
    const salt= await bcrypt.genSalt(10);
    // const hashed= await bcrypt.hash("Asdf1234",salt);
    const hashed= await bcrypt.hash(newUser.password,salt);

    newUser.password=hashed;
    await newUser.save()

    res.json({
        msg: message.constants.user.user_created,
        userName:newUser.name
        })
    }
catch (err) {
    debug(err)
}

 }
async function UserExist(req){
    let user = null
    let phone = req.body.phone;
    try {
        user = await User.findOne({
            phone: phone,
        })
        }
    catch{
        user = null
    }

    return user;
}

module.exports.CheckUser=async(req,res)=>{
    try {
        const user = await UserExist(req)
        if (!user) {
            return res.json({
                msg: message.constants.user.username_available,
            })  }
        else {
            return  res.json({
                msg: message.constants.user.username_exist,
                phone:user.phone
            })

            }

    }
    catch (err) {
        debug(err)
    }
}
async function findUserLogin(req){
    let user=null;
    let phone=req.body.phone;
    try{
        user=await User.findOne({
        phone:phone,
    })
    if(user!=null){
        const validPassword= await bcrypt.compare(req.body.password,user.password)
        if(!validPassword){
            user.password="Incorrect Password";
        }
    }
    }
    catch{
        user=null;
    }
    return user;
}
module.exports.LoginUser = async (req, res) => {

    try {
        const user = await findUserLogin(req)
        if (!user) {
            return res.status(404).json({ msg: message.constants.user.user_not_exist })
        }
        else {
            if(user.password=="Incorrect Password"){
            return res.status(403).json({ msg: message.constants.user.password_mistmatch })
            }
            const refreshToken = randtoken.uid(256);
            RefreshTokens[refreshToken] = user._id;
            jwt.sign({_id:user._id},keys.secretOrPrivateKey,{ expiresIn: 3000 },(err,token)=>{
                return res.json({
                    phone:user.phone,
                    name:user.name,
                    pic:user.pic,
                    about:user.about,
                    token:{jwt:'Bearer ' +token,
                    refreshToken: refreshToken},
                    msg: message.constants.user.user_logged_in,
                })
            });
            }
    }
    catch (err) {
        debug(err)
    }


}
module.exports.GenerateOTP= async (req, res)=> {
    // var http = require("http");
    var axios=require("axios")
    let path= "https://2factor.in/API/V1/d2a687b3-00f5-11eb-9fa5-0200cd936042/SMS/"+req.body.phoneNumber+"/AUTOGEN/demo123"
    var options = {
        "headers": {
        "content-type": "application/x-www-form-urlencoded"
        }
    };
    axios.get(path, options)
    .then(function (response) {
    // handle success
    if(response.data.Status=="Success"){
    return res.status(200).json({ message: 'OTP Sent successfully.',
    SessionId:response.data.Details });
    }
    })
    .catch(function (error) {
    // handle error
    console.log(error);
    return res
    .status(409)
    .json({ message: 'OTP Failed' });
    })
    .then(function () {
    });
        }

module.exports.VerifyGenerateOTP =  async (req, res)=> {
    var axios=require("axios")
    let path="https://2factor.in/API/V1/d2a687b3-00f5-11eb-9fa5-0200cd936042/SMS/VERIFY/"+req.body.sessionID+"/"+req.body.OTP;
    var options = {
        "headers": {
        "content-type": "application/x-www-form-urlencoded"
        }
    };
    axios.get(path, options)
    .then(function (response) {
    // handle success

    if(response.data.Status=="Success"){
        return res.status(200).json({ message: 'OTP Verified successfully.' });
    }
    })
    .catch(function (error) {
    // handle error
    console.log(error);
    return res
    .status(200)
    .json({ message: 'OTP Failed' });
    })
    .then(function () {
    // always executed
    });
        }

module.exports.saveProfile = async(req,res)=>{
    try {
        const userProfile=req.body.updatedProfile;
        
        await User.findOneAndUpdate({phone:userProfile.number},{$set:{about:userProfile.about,name:userProfile.name   
        }})
        res.json("success")
        }
    catch (err) {
        console.log(err)
}
}