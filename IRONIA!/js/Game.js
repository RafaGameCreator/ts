class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");
    this.leaderboardTitle = createElement("h2");
    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
    this.playerMoving = false;
    this.leftKeyActive = false;
    this.boomBoom = false
   }
  getState(){
    var gameStateRef = database.ref("gameState")
    gameStateRef.on("value", function(data){
      gameState = data.val();
    })
  }

  update(state){
    database.ref("/").update({
      gameState:state,
    })
  }
  
  start() {
    player = new Player();
    playerCount = player.getCount()
    form = new Form();
    form.display();
    car1 = createSprite(width / 2 - 50, height - 100)
    car1.addImage("car1", car1_img)
    car1.scale = 0.07
    car1.addImage("taylorSwift", taylorSwift)
    car2 = createSprite(width / 2 + 100, height - 100)
    car2.addImage("car2", car2_img)
    car2.scale = 0.07
    car2.addImage("taylorSwift", taylorSwift)
    cars = [car1, car2]
    fuels = new Group()
    coins = new Group()
    obstacles = new Group()
    var obstaclesPos = [
      {x: width / 2 + 250, y: height - 914, image:ConeImage},
      {x: width / 2 + 230, y: height - 5200, image:PneuImage},
      {x: width / 2 - 250, y: height - 935, image:ConeImage},
      {x: width / 2 - 230, y: height - 2110, image:PneuImage},
      {x: width / 2 + 184, y: height - 2000, image:ConeImage},
      {x: width / 2 - 200, y: height - 5440, image:PneuImage},
      {x: width / 2 + 230, y: height - 800, image:ConeImage},
      {x: width / 2 - 210, y: height - 926, image:PneuImage},
      {x: width / 2 + 210, y: height - 978, image:ConeImage},
      {x: width / 2, y: height - 3200, image:PneuImage},
      {x: width / 2, y: height / 2, image:ConeImage},
      {x: width / 2 - 194, y: height - 5321, image:PneuImage},
      {x: width / 2 + 243, y: height / 2, image:ConeImage},
      {x: width / 2 - 200, y: height - 190, image:PneuImage},
      {x: width / 2 + 224, y: height - 3422, image:ConeImage},
      {x: width / 2 - 192, y: height / 2, image:PneuImage},
      {x: width / 2 - 245, y: height - 4000, image:ConeImage},
      {x: width / 2 + 238, y: height - 5500, image:PneuImage},
       ];
       this.addSprites(fuels, 4, fuelImage, 0.03)
       this.addSprites(coins, 20, coinImage, 0.03)
       this.addSprites(obstacles, obstaclesPos.length, PneuImage, 0.04, obstaclesPos)
    }
    addSprites(spriteGroup, numberOfSprites, spriteImage, scale, positions = []){
      for(var i = 0; i < numberOfSprites; i++){
        var x,y;
        if(positions.length > 0){
          x = positions[i].x;
          y = positions[i].y;
        spriteImage = positions[i].image
        }
        else{
          x = random(width / 2 + 150, width / 2 - 150)
          y = random(-height * 4.5, height - 400)
        }
        var sprite = createSprite(x, y);
        sprite.addImage("sprite", spriteImage)
        sprite.scale = scale;
        spriteGroup.add(sprite);
      }
    }
    handleElements(){
      form.hide()
      form.titleImg.position(40,50)
      form.titleImg.class("gameTitleAfterEffect")  
      this.resetButton.class("resetButton")
      this.resetButton.position(width / 2 + 230, 100)
      this.leaderboardTitle.html("Placar do caramba seu zé bostola");
      this.leaderboardTitle.class("resetText");
      this.leaderboardTitle.position(width / 3 - 60, 40)
      this.leader1.class("leadersText");
      this.leader1.position(width / 3 - 60, 80)
      this.leader2.class("leadersText");
      this.leader2.position(width / 3 - 60, 130)
        }
    play(){
      this.handleElements()
      this.handleResetButton()
      Player.getPlayersInfo();
      player.getCarsAtEnd();
      if(allPlayers !== undefined){
        image(track, 0, - height * 5, width, height*6);
        this.showLeaderboard()
        this.showFuelBar()
        this.showLife()
        var index = 0;
        for(var plr in allPlayers){
          index = index + 1;
          var x = allPlayers[plr].positionX
          var y = height - allPlayers[plr].positionY 
          var currentLife = allPlayers[plr].life     
          cars[index - 1].position.x = x    
          cars[index - 1].position.y = y   
          if(index === player.index){
            stroke(12);
            fill("pink")
            ellipse(x, y, 60, 60)
            this.handleFuel(index);
            this.handleCoins(index);
            this.colisaumObs(index)
            this.colisaumPleier(index)
            if(player.life <= 0){
              this.boomBoom = true;
              this.playerMoving = false
              this.end()
            }
            //camera.position.x = cars[index - 1].position.x;
            camera.position.y = cars[index - 1].position.y;
          } 
        }
        this.handlePlayerControls();
        const finishLine = height * 6 - 100;
        if(player.positionY > finishLine){
          gameState = 2;
          player.rank += 1;
          Player.updateCarsAtEnd(player.rank);
          player.update();
          this.showRank();
        }
        drawSprites();
      }
    }
    handlePlayerControls(){
      if(!this.boomBoom){
      if(keyIsDown(UP_ARROW)){
        this.playerMoving = true;
        player.positionY += 10;
        player.update();
      }
      if(keyIsDown(DOWN_ARROW)){
        player.positionY -= 10;
        player.update();
      }
      if(keyIsDown(LEFT_ARROW)){
        this.leftKeyActive = true
        player.positionX -= 10;
        player.update();
      }
      if(keyIsDown(RIGHT_ARROW)){
        this.leftKeyActive = true
        player.positionX += 10;
        player.update();
      }
    }
  }
     handleResetButton(){
      this.resetButton.mousePressed(()=>{
        database.ref("/").set({
          carsAtEnd:0,
          playerCount : 0,
          gameState : 0,
          players: {},
          carsAtEnd:0,
                })
      window.location.reload();
              })
    }
    showLeaderboard(){
      var leader1, leader2;
      var players = Object.values(allPlayers)
      if((players[0].rank === 0 && players[1].rank === 0) || players[0].rank === 1){
        leader1 = players[0].rank + "&emsp;" + players[0].name + "&emsp;" + players[0].score
        leader2 = players[1].rank + "&emsp;" + players[1].name + "&emsp;" + players[1].score
      }
      if(players[1].rank === 1){
        leader1 = players[1].rank + "&emsp;" + players[1].name + "&emsp;" + players[1].score
        leader2 = players[0].rank + "&emsp;" + players[0].name + "&emsp;" + players[0].score
      
      }
      this.leader1.html(leader1)
      this.leader2.html(leader2)
    }
    handleFuel(index){
      cars[index - 1].overlap(fuels, function(collector, collected){
        player.fuel = 185;
        collected.remove();
      })
      if(player.fuel > 0 && this.playerMoving){
        player.fuel -= 0.6
      }
      if(player.fuel <=0){
        gameState = 2
        this.gameover();
      }
    }
    handleCoins(index){
      cars[index - 1].overlap(coins, function(collector, collected){
        player.score += 5;
        player.update()
        collected.remove();
      })
  }

  showRank(){
    swal({
      title: `Incrível, o idiota ficou em ${"\n"} ${player.rank}º lugar!`,
      text: "alguém alcançou a linha de chegada!",
      imageUrl: "http://www.traslamascara.com/wp-content/uploads/2016/09/Idiota.1.jpg",
      imageSize: "100x100",
      confirmButtonText: "OK"
    })
  }

  gameover(){
    swal({
      title: `Incrível, o idiota morreu`,
      text: "Morreu idiota",
      imageUrl: "http://www.traslamascara.com/wp-content/uploads/2016/09/Idiota.1.jpg",
      imageSize: "100x100",
      confirmButtonText: "Sou um lazarento mesmo"
    })
  }

  showLife(){
    push();
    image(lifeImg, width / 2 - 130, height - player.positionY - 280, 20, 20)
    fill("black");
    rect(width / 2 - 100, height - player.positionY - 280, 185, 20)
    fill("green");
    rect(width / 2 - 100, height - player.positionY - 280, player.life, 20)
    noStroke()
    pop()
  }
  showFuelBar(){
    push()
    image(fuelImage, width / 2 - 130, height - player.positionY - 250, 20, 20)
    fill("black");
    rect(width / 2 - 100, height - player.positionY - 250, 185, 20)
    fill("red");
    rect(width / 2 - 100, height - player.positionY - 250, player.fuel, 20)
    noStroke()
    pop()
  }

  colisaumObs(index){
    if(cars[index - 1].collide(obstacles)){
      if(this.leftKeyActive){
        player.positionX += 100
      }  
      else{
        player.positionX -= 100        
      }
      if(player.life > 0){
        player.life -= 185 / 2
      }
      player.update()
    }
  }

  colisaumPleier(index){
    if(index === 1){
      if(cars[index - 1].collide(cars[0])){
      if(this.leftKeyActive){
        player.positionX += 100
      }  
      else{
        player.positionX -= 100        
      }
      if(player.life > 0){
        player.life -= 185 / 2
      }
      player.update()
    }
  }
  if(index === 2){
    if(cars[index - 1].collide(cars[0])){
    if(this.leftKeyActive){
      player.positionX += 100
    }  
    else{
      player.positionX -= 100        
    }
    if(player.life > 0){
      player.life -= 185 / 2
    }
    player.update()
  }
}
}
end(){
  console.log("fim de jogo")
}
}