const chatMessage = require('../models/message');
const Group = require('../models/Group');
const Contact = require('../models/contact');
const User = require('../models/user');
const message =require("../Utilities/message")
const _ =require('lodash');


module.exports.getMessages = async (req, res, next) => {
    try {
        const messages = await chatMessage.find({});
        res.json(messages)
        }
    catch (err) {
        console.log(err)
}
}

module.exports.getGroupDetails = async(req,res)=>{
    try {
        const groups = await Group.find({});
        res.json(groups)
        }
    catch (err) {
        console.log(err)
}
}

module.exports.getUserGroupIds = async(req,res)=>{
    try {
        let phone=req.body.phone;
         const user=await User.findOne({
            phone:phone
         })
        const groups = user.groups;
        res.json(groups)
        }
    catch (err) {
        console.log(err)
}
}

module.exports.getContacts  = async(req,res)=>{
    try {
        const users =await User.find({})
        let result=users.map(({name,phone,pic,about,lastSeen})=>({name,phone,pic,about,lastSeen}))
        res.json(result)
        }
    catch (err) {
        console.log(err)
}
}

module.exports.updateRead =async(req,res)=>{
    try {
        const messages=req.body.updatedStatus;
        let msgs=[];
        for (let msg of messages) {
             
            msgs.push(msg._id)
         };
        await chatMessage.updateMany({_id:{ $in: msgs}},{ status: '2' }, { multi: true }, function(err, result) {
        if (err) { console.log(err);
            } 
            else { 
                 res.json("success")
            }
        })
        }
    catch (err) {
}
}

module.exports.createGroup =async(req,res)=>{
    try {
        const groupDetails=req.body.groupDetails;
        groupDetails.pic= groupDetails.pic?groupDetails.pic:"https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
        const group=new Group({
            name:groupDetails.name,
            members:groupDetails.members,
            created:groupDetails.created,
            createdBy:groupDetails.createdBy,
            admins:groupDetails.admins,
            pic:groupDetails.pic
    })
            
        let groupCreated= await group.save();
         var criteria = {
            phone:{ $in: groupDetails.members}
           };
            User.updateMany(criteria, {$push: {groups: groupCreated.groupId}}, { multi: true }, function(err, res) {
            if (err) {  console.log(err);
            } else { console.log(res);
            }
        });
        res.json({
            msg: message.constants.group.group_created,
            group:groupCreated
            })
      
        }
    catch (err) {
        console.log(err)
}
}