const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const RoomSchema = new Schema({
    roomName: {
        type: String,
        required: true,
        
    },
    roomId:{
        type: String,
        required: true,
        unique: true

    },
    maxNumber:{
        type:Number,
        default:10,

    },
    member:[{
        userId:{
            type:String
        }
    }],
    sceneId:{
        type:String,
        required:true
    }
})
module.exports = mongoose.model('Rooms',RoomSchema);