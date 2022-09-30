// const express = require('express');
// const app = express();
const app = require('express')();
const cors = require('cors');
const mongoose = require("mongoose")
const userRoutes = require("./Routes/userRoutes");
const roomRoutes = require("./Routes/roomRoutes");
const { v4: uuidv4, v4 } = require('uuid');
const http = require('http').Server(app);
const Room = require('./models/roomModels');

require('dotenv').config();
app.use(cors(
    {
        origin: "*",
    }
));
// app.use(express.json());

// Controls
const { createRoom } = require('./controller/roomController');

const port = 3001

// app.use("/api/auth", userRoutes)
//app.use("/api/room", roomRoutes)
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("DB connection successful!")).catch((err) => console.log(err))
// const server = app.listen(process.env.PORT, () => {
//     console.log(`Server is running on port: ${process.env.PORT}`);
// });

const io = require('socket.io')(http, {
    cors: {
        origin: "*",
    }
});



roomObjSchema = {
    roomId: 1234,
    roomName: "Room 1",
    maxMembers: 10,
    members: [],
    sceneId: 1,
}

userObjSchema = {
    userId: 1234,
    userName: "User 1",
    roomId: 1234,
    avatarId: 1,
    position: {
        x: 0,
        y: 0,
        z: 0
    },
    rotation: {
        x: 0,
        y: 0,
        z: 0
    }
}

sessions = {
}


io.on('connection', function (socket) {
    console.log(io.engine.clientsCount)
    console.log("User Connected: " + socket.id)
    socket.on('createRoom', function (roomParam) {
        //console.log(roomParam)
        let userObj = {
            userId: roomParam.userId,
            userName: roomParam.userName,
            socketId: socket.id,
            avatarId: roomParam.avatarId
        }
        let roomObj = {
            roomId: uuidv4(),
            roomName: roomParam.roomName,
            maxMembers: roomParam.maxMembers,
            members: [userObj],
            sceneId: roomParam.sceneId,
        }
        //console.log(roomObj)
        try {
            const room = Room.create(roomObj)
        } catch (ex) {
            console.log(ex);
            //next(ex);
        }
        //createRoom(roomObj);
        socket.join(roomObj.roomId);
        sessions[roomObj.roomId] = roomObj;
        sessions[roomObj.roomId].members[0].location = {
            x: 0,
            y: 0,
            z: 0
        }
        sessions[roomObj.roomId].members[0].rotation = {
            x: 0,
            y: 0,
            z: 0
        }
        console.log(sessions)
    })

    socket.on('joinRoom', function (userParams) {
        console.log(userParams)
        Room.findOne({ roomId: userParams.roomId }, function (err, room) {
            if (err) {
                console.log(err);
                socket.emit('joinRoomRes', { status: "error", message: "Room not found" })
            }
            else {
                if (room) {
                    console.log(room);
                    let userObj = {
                        userId: userParams.userId,
                        userName: userParams.userName,
                        socketId: socket.id,
                        avatarId: userParams.avatarId
                    }
                    room.members.push(userObj);
                    room.save();
                    socket.join(room.roomId);
                    userObj.location = {
                        x: 0,
                        y: 0,
                        z: 0
                    }
                    userObj.rotation = {
                        x: 0,
                        y: 0,
                        z: 0
                    }
                    sessions[room.roomId].members.push(userObj);
                    socket.emit('joinRoomRes', { status: "success", message: "Room joined successfully", room: room })
                }
                else {
                    console.log("Room not found");
                    socket.emit('joinRoomRes', { status: "Not Found", message: "Room not found" })
                }
            }
        })
        // let userObj = {
        //     userId: roomParam.userId,
        //     userName: roomParam.userName,
        //     socketId: socket.id,
        //     avatarId: roomParam.avatarId
        // }
    })

    socket.on('update', function (updateParams) {
        console.log(updateParams)
        let room = sessions[updateParams.roomId];
        sessions[updateParams.roomId].members.find((member) => member.socketId == socket.id).location = updateParams.location;
        sessions[updateParams.roomId].members.find((member) => member.socketId == socket.id).rotation = updateParams.rotation;
        socket.to(updateParams.roomId).emit('updateData', updateParams);
    })

    socket.on('disconnect', function () {
        console.log("User Disconnected: " + socket.id)
        for (let room in sessions) {
            let index = sessions[room].members.findIndex((member) => member.socketId == socket.id);
            if (index != -1) {
                sessions[room].members.splice(index, 1);
                socket.to(room).emit('userLeft', { userId: sessions[room].members[index].userId });
                if (sessions[room].members.length == 0) {
                    delete sessions[room];
                }
            }
        }
    })
})



http.listen(port, function () {
    console.log('Server is running on port 3001');
})

// app.get('/', function (req, res) {
//     res.send('<h1>Hello world</h1>');
// })

// io.on('connection', function (socket) {
//     console.log('a user connected');
//     socket.on('createRoom', function (roomObj) {

//     })
//     socket.on('joinRoom', function (room) {
//         socket.join(room);
//         let user = {
//             id: socket.id,
//             key: ""
//         }
//         user.id = socket.id;
//         if (room in sessions) {
//             sessions[room]["users"][socket.id] = user;
//         }
//         else {
//             sessions[room] = {};
//             sessions[room]["users"] = {};
//             sessions[room]["users"][socket.id] = user;
//         }
//         console.log(sessions);
//     })
//     socket.on('update', function (data) {
//         socket.in(data.room).emit('newupdate', sessions[data.room]);
//         console.log(data);
//     })
//     socket.on('disconnect', function (data) {
//         for (let room in sessions) {
//             if (socket.id in sessions[room]["users"]) {
//                 delete sessions[room]["users"][socket.id];
//             }
//         }
//         console.log(sessions);
//     })
// })

// http.listen(3001, function () {
//     console.log('Server is running on port 3001');
// })
// /*
// const server = http.createServer((req, res) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     res.end('Hello World');
// });

// server.listen(port, hostname, () => {
//     console.log(`Server running at http://${hostname}:${port}/`);
// });*/







