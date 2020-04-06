console.log("added!");

let socket = io();
let uid;
let connectedPlayers = new Map();
let vector = ["up", "down", "left", "right"];
let currentPlayer;
let  boxSize = 10;
let height=700;
let width=700;




socket.on('players', function (players) {

    let transitString = JSON.stringify(Array.from(players));
    connectedPlayers = new Map(JSON.parse(transitString));
    console.log(connectedPlayers);
    currentPlayer = connectedPlayers.get(uid);

});


socket.on('connect', function () {
    uid = socket.id;
    console.log("connected! uid:", uid);
});


let sketch = function (p) {

    p.setup = function () {
        p.createCanvas(width, height);
        p.background(150);
    };

    // draw all client
    p.draw = function () {
        p.background(150);

        connectedPlayers.forEach(player => {
            // p.rect(boxSize,boxSize,player.x,player.y);

            let color;
            if (player.uid === uid) {
                color = p.color(10, 300, 200);
                console.log("current");
            } else {
                color = p.color(30, 30, 30);
                console.log("other");
            }

            p.fill(color);
            p.rect(player.x, player.y, boxSize, boxSize);

        });

    };

    p.keyPressed = function () {
        if (p.keyCode === p.UP_ARROW) {
            console.log("up arrow");
            // socket.emit('msg', {v:vector[0], "uid": uid,x:currentPlayer.x,y:connectedPlayers.y});
            currentPlayer.v = vector[0];
            socket.emit('clientInput', currentPlayer);
        }

        if (p.keyCode === p.DOWN_ARROW) {
            console.log("down arrow");
            // socket.emit('msg', {v: vector[1], "uid": uid,x:currentPlayer.x,y:connectedPlayers.y});
            currentPlayer.v = vector[1];
            socket.emit('clientInput', currentPlayer);
        }

        if (p.keyCode === p.LEFT_ARROW) {
            console.log("left arrow");
            // socket.emit('msg', {v: vector[2], "uid": uid,x:currentPlayer.x,y:connectedPlayers.y});
            currentPlayer.v = vector[2];
            socket.emit('clientInput', currentPlayer);
        }

        if (p.keyCode === p.RIGHT_ARROW) {
            console.log("right arrow");
            // socket.emit('msg', {v: vector[3], "uid": uid,x:currentPlayer.x,y:connectedPlayers.y});
            currentPlayer.v = vector[3];
            socket.emit('clientInput', currentPlayer);
        }
    }

};

let score = function (p) {
    let textSize=20;
    p.setup = function () {
        p.createCanvas(400, p.windowHeight);
        p.background(255);
    };

    p.draw = function () {
        p.background(255);
        p.textSize(textSize);
        p.text("Total players: ", 10, 0);
        let pos=textSize;
        connectedPlayers.forEach(player=>{


            let color;
            if (player.uid === uid) {
                color = p.color(10, 300, 200);
                console.log("current");
            } else {
                color = p.color(30, 30, 30);
                console.log("other");
            }
            p.fill(color);
            p.text(pos/textSize+". "+player.uid, 10, pos);
            pos=textSize+pos;
        });
    }


};

new p5(score, window.document.getElementById('score'));
new p5(sketch, window.document.getElementById('container'));
