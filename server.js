const app = require('express')();
const http = require('http').Server(app);
const cors = require('cors');

const io = require('socket.io')(http, {
    cors: {
        origin: "*",
    }
});

app.use(cors({
    origin: "*",
}));


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



app.get('/', function (req, res) {
    res.send('<h1>Hello world</h1>');
})

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('createRoom', function (roomObj) {

    })

    socket.on('joinRoom', function (data) {
        console.log(data);
        socket.join(data.room);
        let user = {
            userId: socket.id,
            userName: data.userName,
            roomId: data.room,
            avatarId: 1,
            loaded: false,
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
        room = data.room;
        if (room in sessions) {
            sessions[room]["users"][socket.id] = user;
        }
        else {
            sessions[room] = {};
            sessions[room]["users"] = {};
            sessions[room]["users"][socket.id] = user;
        }
        console.log(socket.id + " joined room " + data.room);
        io.to(socket.id).emit('joinedRoom', sessions[room]);
        console.log(sessions);
    })
    socket.on('update', function (data) {
        sessions[data.room]["users"][socket.id] = data.user;
        io.to(data.room).emit('newupdate', sessions[data.room]);
        //console.log(data);
    })
    socket.on('disconnect', function (data) {
        for (let room in sessions) {
            if (socket.id in sessions[room]["users"]) {
                delete sessions[room]["users"][socket.id];
            }
        }
        //console.log(sessions);
    })
    socket.on('join-room', (roomId, userId) => {
        console.log(userId + " joinedroom " + roomId)
        io.to(roomId).emit('user-connected', userId)
    })
})

http.listen(3005, function () {
    console.log('Server is running on port 443');
})
/*
const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World');
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});*/