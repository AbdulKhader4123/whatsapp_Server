const mongoose= require('mongoose');
const Schema =mongoose.Schema;

const ContactSchema = new Schema({
    name: {
        type: String,
    },
    number: {
        type: String,
    },
    pic:{
        type: String,
    },
    lastSeen:{
        type: String,
    },
    
})


module.exports=Contact = mongoose.model('contact',ContactSchema)