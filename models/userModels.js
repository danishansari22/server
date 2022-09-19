const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        max:20

    },
    userId:{
        type: String,
        // required: true,
        unique: true,
        min: 6,
        max:20
    },
    roomId:{
        type: String,
        // required: true,
        min: 6,
        max:20
    },

    email: {
        type: String,
        required: true,
        unique: true,
        max: 50
    },
    password: {
        type: String,
        required: true,
        min: 8
    },
    isAvatarIamge: {
        type: Boolean,
        default: false

    },
    avatarImage: {
        type: String,
        default: ""
    },
    avtarId:{
        type:String, 
    },
    position:{
        x: {
            type: Number,
            default: 0
        },
        y: {
            type: Number,
            default: 0
        },
        z: {
            type: Number,
            default: 0
        }

    },
    rotation:{
        // default: "0 0 0",

        x:{
            type: Number,
            default: 0
        },
        y:{
            type: Number,
            default: 0
        },
        z:{
            type: Number,
            default: 0
        }
    }
});

module.exports = mongoose.model('Users', userSchema);
