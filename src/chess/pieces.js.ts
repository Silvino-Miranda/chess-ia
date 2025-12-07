const TEAM = {
  WHITE: 'white',
  BLACK: 'black'
};

// Helper function to create vectors before p5.js is fully loaded
function makeVector(x: number, y: number) {
  return { x, y, dist: function(other: any) { return Math.sqrt((this.x - other.x)**2 + (this.y - other.y)**2); } };
}

class Piece {
  matrixPosition: any;
  pixelPosition: any;
  firstMovement: boolean;
  taken: boolean;
  team: any;
  movingThisPiece: boolean;
  canJump: boolean;
  sprite: any;
  spriteSize: number;
  board: any;
  value: number;

  constructor(x: any, y: any, team: any, board: any) {
    this.matrixPosition = makeVector(x, y);
    this.pixelPosition = makeVector(x * tileSize + tileSize / 2, y * tileSize + tileSize / 2);

    this.firstMovement = true;
    this.taken = false;
    this.team = team;
    this.movingThisPiece = false;
    this.canJump = false;
    this.sprite = spriteMapper['white_pawn']; // default
    this.spriteSize = 0.85;
    this.board = board;
  }

  isMatrixPositionAt(x: any, y: any) {
    return this.matrixPosition.x == x && this.matrixPosition.y == y;
  }

  show() {
    if (!this.taken) {
      imageMode(CENTER);
      if (this.movingThisPiece) {
        image(this.sprite, mouseX, mouseY, tileSize, tileSize);
      } else {
        image(
          this.sprite,
          this.pixelPosition.x,
          this.pixelPosition.y,
          tileSize * this.spriteSize,
          tileSize * this.spriteSize
        );
      }
    }
  }

  move(x, y, board) {
    if (this.canMove(x, y, board) && !this.isMatrixPositionAt(x, y) && this.isNotSuicideMove(x, y, board)) {
      if (board.isPieceAt(x, y)) {
        let piece = board.getPieceAt(x, y);
        if (this.isEnemy(piece)) {
          piece.die();
          deathSound.setVolume(0.4);
          // deathSound.play();
        } else {
          return;
        }
      }
      this.matrixPosition = makeVector(x, y);
      this.pixelPosition = makeVector(x * tileSize + tileSize / 2, y * tileSize + tileSize / 2);
      this.firstMovement = false;
      // moveSound.play();
      board.pass();
    }
  }

  die() {
    this.taken = true;
    this.matrixPosition = makeVector(-1, -1);
    this.pixelPosition = makeVector(-100, -100);
  }

  isInsideMatrix(x: any, y: any) {
    return x < 8 && x >= 0 && y < 8 && y >= 0;
  }

  canMove(x: any, y: any, board: any) {
    if (this.isInsideMatrix(x, y)) {
      if (!this.moveThroughPieces(x, y, board)) {
        if (board.isPieceAt(x, y) == this.isEnemy(board.getPieceAt(x, y))) {
          return true;
        }
      }
    }
    return false;
  }

  isNotSuicideMove(x, y, board) {
    let attackedPiece = board.getPieceAt(x, y);
    if (attackedPiece != null) {
      attackedPiece.taken = true;
    } else {
      attackedPiece = {};
    }

    let piecePosition = this.matrixPosition;
    this.matrixPosition = makeVector(x, y);

    let result = !this.kingInCheck(board);

    this.matrixPosition = piecePosition;
    attackedPiece.taken = false;

    return result;
  }

  kingInCheck(board) {
    let king = board.getKing(this.team);
    return king.kingInCheck(board);
  }

  moveThroughPieces(x, y, board) {
    if (this.canJump) return false;

    let stepDirectionX = x - this.matrixPosition.x;
    let stepDirectionY = y - this.matrixPosition.y;

    if (stepDirectionX > 0) {
      stepDirectionX = 1;
    } else if (stepDirectionX < 0) {
      stepDirectionX = -1;
    }

    if (stepDirectionY > 0) {
      stepDirectionY = 1;
    } else if (stepDirectionY < 0) {
      stepDirectionY = -1;
    }

    let tempPos = makeVector(this.matrixPosition.x, this.matrixPosition.y);
    tempPos.x += stepDirectionX;
    tempPos.y += stepDirectionY;
    while (!(tempPos.x == x && tempPos.y == y) && this.isInsideMatrix(tempPos.x, tempPos.y)) {
      if (board.getPieceAt(tempPos.x, tempPos.y) != null) {
        return true;
      }
      tempPos.x += stepDirectionX;
      tempPos.y += stepDirectionY;
    }

    return false;
  }

  straightMovement(x, y) {
    let directionX = Math.abs(x - this.matrixPosition.x);
    let directionY = Math.abs(y - this.matrixPosition.y);
    if ((directionY > directionX && directionX === 0) || (directionX > directionY && directionY === 0)) {
      return true;
    } else {
      return false;
    }
  }

