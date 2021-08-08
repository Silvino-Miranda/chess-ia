declare const GameStatus: {
    PLAYING: string;
    WHITE_WIN: string;
    BLACK_WIN: string;
    STALEMATE: string;
    DRAW: string;
};
declare class Board {
    constructor();
    initEvents(): void;
    setupPieces(): void;
    countPossibleMovements(team: any): number;
    show(): void;
    showGameOver(): void;
    pass(): void;
    handleEnPassant(): void;
    handleGameStatus(): void;
    handleKingCheck(): void;
    checkMate(loserTeam: any): void;
    getEnemyTeam(team: any): string | undefined;
    canDoCastling(king: any, rook: any, newRookPosition: any): boolean;
    isInCheck(king: any): boolean;
    isPieceAt(x: any, y: any): boolean;
    isEnemyPieceAt(x: any, y: any, piece: any): boolean;
    getPieceAt(x: any, y: any): any;
    getKing(team: any): any;
    promotion(pawn: any, clazz: any): void;
}
