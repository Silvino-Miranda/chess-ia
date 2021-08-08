import p5 from 'p5';

let screenSize = window.innerHeight * 0.75;
let tileSize = screenSize / 8;

let board: {
  show: () => void;
  isPieceAt: (arg0: any, arg1: any) => any;
  getPieceAt: (arg0: any, arg1: any) => any;
  turn: any;
};
let moving = false;
let movingPiece: {
  team: any;
  movingThisPiece: boolean;
  move: (
    arg0: any,
    arg1: any,
    arg2: {
      show: () => void;
      isPieceAt: (arg0: any, arg1: any) => any;
      getPieceAt: (arg0: any, arg1: any) => any;
      turn: any;
    }
  ) => void;
};
let sprite;
let spriteMapper;
let deathSound;
let moveSound;
let checkSound;

function resizeBoard(resizeValue: number) {
  screenSize *= resizeValue;
  tileSize = (screenSize - 50) / 8;
}

function loadAllFiles() {
  checkSound = p5.loadSound('./assets/sounds/check.mp3');
  moveSound = p5.loadSound('./assets/sounds/move-sound.wav');
  deathSound = p5.loadSound('./assets/sounds/death-sound.mp3');
  spriteMapper = {
    black_king: p5.loadImage('./assets/pieces/' + 'b_king_svg_NoShadow.png'),
    black_bishop: p5.loadImage('./assets/pieces/' + 'b_bishop_svg_NoShadow.png'),
    black_knight: p5.loadImage('./assets/pieces/' + 'b_knight_svg_NoShadow.png'),
    black_pawn: p5.loadImage('./assets/pieces/' + 'b_pawn_svg_NoShadow.png'),
    black_rook: p5.loadImage('./assets/pieces/' + 'b_rook_svg_NoShadow.png'),
    black_queen: p5.loadImage('./assets/pieces/' + 'b_queen_svg_NoShadow.png'),

    white_king: p5.loadImage('./assets/pieces/' + 'w_king_svg_NoShadow.png'),
    white_bishop: p5.loadImage('./assets/pieces/' + 'w_bishop_svg_NoShadow.png'),
    white_knight: p5.loadImage('./assets/pieces/' + 'w_knight_svg_NoShadow.png'),
    white_pawn: p5.loadImage('./assets/pieces/' + 'w_pawn_svg_NoShadow.png'),
    white_rook: p5.loadImage('./assets/pieces/' + 'w_rook_svg_NoShadow.png'),
    white_queen: p5.loadImage('./assets/pieces/' + 'w_queen_svg_NoShadow.png')
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
  var x = p5.floor(mouseX / tileSize);
  var y = p5.floor(mouseY / tileSize);
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