  diagonalMovement(x, y) {
    let directionX = Math.abs(x - this.matrixPosition.x);
    let directionY = Math.abs(y - this.matrixPosition.y);
    if (directionX === directionY) {
      return true;
    } else {
      return false;
    }
  }

  isEnemy(piece) {
    if (piece != null) {
      return piece.team != this.team;
    }
    return false;
  }

  generateMoves(board) {
    let moves = [];
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        var x = i;
        var y = j;
        if (!this.isMatrixPositionAt(x, y)) {
          if (this.canMove(x, y, board) && this.isNotSuicideMove(x, y, board)) {
            moves.push(makeVector(x, y));
          }
        }
      }
    }
    return moves;
  }

  clone() {
    let clone = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    clone.firstMovement = this.firstMovement;
    clone.matrixPosition = this.matrixPosition;
    clone.team = this.team;
    clone.canJump = this.canJump;
    clone.taken = this.taken;
    clone.value = this.value;
    return clone;
  }
}

class King extends Piece {
  isInCheck: boolean;
  value: number;
  didCastling: boolean;

  constructor(x: any, y: any, team: any, board: any) {
    super(x, y, team, board);
    this.isInCheck = false;
    this.value = 800;
    this.didCastling = false;
    switch (team) {
      case TEAM.WHITE:
        this.sprite = spriteMapper['white_king'];
        break;
      case TEAM.BLACK:
        this.sprite = spriteMapper['black_king'];
        break;
      default:
        break;
    }
  }

  show() {
    if (this.isInCheck) {
      fill('#ff0000');
      circle(this.pixelPosition.x, this.pixelPosition.y, tileSize * 0.9);
    }
    super.show();
  }

  move(x, y, board) {
    if (this.canMove(x, y, board)) {
      super.move(x, y, board);
    } else if (
      this.firstMovement &&
      Math.abs(x - this.matrixPosition.x) === 2 &&
      this.matrixPosition.y === y &&
      !this.moveThroughPieces(x, y, board)
    ) {
      let rookPosition;
      let newRookPosition;
      switch (x) {
        case 2:
          rookPosition = makeVector(0, y);
          newRookPosition = makeVector(3, y);
          break;
        case 6:
          rookPosition = makeVector(7, y);
          newRookPosition = makeVector(5, y);
          break;
      }
      let rook = board.getPieceAt(rookPosition.x, rookPosition.y);
      if (rook != null) {
        if (board.canDoCastling(this, rook, newRookPosition)) {
          rook.move(newRookPosition.x, newRookPosition.y, board);
          this.matrixPosition = makeVector(x, y);
          this.pixelPosition = makeVector(x * tileSize + tileSize / 2, y * tileSize + tileSize / 2);
          this.firstMovement = false;
          this.didCastling = true;
          // moveSound.play();
        }
      }
    }
  }

  canMove(x, y, board) {
    let oneTileMove = this.matrixPosition.dist(makeVector(x, y)) < 2;
    if (oneTileMove) {
      if (this.isKingSafeDistance(x, y, board)) {
        return super.canMove(x, y, board);
      }
    }
    return false;
  }

  kingInCheck(board) {
    let result = false;
    board.pieces[board.getEnemyTeam(this.team)].forEach((piece) => {
      if (!piece.taken && piece.canMove(this.matrixPosition.x, this.matrixPosition.y, board)) {
        result = true;
        return;
      }
    });
    return result;
  }

  isKingSafeDistance(x, y, board) {
    let enemyKingMatrixPosition = board.getKing(board.getEnemyTeam(this.team)).matrixPosition;
    return enemyKingMatrixPosition.dist(makeVector(x, y)) >= 2;
  }
}

class Queen extends Piece {
  constructor(x: any, y: any, team: any, board: any) {
    super(x, y, team, board);
    this.value = 9;
    switch (team) {
      case TEAM.WHITE:
        this.sprite = spriteMapper['white_queen'];
        break;
      case TEAM.BLACK:
        this.sprite = spriteMapper['black_queen'];
        break;
      default:
        break;
    }
  }

  canMove(x, y, board) {
    if (this.straightMovement(x, y) || this.diagonalMovement(x, y)) {
      return super.canMove(x, y, board);
    } else {
      return false;
    }
  }

  showPath(can, x, y) {
    let tileSize = screenSize / 8;
    if (can) {
      fill(255, 0, 0, 80);
    } else {
      fill(0, 255, 0, 80);
    }
    rect(x * tileSize, y * tileSize, tileSize, tileSize);
  }
}

