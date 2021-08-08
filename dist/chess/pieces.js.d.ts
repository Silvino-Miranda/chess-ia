declare const TEAM: {
    WHITE: string;
    BLACK: string;
};
declare class Piece {
    constructor(x: any, y: any, team: any, board: any);
    isMatrixPositionAt(x: any, y: any): boolean;
    show(): void;
    move(x: any, y: any, board: any): void;
    die(): void;
    isInsideMatrix(x: any, y: any): boolean;
    canMove(x: any, y: any, board: any): boolean;
    isNotSuicideMove(x: any, y: any, board: any): boolean;
    kingInCheck(board: any): any;
    moveThroughPieces(x: any, y: any, board: any): boolean;
    straightMovement(x: any, y: any): boolean;
    diagonalMovement(x: any, y: any): boolean;
    isEnemy(piece: any): boolean;
    generateMoves(board: any): any[];
    clone(): any;
}
declare class King extends Piece {
    constructor(x: any, y: any, team: any, board: any);
    show(): void;
    move(x: any, y: any, board: any): void;
    canMove(x: any, y: any, board: any): boolean;
    kingInCheck(board: any): boolean;
    isKingSafeDistance(x: any, y: any, board: any): boolean;
}
declare class Queen extends Piece {
    constructor(x: any, y: any, team: any, board: any);
    canMove(x: any, y: any, board: any): boolean;
    showPath(can: any, x: any, y: any): void;
}
declare class Rook extends Piece {
    constructor(x: any, y: any, team: any, board: any);
    canMove(x: any, y: any, board: any): boolean;
}
declare class Bishop extends Piece {
    constructor(x: any, y: any, team: any, board: any);
    canMove(x: any, y: any, board: any): boolean;
}
declare class Knight extends Piece {
    constructor(x: any, y: any, team: any, board: any);
    canMove(x: any, y: any, board: any): boolean;
}
declare class Pawn extends Piece {
    constructor(x: any, y: any, team: any, board: any);
    move(x: any, y: any, board: any): void;
    canMove(x: any, y: any, board: any): boolean;
    pawnDirection(): 0 | 1 | -1;
    canEnPassant(x: any, y: any, board: any): any;
    clone(): any;
}
