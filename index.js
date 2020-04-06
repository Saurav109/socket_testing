const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);


//game elements
let connectedPlayers = new Map();
let vector = ["up", "down", "left", "right"];
let boxSize = 10;
let updateFrequency = 1000;
let height=700;
let width=700;

//_______________________________________
app.use(express.static('public'));
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

///_______________________________________

io.on('connection', function (socket) {
    console.log('a user connected', socket.id);

    // adding new users
    let player = {
        uid: socket.id,
        x: Math.floor((Math.random() * 30) + 5) * 10,
        y: Math.floor((Math.random() * 30) + 5) * 10,
        v: vector[Math.floor((Math.random() * 3))]
    };

    connectedPlayers.set(socket.id, player);

    // getting input from client
    socket.on('clientInput', function (clientInput) {

        connectedPlayers.set(clientInput.uid, clientInput);
        console.log("client input ", clientInput);

    });




    socket.on('disconnect', function () {
        console.log('user disconnected', socket.id);
        connectedPlayers.delete(socket.id);

    });
});


// run every $updateFrequency
let fun=function () {
    connectedPlayers.forEach(player => {

        // set position for every client

        //up
        if (player.v === vector[0]) {

            if (player.y < height-boxSize && player.y > boxSize) {

                player.y = player.y - boxSize;
            }
        }

        //down
        if (player.v === vector[1]) {
            if (player.y < height-boxSize && player.y > boxSize) {

                player.y = player.y + boxSize;
            }
        }

        //left
        if (player.v === vector[2]) {
            if (player.x < width-boxSize && player.x > boxSize) {

                player.x = player.x - boxSize;
            }
        }

        //right
        if (player.v === vector[3]) {
            if (player.x < width-boxSize && player.x > boxSize) {

                player.x = player.x + boxSize;
            }
        }


    });

    // send all client current game board update
    io.emit("players", Array.from(connectedPlayers));

    console.log("emiting");

};

setInterval(function () {
    fun();
},updateFrequency);

///_______________________________________

http.listen(3000, function () {
    console.log('listening on *:3000');
});


