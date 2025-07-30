
// Game start or end
let gameState = false;

// Points
let points = 0;

// Background
let bgLayer;
bgLayerSpeed = 0.6;
bgLayerY1 = 0;
bgLayerY2 = -1000;

// Foreground
let fgLayer;
fgLayerSpeed = 0.9;
fgLayerY1 = 0;
fgLayerY2 = -1000;

// Paddle
let paddleX = 193;
let paddleY = 487;

// Ball
let ballX = 250;
let ballY = 35;
let ballSpeedX = 0;
let ballSpeedY = 0;
let r, g, b;
let rs, gs, bs;
let hitRate, hitPlace;

// Treasure
let treasureRightX = 505;
let treasureRightY;
let treasureLeftX = -5;
let treasureLeftY;
let angle = 0;

// Sounds
let bounce;
let collect;
let loss;

function preload() {
    bgLayer = loadImage('./images/background.png');
    fgLayer = loadImage('./images/foreground.png');
    treasure = loadImage('./images/treasure.png');
    bounce = loadSound("./sounds/boing.mp3");
    collect = loadSound("./sounds/collect.mp3");
    loss = loadSound("./sounds/loss.mp3");
}

function setup() {
    let cnv = createCanvas(500, 500);
    cnv.parent('canvas_container');

    background(0);
    angleMode(DEGREES);  
    imageMode(CENTER);

    treasure.resize(60, 60);
    treasureLeftY = random(100, 400);
    treasureRightY = random(100, 400);

    // Ball color
    r = random(255);
    g = random(255);
    b = random(255);

    // Ball color change speed
    rs = random(-2, 2);
    gs = random(-2, 2);
    bs = random(-2, 2);
}

function draw() {

    background(0);

    // Background parallax ------
    image(bgLayer, 250, bgLayerY1);
    image(bgLayer, 250, bgLayerY2);

    bgLayerY1 += bgLayerSpeed;
    bgLayerY2 += bgLayerSpeed;

    if (bgLayerY1 >= 1000) {
        bgLayerY1 = bgLayerY2 - 1000;
    }

    if (bgLayerY2 >= 1000) {
        bgLayerY2 = bgLayerY1 - 1000;
    }
    // Background parallax end ------


    // Foreground parallax ------
    image(fgLayer, 250, fgLayerY1);
    image(fgLayer, 250, fgLayerY2);

    fgLayerY1 += fgLayerSpeed;
    fgLayerY2 += fgLayerSpeed;

    if (fgLayerY1 >= 1000) {
        fgLayerY1 = fgLayerY2 - 1000;
    }

    if (fgLayerY2 >= 1000) {
        fgLayerY2 = fgLayerY1 - 1000;
    }
    // Foreground parallax end ------


    // Paddle
    fill(180);
    rect(paddleX, paddleY, 115, 13);


    // Treasure ------
    angle += 1;
    push(); // Left
    translate(treasureLeftX, treasureLeftY);
    rotate(angle);
    image(treasure, 0, 0);
    pop();

    push(); // Right
    translate(treasureRightX, treasureRightY);
    rotate(angle);
    image(treasure, 0, 0);
    pop();

    treasureLeftX += 4;
    treasureRightX -= 4;

    if (treasureLeftX > 505) {
        treasureLeftY = random(100, 400);
        treasureLeftX = -20;
    }

    if (treasureRightX < -5) {
        treasureRightY = random(100, 400);
        treasureRightX = 520;
    }
    // Treasure end ------


    // Border ------
    noStroke();
    fill(205,181,255);
    rect(0, 0, width, 10); // Up
    rect(0, 0, 10, width); // Left
    rect(width - 10, 0, 10, 500); // Right
    // Border end ------


    // Ball ------
    fill(r, g, b);
    r += rs;
    g += gs;
    b += bs;

    if (r > 255 || r < 100) {
        rs *= -1;
    }
      
    if (g > 255 || b < 100) {
        gs *= -1;
    }
      
    if (b > 255 || b < 100) {
        bs *= -1;
    }

    ellipse(ballX, ballY, 50, 50);
    // Ball end ------


    // Paddle movement ------
    if (keyIsDown(65) || keyIsDown(97)) {
        paddleX -= 3;
    }
    if (keyIsDown(68) || keyIsDown(100)) {
        paddleX += 3;
    }
    paddleX = constrain(paddleX, 10, width - 115);
    // Paddle movement end ------

    // Points text
    fill(205,181,255);
    textSize(20);
    text("Points: " + points, 40, 50);


    // Collision ball and treasure ------
    if (dist(ballX, ballY, treasureLeftX, treasureLeftY) < 25 + (treasure.width)/2) {
        collect.play();
        treasureLeftX = -5;
        treasureLeftY = random(100, 400);
        points += 1;
    }
    if (dist(ballX, ballY, treasureRightX, treasureRightY) < 25 + (treasure.width)/2) {
        collect.play();
        treasureRightX = -5;
        treasureRightY = random(100, 400);
        points += 1;
    }
    // Collision ball and treasure end ------


    if (gameState) {
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        if (ballX > width - 40 || ballX < 40) {
            bounce.play();
            ballSpeedX *= -1.05; // Reverse and increase speed
        }

        if (ballY < 35) {
            bounce.play();
            ballSpeedY *= -1.05; // Reverse and increase speed
        }

        // Ball bounce off paddle ------
        if (ballY + 25 >= paddleY && 
            ballY + 25 <= paddleY + 10 &&
            ballX - 10 >= paddleX &&
            (ballX + 10) <= paddleX + 115) {

                hitPlace = ballX - paddleX;
                hitRate = map(hitPlace, 0, 115, -1.8, 1.8);
                
                if (hitRate > -0.5 && hitRate < 0) {
                    hitRate = -0.8;
                }

                if (hitRate < 0.5 && hitRate > 0) {
                    hitRate = -0.8;
                }

                ballSpeedX *= (abs(hitRate) * 1.05);
                ballSpeedY *= -1.05;

                if (ballSpeedY <= -15){
                    ballSpeedX = -15;
                }

                if (ballSpeedY >= 15){
                    ballSpeedX = 15;
                }

                bounce.play();
        } // Ball bounce off paddle end ------

        // Game end condition
        if (ballY > height + 25) {
            loss.play();
            ballX = 250;
            ballY = 35;
            gameState = false;
        }
    } // ----- End of gameState condition
}


function mousePressed() {
    if (gameState == false) {
        ballSpeedX = random(2,7);
        ballSpeedY =  random(2, 7);
        points = 0;
        gameState = true;
    }
}
