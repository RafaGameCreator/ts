var canvas;
var backgroundImage;
var bgImg;
var database;
var form, player;
var playerCount;
var car1_img;
var car2_img;
var track;
var allPlayers, car1, car2, fuels, coins, obstacles;
var cars = []
var gameState;
var fuelImage, coinImage, ConeImage, PneuImage;
var lifeImg;
var taylorSwift;
var LojaSwift;

function preload() {
  backgroundImage = loadImage("./assets/planodefundo.png");
  car1_img = loadImage("./assets/car1.png");
  car2_img = loadImage("./assets/car2.png");
  track = loadImage("./assets/PISTA.png");
  fuelImage = loadImage("./assets/fuelvis.png");
  coinImage = loadImage("./assets/CoinMaster.png");
  ConeImage = loadImage("./assets/Conny.png");
  PneuImage = loadImage("./assets/SeBaterEmVcTeMata.png");
  lifeImg = loadImage("./assets/Heart.png");
  taylorSwift = loadImage("./assets/TS.png");
  LojaSwift = loadImage("./assets/Swift.png");
}
function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState()
  game.start();

}

function draw() {
  background(backgroundImage);
  if(playerCount === 2){
    game.update(1);
  }
  if(gameState === 1){
    game.play()
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
