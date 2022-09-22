const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const RoomSchema = new Schema({
    roomName: {
        type: String,
        required: true,

    },
    roomId: {
        type: String,
        required: true,
        unique: true

    },
    maxNumber: {
        type: Number,
        default: 10,

    },
    members: [{
        userId: {
            type: String
        },
        userName: {
            type: String
        },
        socketId: {
            type: String
        },
        avatarId: {
            type: String
        }
    }],
    sceneId: {
        type: String,
        required: true
    },
    isEnded: {
        type: Boolean,
        default: false
    }
})
module.exports = mongoose.model('Rooms', RoomSchema);