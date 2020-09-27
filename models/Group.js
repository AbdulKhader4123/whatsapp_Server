const mongoose= require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema =mongoose.Schema;

const GroupSchema = new Schema({
    name: {
        type: String,
    },
    members: {
        type: Array,
    },
    created: {
        type: String,
    },
    createdBy:{
        type: String,
    },
    admins:{
        type: Array,
    },
    groupId:{
        type: Number,
    },
    pic:{
        type: String,
    }
})

GroupSchema.plugin(AutoIncrement, {inc_field: 'groupId',start_seq:1000});
module.exports=Group = mongoose.model('group',GroupSchema)