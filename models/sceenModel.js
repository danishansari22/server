const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SceenSchema = new Schema({
    sceneName: {
        type: String,
        required: true,
    },
    sceneId:{
        type: String,
        required: true,
        unique: true
    },
    scenePreview:{
        type:String,
        required:true
    },
    sceneUrl:{
        type:String,
        required:true
    },
    sceneDescription:{
        type:String,
        required:true
    }
})