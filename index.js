const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

let PORT =process.env.PORT||3000;

//game elements
let connectedPlayers = new Map();
let vector = ["up", "down", "left", "right"];
let boxSize = 10;
let updateFrequency = 500;
let worldHeight=10000;
let worldWidth=10000;

//_______________________________________
app.use(express.static('public'));
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

///_______________________________________

io.on('connection', function (socket) {
    console.log('a user connected', socket.id);

    let player = {
        uid: socket.id,
        x: getRandomNumber(100,worldWidth-100),
        y: getRandomNumber(100,worldHeight-100),
        v: vector[Math.floor((Math.random() * 3))]
    };
    //add player
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

function getRandomNumber(bottom, top) {
    return Math.floor( Math.random() * ( 1 + top - bottom ) ) + bottom;
}

// run every $updateFrequency
let fun=function () {
    connectedPlayers.forEach(player => {

        // set position for every client
        //up
        if (player.v === vector[0]) {

            if (player.y < worldHeight && player.y > boxSize) {

                player.y = player.y - boxSize;
            }
        }

        //down
        if (player.v === vector[1]) {
            if (player.y < worldHeight && player.y > boxSize) {

                player.y = player.y + boxSize;
            }
        }

        //left
        if (player.v === vector[2]) {
            if (player.x < worldWidth && player.x > boxSize) {

                player.x = player.x - boxSize;
            }
        }

        //right
        if (player.v === vector[3]) {
            if (player.x < worldWidth && player.x > boxSize) {

                player.x = player.x + boxSize;
            }
        }


    });

    // send all client current game board update
    io.emit("data", Array.from(connectedPlayers));


};

setInterval(function () {
    fun();
},updateFrequency);

///_______________________________________

http.listen(PORT, function () {
    console.log('listening on *:'+PORT);
});


