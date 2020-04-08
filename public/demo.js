let camHeight = 700;
let camWidth = 700;

let camX = 0;
let camY = 0;

let boxX = 100;
let boxY = 100;

let worldHeight=500;
let worldWidth=500;


function setup() {
    createCanvas(camWidth, camHeight);
}

function draw() {
    background(200);
    userInput();
    stroke(0);

    //world
    noFill();
    // negative cam x y cz world x y is 0,0
    rect(-camX,-camY,worldWidth,worldHeight);


    // box
    fill(255);

    let translatedXY = translation(boxX, boxY);
    moveCamToCenter(translatedXY.x+(boxX/2),translatedXY.y+(boxY/2));
    rect(translatedXY.x, translatedXY.y, 100, 100);


}


function moveCamToCenter(x, y) {
    camX=camX+(-1*((camWidth/2)-x));
    camY=camY+(-1*((camHeight/2)-y));
}

function translation(x, y) {
    return {
        x: x - camX,
        y: y - camY
    }
}


function userInput() {
    if (keyIsDown(UP_ARROW)) {
        console.log("up");
        camY--;

    }
    if (keyIsDown(DOWN_ARROW)) {
        console.log("down");
        camY++;

    }
    if (keyIsDown(LEFT_ARROW)) {
        console.log("left");
        camX--;

    }
    if (keyIsDown(RIGHT_ARROW)) {
        console.log("right");
        camX++;
    }
    console.log("camX:", camX);
    console.log("camY:", camY);

}

