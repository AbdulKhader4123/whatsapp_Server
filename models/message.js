const mongoose= require('mongoose');
const Schema =mongoose.Schema;

const MessageSchema = new Schema({
    sender: {
        type: String,
    },
    body: {
        type: String,
    },
    time: {
        type: String,
    },
    status:{
        type: String,
    },
    recvId:{
        type: String,
    },
    IsGroup:{
        type:Boolean
    }
})


module.exports=Message = mongoose.model('message',MessageSchema)