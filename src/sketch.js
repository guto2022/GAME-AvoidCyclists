var path, path2, roadScale, roadWidth, mainCyclist;
var player1,player2,player3;
var pathImg,mainRacerImg1,mainRacerImg2;

var oppPink1Img,oppPink2Img;
var oppYellow1Img,oppYellow2Img;
var oppRed1Img,oppRed2Img;
var gameOverImg,cycleBell;

var pinkCG, yellowCG,redCG; 

var END =0;
var PLAY =1;
var gameState = PLAY;

var distance=0;
var gameOver, restart;

function preload(){
  pathImg = loadImage("assets/Road.png");
  mainRacerImg1 = loadAnimation("assets/mainPlayer1.png","assets/mainPlayer2.png");
  mainRacerImg2= loadAnimation("assets/mainPlayer3.png");
  
  oppPink1Img = loadAnimation("assets/opponent1.png","assets/opponent2.png");
  oppPink2Img = loadAnimation("assets/opponent3.png");
  
  oppYellow1Img = loadAnimation("assets/opponent4.png","assets/opponent5.png");
  oppYellow2Img = loadAnimation("assets/opponent6.png");
  
  oppRed1Img = loadAnimation("assets/opponent7.png","assets/opponent8.png");
  oppRed2Img = loadAnimation("assets/opponent9.png");
  
  cycleBell = loadSound("assets/bell.mp3");
  gameOverImg = loadImage("assets/gameOver.png");
}

function setup(){
  
  createCanvas(windowWidth, windowHeight);

  // Moving background
  roadScale = Math.max(width / pathImg.width, height / pathImg.height);
  roadWidth = pathImg.width * roadScale;

  path = createSprite(roadWidth / 2, height / 2);
  path.addImage(pathImg);
  path.scale = roadScale;

  path2 = createSprite(roadWidth + roadWidth / 2, height / 2);
  path2.addImage(pathImg);
  path2.scale = roadScale;

  path.velocityX = -5;
  path2.velocityX = -5;

  //creating boy running
  mainCyclist = createSprite(width * 0.1, height / 2);
  mainCyclist.addAnimation("SahilRunning",mainRacerImg1);
  mainCyclist.scale=0.07;
    
  //set collider for mainCyclist
  mainCyclist.setCollider("rectangle",0,0,40,40);
    
  gameOver = createSprite(width / 2, height / 2);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.8;
  gameOver.visible = false;  
    
  pinkCG = new Group();
  yellowCG = new Group();
  redCG = new Group();
}

function draw() {
  background(0);
  
  drawSprites();
  textSize(20);
  fill(255);
  textAlign(RIGHT, TOP);
  text("Distance: " + distance, width - 30, 30);
  
  if(gameState===PLAY){
    
    distance = distance + Math.round(getFrameRate()/50);
    path.velocityX = -(6 + 2 * distance / 150);
    path2.velocityX = path.velocityX;
    
    mainCyclist.y = World.mouseY;
    
    edges= createEdgeSprites();
    mainCyclist .collide(edges);
    
    //code to reset the background
    if (path.x + roadWidth / 2 < 0) {
      path.x = path2.x + roadWidth;
    }

    if (path2.x + roadWidth / 2 < 0) {
      path2.x = path.x + roadWidth;
    }
    
    //code to play cycle bell sound
    if(keyDown("space")) {
      cycleBell.play();
  }
  
  //creating continous opponent players
  var select_oppPlayer = Math.round(random(1,3));
  
  if (World.frameCount % 150 == 0) {
    if (select_oppPlayer == 1) {
      pinkCyclists();
    } else if (select_oppPlayer == 2) {
      yellowCyclists();
    } else {
      redCyclists();
    }
  }
  
   if(pinkCG.isTouching(mainCyclist)){
     gameState = END;
     player1.velocityY = 0;
     player1.addAnimation("opponentPlayer1",oppPink2Img);
    }
    
    if(yellowCG.isTouching(mainCyclist)){
      gameState = END;
      player2.velocityY = 0;
      player2.addAnimation("opponentPlayer2",oppYellow2Img);
    }
    
    if(redCG.isTouching(mainCyclist)){
      gameState = END;
      player3.velocityY = 0;
      player3.addAnimation("opponentPlayer3",oppRed2Img);
    }
    
  }else if (gameState === END) {
    gameOver.visible = true;
  
    textSize(20);
    fill(255);
    textAlign(CENTER, CENTER);
    text("Press Up Arrow to Restart the game!", width / 2, height * 0.68);
  
    path.velocityX = 0;
    path2.velocityX = 0;
    mainCyclist.velocityY = 0;
    mainCyclist.addAnimation("SahilRunning",mainRacerImg2);
  
    pinkCG.setVelocityXEach(0);
    pinkCG.setLifetimeEach(-1);
  
    yellowCG.setVelocityXEach(0);
    yellowCG.setLifetimeEach(-1);
  
    redCG.setVelocityXEach(0);
    redCG.setLifetimeEach(-1);

    if(keyDown("UP_ARROW")) {
      reset();
    }
  }
}

function pinkCyclists(){
  player1 = createSprite(width + 100, random(80, height - 80));
  player1.scale =0.06;
  player1.velocityX = -(6 + 2*distance/150);
  player1.addAnimation("opponentPlayer1",oppPink1Img);
  player1.setLifetime=170;
  pinkCG.add(player1);
}

function yellowCyclists(){
  player2 = createSprite(width + 100, random(80, height - 80));
  player2.scale =0.06;
  player2.velocityX = -(6 + 2*distance/150);
  player2.addAnimation("opponentPlayer2",oppYellow1Img);
  player2.setLifetime=170;
  yellowCG.add(player2);
}

function redCyclists(){
  player3 = createSprite(width + 100, random(80, height - 80));
  player3.scale =0.06;
  player3.velocityX = -(6 + 2*distance/150);
  player3.addAnimation("opponentPlayer3",oppRed1Img);
  player3.setLifetime=170;
  redCG.add(player3);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  mainCyclist.x = width * 0.1;
  gameOver.x = width / 2;
  gameOver.y = height / 2;

  path.scale = height / pathImg.height;
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  mainCyclist.addAnimation("SahilRunning",mainRacerImg1);
  
  pinkCG.destroyEach();
  yellowCG.destroyEach();
  redCG.destroyEach();
  
  distance = 0;
}