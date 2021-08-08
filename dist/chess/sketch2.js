"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var p5_1 = __importDefault(require("p5"));
var screenSize = window.innerHeight * 0.75;
var tileSize = screenSize / 8;
var board;
var moving = false;
var movingPiece;
var sprite;
var spriteMapper;
var deathSound;
var moveSound;
var checkSound;
function resizeBoard(resizeValue) {
    screenSize *= resizeValue;
    tileSize = (screenSize - 50) / 8;
}
function loadAllFiles() {
    checkSound = p5_1.default.loadSound('./assets/sounds/check.mp3');
    moveSound = p5_1.default.loadSound('./assets/sounds/move-sound.wav');
    deathSound = p5_1.default.loadSound('./assets/sounds/death-sound.mp3');
    spriteMapper = {
        black_king: p5_1.default.loadImage('./assets/pieces/' + 'b_king_svg_NoShadow.png'),
        black_bishop: p5_1.default.loadImage('./assets/pieces/' + 'b_bishop_svg_NoShadow.png'),
        black_knight: p5_1.default.loadImage('./assets/pieces/' + 'b_knight_svg_NoShadow.png'),
        black_pawn: p5_1.default.loadImage('./assets/pieces/' + 'b_pawn_svg_NoShadow.png'),
        black_rook: p5_1.default.loadImage('./assets/pieces/' + 'b_rook_svg_NoShadow.png'),
        black_queen: p5_1.default.loadImage('./assets/pieces/' + 'b_queen_svg_NoShadow.png'),
        white_king: p5_1.default.loadImage('./assets/pieces/' + 'w_king_svg_NoShadow.png'),
        white_bishop: p5_1.default.loadImage('./assets/pieces/' + 'w_bishop_svg_NoShadow.png'),
        white_knight: p5_1.default.loadImage('./assets/pieces/' + 'w_knight_svg_NoShadow.png'),
        white_pawn: p5_1.default.loadImage('./assets/pieces/' + 'w_pawn_svg_NoShadow.png'),
        white_rook: p5_1.default.loadImage('./assets/pieces/' + 'w_rook_svg_NoShadow.png'),
        white_queen: p5_1.default.loadImage('./assets/pieces/' + 'w_queen_svg_NoShadow.png')
    };
}
function setup() {
    var canvas = createCanvas(screenSize, screenSize);
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
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            if ((i + j) % 2 === 0) {
                fill('#F0D9B2');
            }
            else {
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
    var x = p5_1.default.floor(mouseX / tileSize);
    var y = p5_1.default.floor(mouseY / tileSize);
    if (!moving) {
        if (board.isPieceAt(x, y)) {
            movingPiece = board.getPieceAt(x, y);
            if (movingPiece.team === board.turn) {
                movingPiece.movingThisPiece = true;
                moving = true;
            }
            else {
                movingPiece = null;
            }
        }
    }
    else {
        if (movingPiece != null) {
            movingPiece.move(x, y, board);
            movingPiece.movingThisPiece = false;
            movingPiece = null;
        }
        moving = !moving;
    }
}
//# sourceMappingURL=sketch2.js.map