const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String
    },
    phone: {
        type: String
    },
    pic: {
        type: String
    },
    password: {
        type: String
    },
    about: {
        type: String
    },
    date:{
        type: Date,
        default: Date.now
    },
    lastSeen:{

    },
    groups:{
        type:Array
    }
})





module.exports = User = mongoose.model('user', UserSchema);