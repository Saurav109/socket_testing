// server variables
let socket = io();
let currentPlayer;
let uid;
let players = new Map();

let camHeight;
let camWidth ;

let camX = 0;
let camY = 0;

let boxHeight = 100;
let boxWidth = 100;

let worldHeight = 10000;
let worldWidth = 10000;

let finderHeight=200;
let finderWidth=200;
let finderRatio;

let otherPlayerColor;
let currentPlayerColor;
let vector = ["up", "down", "left", "right"];

// connected with server
socket.on('connect', function () {
    uid = socket.id;
    console.log("connected! uid:", uid);
});


// get data from server
socket.on('data', function (data) {
    let transitString = JSON.stringify(Array.from(data));
    players = new Map(JSON.parse(transitString));
    currentPlayer = players.get(uid);
    console.log("players", players);
});

let img;
function preload() {
    img = loadImage('bk.jpg');
}

function setup() {
    camHeight=windowHeight-10;
    camWidth=windowWidth-10;
    createCanvas(camWidth, camHeight);
    background(150);
    otherPlayerColor = color(65);
    currentPlayerColor = color(255, 204, 0);

    finderRatio=worldWidth/finderWidth;
}

function draw() {
    background(150);
    userInput();
    noFill(0);
    rect(-camX, -camY, worldWidth, worldHeight);
    image(img, -camX, -camY,worldWidth,worldHeight);

    //
    stroke(0);
    rect(0,0,finderWidth,finderHeight);
    image(img, 0,0,finderWidth,finderHeight);

    players.forEach(player => {

        // draw player
        let translatedXY = translationCam(player.x, player.y);
        if (player.uid === uid) {
            fill(color('#00FF00'));

        } else {
            fill(color('#F47A9E'));
        }

        rect(translatedXY.x, translatedXY.y, boxWidth, boxHeight);
        text(uid, translatedXY.x + boxWidth + 10, translatedXY.y + 10);

        rect(player.x/finderRatio, player.y/finderRatio, 5, 5);

        if(player.uid===uid){
            moveCamToCenter(translatedXY.x + (boxWidth / 2), translatedXY.y + (boxWidth / 2));
        }
    })


}


function userInput() {
    if (keyIsDown(UP_ARROW)) {
        console.log("up");
        currentPlayer.v = vector[0];
        socket.emit('clientInput', currentPlayer);
    }
    if (keyIsDown(DOWN_ARROW)) {
        console.log("down");
        currentPlayer.v = vector[1];
        socket.emit('clientInput', currentPlayer);

    }
    if (keyIsDown(LEFT_ARROW)) {
        console.log("left");
        currentPlayer.v = vector[2];
        socket.emit('clientInput', currentPlayer);
    }
    if (keyIsDown(RIGHT_ARROW)) {
        console.log("right");
        currentPlayer.v = vector[3];
        socket.emit('clientInput', currentPlayer);
    }

}


function moveCamToCenter(x, y) {
    camX = camX + (-1 * ((camWidth / 2) - x));
    camY = camY + (-1 * ((camHeight / 2) - y));
}

function translationCam(x, y) {
    return {
        x: x - camX,
        y: y - camY
    }
}



// console.log("started!");
//
// let socket = io();
// let uid;
// let connectedPlayers = new Map();
// let vector = ["up", "down", "left", "right"];
// let currentPlayer;
// let boxSize = 100;
//
// let camHeight;
// let camWidth;
//
// let camX = 0;
// let camY = 0;
//
// //game variable
// const backgroundColor = 150;
// const scoreTextSize = 15;
// const playerTextSize = 10;
//
//
// // connected with server
// socket.on('connect', function () {
//     uid = socket.id;
//     console.log("connected! uid:", uid);
// });
//
//
// // get data from server
// socket.on('players', function (players) {
//     let transitString = JSON.stringify(Array.from(players));
//     connectedPlayers = new Map(JSON.parse(transitString));
//     currentPlayer = connectedPlayers.get(uid);
// });
//
//
// let sketch = function (p) {
//     // const currentPlayerColor = color(10, 300, 200);
//     // const otherPlayerColor = color(100, 300, 200);
//
//     p.setup = function () {
//         camHeight = p.windowHeight - 1;
//         camWidth = p.windowWidth - 1;
//         p.createCanvas(camWidth, camHeight);
//         p.background(backgroundColor);
//     };
//
//     // draw all client
//     p.draw = function () {
//         let textPos = scoreTextSize;
//         let color;
//         p.background(backgroundColor);
//
//         p.noFill();
//         p.rect(0,0,1000,1000);
//
//         //draw all players
//         connectedPlayers.forEach(player => {
//
//             // draw score_______________________________
//             p.textSize(scoreTextSize);
//
//             // if (player.uid === uid) {
//             //     color = currentPlayerColor;
//             // } else {
//             //     color = otherPlayerColor;
//             // }
//
//             p.text(player.uid, 10, textPos);
//             textPos = scoreTextSize + textPos;
//
//
//             // draw player______________________________
//
//             if (player.uid === uid) {
//                 color = p.color(10, 300, 200);
//             } else {
//                 color = p.color(30, 30, 30);
//             }
//
//             let translatedXY = translation(player.x, player.y);
//             moveCamToCenter(translatedXY.x+(camWidth/2),translatedXY.y+(camHeight/2));
//             rect(translatedXY.x, translatedXY.y, 100, 100);
//
//         });
//
//     };
//
//
//     function translation(x, y) {
//         return {
//             x: x - camX,
//             y: y - camY
//         }
//     }
//
//     function moveCamToCenter(x, y) {
//         camX=camX+(-1*((camWidth/2)-x));
//         camY=camY+(-1*((camHeight/2)-y));
//     }
//
//
//
//     // send key input to server
//     p.keyPressed = function () {
//         if (p.keyCode === p.UP_ARROW) {
//             console.log("up arrow");
//             currentPlayer.v = vector[0];
//             socket.emit('clientInput', currentPlayer);
//         }
//
//         if (p.keyCode === p.DOWN_ARROW) {
//             console.log("down arrow");
//             currentPlayer.v = vector[1];
//             socket.emit('clientInput', currentPlayer);
//         }
//
//         if (p.keyCode === p.LEFT_ARROW) {
//             console.log("left arrow");
//             currentPlayer.v = vector[2];
//             socket.emit('clientInput', currentPlayer);
//         }
//
//         if (p.keyCode === p.RIGHT_ARROW) {
//             console.log("right arrow");
//             currentPlayer.v = vector[3];
//             socket.emit('clientInput', currentPlayer);
//         }
//     }
// };
//
//
// new p5(sketch, window.document.getElementById('container'));
