// Função auxiliar para criar vetores simples
function makeVector(x: number, y: number) {
  return { x, y };
}

let screenSize = window.innerHeight * 0.75;
let tileSize = screenSize / 8;

let board: any;
let moving = false;
let movingPiece: any;
let sprite: any;
let spriteMapper: any;
let deathSound: any;
let moveSound: any;
let checkSound: any;

function resizeBoard(resizeValue: any) {
  screenSize *= resizeValue;
  tileSize = (screenSize - 50) / 8;
}

function loadAllFiles() {
  checkSound = loadSound('./assets/sounds/check.mp3');
  moveSound = loadSound('./assets/sounds/move-sound.wav');
  deathSound = loadSound('./assets/sounds/death-sound.mp3');
  spriteMapper = {
    black_king: loadImage('./assets/pieces/' + 'b_king_svg_NoShadow.png'),
    black_bishop: loadImage('./assets/pieces/' + 'b_bishop_svg_NoShadow.png'),
    black_knight: loadImage('./assets/pieces/' + 'b_knight_svg_NoShadow.png'),
    black_pawn: loadImage('./assets/pieces/' + 'b_pawn_svg_NoShadow.png'),
    black_rook: loadImage('./assets/pieces/' + 'b_rook_svg_NoShadow.png'),
    black_queen: loadImage('./assets/pieces/' + 'b_queen_svg_NoShadow.png'),

    white_king: loadImage('./assets/pieces/' + 'w_king_svg_NoShadow.png'),
    white_bishop: loadImage('./assets/pieces/' + 'w_bishop_svg_NoShadow.png'),
    white_knight: loadImage('./assets/pieces/' + 'w_knight_svg_NoShadow.png'),
    white_pawn: loadImage('./assets/pieces/' + 'w_pawn_svg_NoShadow.png'),
    white_rook: loadImage('./assets/pieces/' + 'w_rook_svg_NoShadow.png'),
    white_queen: loadImage('./assets/pieces/' + 'w_queen_svg_NoShadow.png')
  };
}

function setup() {
  let canvas = createCanvas(screenSize, screenSize);
  canvas.parent('chess-board');
  canvas.class('game');
  loadAllFiles();
  board = new Board();
}

function draw() {
  background(100);
  showGrid();
  board.show();
}

function showGrid() {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if ((i + j) % 2 === 0) {
        fill('#F0D9B2');
      } else {
        fill('#B58860');
      }
      rect(i * tileSize, j * tileSize, tileSize, tileSize);
    }
  }
}

function restartGame() {
  board = new Board();
}

function mousePressed() {
  var x = floor(mouseX / tileSize);
  var y = floor(mouseY / tileSize);
  if (!moving) {
    if (board.isPieceAt(x, y)) {
      movingPiece = board.getPieceAt(x, y);
      if (movingPiece.team === board.turn) {
        movingPiece.movingThisPiece = true;
        moving = true;
      } else {
        movingPiece = null;
      }
    }
  } else {
    if (movingPiece != null) {
      movingPiece.move(x, y, board);
      movingPiece.movingThisPiece = false;
      movingPiece = null;
    }
    moving = !moving;
  }
}
