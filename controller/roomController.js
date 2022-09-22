const Room = require('../models/roomModels');
module.exports.createRoom = async (req, res, next) => {
    try {
        console.log(req.body)
        const { roomName, roomId, sceneId, member, maxNumber } = req.body;
        const room = await Room.create({
            roomName,
            roomId,
            sceneId,
            member,
            maxNumber
        });
        return res.json({ status: true, room });
    } catch (ex) {
        console.log(ex);
        //next(ex);
    }
}