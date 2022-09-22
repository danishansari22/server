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
    socket.on('joinRoom', function (room) {
        socket.join(room);
        let user = {
            id: socket.id,
            key: ""
        }
        user.id = socket.id;
        if (room in sessions) {
            sessions[room]["users"][socket.id] = user;
        }
        else {
            sessions[room] = {};
            sessions[room]["users"] = {};
            sessions[room]["users"][socket.id] = user;
        }
        console.log(sessions);
    })
    socket.on('update', function (data) {
        socket.in(data.room).emit('newupdate', sessions[data.room]);
        console.log(data);
    })
    socket.on('disconnect', function (data) {
        for (let room in sessions) {
            if (socket.id in sessions[room]["users"]) {
                delete sessions[room]["users"][socket.id];
            }
        }
        console.log(sessions);
    })
})

http.listen(3002, function () {
    console.log('Server is running on port 3002');
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