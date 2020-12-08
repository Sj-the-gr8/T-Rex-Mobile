var TRex, TrexA, TrexC, ground, groundI, underground, clI, sc, o1, o2, o3, o4, o5, o6, clG, oG, gs,ko,restart,avraptor,avraptor1,rG,go,r,bg,d,j,c;

function preload() {
  TrexA = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  TrexC = loadAnimation("trex_collided.png");
  groundI = loadImage("ground2.png");
  clI = loadImage("cloud.png");
  o1 = loadImage("obstacle1.png");
  o2 = loadImage("obstacle2.png");
  o3 = loadImage("obstacle3.png");
  o4 = loadImage("obstacle4.png");
  o5 = loadImage("obstacle5.png");
  o6 = loadImage("obstacle6.png");
  ko=loadImage("gameOver.png");
  restart=loadImage("restart.png");
  avraptor=loadAnimation("Aviraptor_1.png","Aviraptor_2.png");
  avraptor1=loadAnimation("Aviraptor_2.png");
  j=loadSound("jump.mp3");
  d=loadSound("die.mp3");
  c=loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  sc = 0;
  gs = 0;
  clG = new Group();
  oG = new Group();
  rG=new Group();
  bg=createSprite(width/2,height/2,width,height);
  bg.visible=false;
  go=createSprite(width/2,height/2);
  go.addImage(ko);
  go.scale=0.5;
  go.visible=false;
  r=createSprite(width/2,height/2+30);
  r.addImage(restart);
  r.scale=0.5;
  r.visible=false;
  TRex = createSprite(25, height-30, 10, 10);
  TRex.addAnimation("runs", TrexA);
  TRex.addAnimation("dies", TrexC);
  TRex.scale = 0.5;
  ground = createSprite(width/2, height-10, width, 20);
  ground.addImage(groundI);
  underground = createSprite(width/2, height, width, 10);
  underground.visible = false;
}

function obstacles() {
  if (frameCount % 100 == 0) {
    var r = Math.round(random(1, 6));
    var obstacle = createSprite(width, Math.round(random(height-30, height-15)), 10, 10);
    obstacle.velocityX = -3;
    switch (r) {
      case 1:
        obstacle.addImage(o1);
        obstacle.scale = 0.6;
        break;
      case 2:
        obstacle.addImage(o2);
        obstacle.scale = 0.5;
        break;
      case 3:
        obstacle.addImage(o3);
        obstacle.scale = 0.45;
        break;
      case 4:
        obstacle.addImage(o4);
        obstacle.scale = 0.5;
        break;
      case 5:
        obstacle.addImage(o5);
        obstacle.scale = 0.46;
        break;
      case 6:
        obstacle.addImage(o6);
        obstacle.scale = 0.4;
        break;
    }
    oG.add(obstacle);
    obstacle.lifetime = width / 3 + 20;
  }
}

function clouds() {
  if (frameCount % 60 == 0) {
    var cl = createSprite(width, Math.round(random(10, height-30)));
    cl.velocityX = -3;
    cl.addImage(clI);
    cl.depth = TRex.depth;
    TRex.depth += 1;
    cl.lifetime = width / 3 + 30;
    clG.add(cl);
  }
}

function raptor() {
  if (frameCount % 200 == 0) {
    var cl = createSprite(width, Math.round(random(10, height-30)));
    cl.velocityX = -4;
    cl.addAnimation("flies",avraptor);
    cl.addAnimation("dies",avraptor1);
    cl.depth = TRex.depth;
    cl.scale=0.5;
    TRex.depth += 1;
    cl.lifetime = width / 3 + 30;
    rG.add(cl);
  }
}

function callBack(s1,s2)  {
  s2.changeAnimation("dies");
}
function draw() {
  //console.time("p1");
  background(0);
  if (gs == 0) {
    console.log("119");
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }
    if(TRex.overlap(rG,callBack))  {
      gs=1;
    }
    ground.velocityX = -3;
  if ((keyDown("space")||touches.length>0) && TRex.y > height-40) {
    console.log("128");  
    TRex.velocityY = -10;
      j.play();
    }
    if(sc%100==0&&sc>0)  {
      c.play();
    }
    clouds();
    obstacles();
    raptor();
    if(oG.isTouching(TRex))  {
      d.play();
      gs=1;
    }
    if(frameCount%6==0)  {
      sc+=1;
    }
  }
  else if (gs == 1) {
    ground.velocityX = 0;
    oG.setVelocityXEach(0);
    clG.setVelocityXEach(0);
    TRex.changeAnimation("dies");
    TRex.velocityY=0;
    go.visible=true;
    r.visible=true;
    bg.overlap(rG,callBack);
    if(mousePressedOver(r)||touches.length>0)  {
      go.visible=false;
      r.visible=false;
      TRex.changeAnimation("runs");
      oG.destroyEach();
      clG.destroyEach();
      rG.destroyEach();
      sc=0;
      gs=0;
    }
    oG.setLifetimeEach(-1);
    clG.setLifetimeEach(-1);
    rG.setVelocityXEach(0);
    TRex.y=height-30;
    rG.setLifetimeEach(-1);
  }
  TRex.collide(underground);
  TRex.velocityY += 0.5;
  drawSprites();
  text("Score:" + sc, width-100, 20);
}