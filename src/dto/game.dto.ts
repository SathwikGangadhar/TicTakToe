import { IsNumber } from 'class-validator';
import { GameStatus, MovePosition } from 'src/constants/gameConstants';

export class GameMoveDto {
  @IsNumber()
  gameId: number;

  @IsNumber()
  move: number;
}

export class GameResultDTO {
  winningPlayerId: number | null;
  gameResult: GameStatus;

  constructor(winningPlayerId: number | null, gameResult: GameStatus) {
    this.gameResult = gameResult;
    this.winningPlayerId = winningPlayerId;
  }
}

export interface GameMovesDto {
  gameId: number;
  playerId: number;
  movePosition: MovePosition;
  moveTime: Date;
}

export class GameIdDTO {
  gameId: number;
}

export interface UsersDetails {
  id: number;
  username: string;
}
export class MatchHistory {
  opponentsDetail: UsersDetails;
  gameResult: GameStatus;
  moves: GameMovesDto[];
}

export class GameStartResponseDTO {
  gameId: number;
  gameStatus: GameStatus;
  player1Id: number;
  player2Id: number;
  currentMoveUserId: number;
}
