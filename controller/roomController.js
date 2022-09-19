const Room = require('../models/roomModel');
module.exports.createRoom = async (req,res,next)=>{
    try{
        const {roomName,roomId,sceneId,member,maxNumber}=req.body;
        const room = await Room.create({
            roomName,
            roomId,
            sceneId,
            member,
            maxNumber
        });
        return res.json({ status: true, room });
    }catch(ex){
        next(ex);
    }
}