class Rook extends Piece {
  constructor(x: any, y: any, team: any, board: any) {
    super(x, y, team, board);
    this.value = 5;
    switch (team) {
      case TEAM.WHITE:
        this.sprite = spriteMapper['white_rook'];
        break;
      case TEAM.BLACK:
        this.sprite = spriteMapper['black_rook'];
        break;
      default:
        break;
    }
  }
  canMove(x, y, board) {
    if (this.straightMovement(x, y)) {
      return super.canMove(x, y, board);
    } else {
      return false;
    }
  }
}

class Bishop extends Piece {
  constructor(x: any, y: any, team: any, board: any) {
    super(x, y, team, board);
    this.value = 3;
    switch (team) {
      case TEAM.WHITE:
        this.sprite = spriteMapper['white_bishop'];
        break;
      case TEAM.BLACK:
        this.sprite = spriteMapper['black_bishop'];
        break;
      default:
        break;
    }
  }

  canMove(x, y, board) {
    if (this.diagonalMovement(x, y)) {
      return super.canMove(x, y, board);
    } else {
      return false;
    }
  }
}

class Knight extends Piece {
  constructor(x: any, y: any, team: any, board: any) {
    super(x, y, team, board);
    this.value = 3;
    this.canJump = true;
    switch (team) {
      case TEAM.WHITE:
        this.sprite = spriteMapper['white_knight'];
        break;
      case TEAM.BLACK:
        this.sprite = spriteMapper['black_knight'];
        break;
      default:
        break;
    }
  }
  canMove(x, y, board) {
    if (
      (abs(x - this.matrixPosition.x) == 2 && abs(y - this.matrixPosition.y) == 1) ||
      (abs(x - this.matrixPosition.x) == 1 && abs(y - this.matrixPosition.y) == 2)
    ) {
      return super.canMove(x, y, board);
    }
    return false;
  }
}

class Pawn extends Piece {
  value: number;
  enPassant: boolean;
  countMovements: number;

  constructor(x: any, y: any, team: any, board: any) {
    super(x, y, team, board);
    this.value = 1;

    this.enPassant = false;
    this.countMovements = 0;
    this.spriteSize = 0.7;
    switch (team) {
      case TEAM.WHITE:
        this.sprite = spriteMapper['white_pawn'];
        break;
      case TEAM.BLACK:
        this.sprite = spriteMapper['black_pawn'];
        break;
      default:
        break;
    }
  }

  move(x, y, board) {
    if (this.canMove(x, y, board) && !this.isMatrixPositionAt(x, y) && this.isNotSuicideMove(x, y, board)) {
      if (board.isPieceAt(x, y)) {
        let piece = board.getPieceAt(x, y);
        if (piece.team !== this.team) {
          piece.die();
          deathSound.setVolume(0.4);
          // deathSound.play()
        } else {
          return;
        }
      }

      if (this.canEnPassant(x, y, board)) {
        let pawnDirection = this.pawnDirection();
        let enPassantPiece = board.getPieceAt(x, y - pawnDirection);
        enPassantPiece.die();
      }

      let tilesWaked = Math.abs(this.matrixPosition.y - y);
      this.countMovements += tilesWaked;

      if (tilesWaked == 2) {
        this.enPassant = true;
      }

      this.matrixPosition = makeVector(x, y);
      this.pixelPosition = makeVector(x * tileSize + tileSize / 2, y * tileSize + tileSize / 2);
      this.firstMovement = false;
      // moveSound.play();
      if (this.countMovements >= 6) {
        board.promotion(this, Queen);
      }
      board.pass();
    }
  }

  canMove(x, y, board) {
    let pawnDirection = this.pawnDirection();

    let attacking = board.isEnemyPieceAt(x, y, this);
    if (attacking) {
      if (this.diagonalMovement(x, y) && y - this.matrixPosition.y == pawnDirection) {
        return super.canMove(x, y, board);
      }
      return false;
    }

    if (this.canEnPassant(x, y, board)) {
      return super.canMove(x, y, board);
    }

    if (x === this.matrixPosition.x) {
      if (y - this.matrixPosition.y == pawnDirection) {
        return super.canMove(x, y, board);
      }
      if (this.firstMovement && y - this.matrixPosition.y == pawnDirection * 2) {
        return super.canMove(x, y, board);
      }
    }
    return false;
  }

  pawnDirection() {
    switch (this.team) {
      case TEAM.WHITE:
        return -1;
      case TEAM.BLACK:
        return 1;
      default:
        return 0;
    }
  }

  canEnPassant(x: any, y: any, board: any) {
    let pawnDirection = this.pawnDirection();

    if (!board.isEnemyPieceAt(x, y - pawnDirection, this)) return false;

    let enPassantPiece = board.getPieceAt(x, y - pawnDirection);
    let movement = y - this.matrixPosition.y;

    return movement == pawnDirection && enPassantPiece instanceof Pawn && enPassantPiece.enPassant;
  }

  clone() {
    let clone = super.clone();
    clone.enPassant = this.enPassant;
    clone.countMovements = this.countMovements;
    return clone;
  }
}

