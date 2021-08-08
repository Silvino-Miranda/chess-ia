declare class BoardData {
    constructor(pieces: any, score: any, turn: any, gameStatus: any);
    mapperBoard(board: any): void;
    mapperToBoard(board: any): void;
    setScore(): void;
    movePiece(origin: any, destination: any, board: any): void;
    handleKingCheck(board: any): void;
    countPossibleMovements(team: any): number;
    clone(): BoardData;
}
