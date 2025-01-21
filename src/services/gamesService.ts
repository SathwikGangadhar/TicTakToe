import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  GameResult,
  GameStatus,
  MovePosition,
  WINNING_COMBINATIONS,
} from 'src/constants/gameConstants';
import {
  GameMoveDto,
  GameMovesDto,
  GameResultDTO,
  GameStartResponseDTO,
  MatchHistory,
} from 'src/dto/game.dto';
import { GameMove } from 'src/entites/game-move.entity';
import { Game } from 'src/entites/game.entity';
import { User } from 'src/entites/user.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private gamesRepository: Repository<Game>,
    @InjectRepository(GameMove)
    private gameMoveRepository: Repository<GameMove>,
  ) {}

  private checkGameStatus(playerId: number, moves: GameMove[]): GameResultDTO {
    const playerPositions: MovePosition[] = moves.map(
      (move) => move.movePosition,
    );

    for (const combination of WINNING_COMBINATIONS) {
      if (combination.every((pos) => playerPositions.includes(pos))) {
        return new GameResultDTO(playerId, GameStatus.WON);
      }
    }
    return new GameResultDTO(null, GameStatus.IN_PROGRESS);
  }

  async getAllMoves(gameId: number): Promise<GameMovesDto[]> {
    const gameMoves: GameMove[] = await this.gameMoveRepository.findBy({
      gameId,
    });
    if (!gameMoves) {
      throw new HttpException(
        `No move found for this wit Game Id: ${gameId}`,
        HttpStatus.NOT_FOUND,
      );
    }
    const gameMovesDto: GameMovesDto[] = gameMoves.map(
      (gameMove: GameMove) => ({
        gameId: gameMove.gameId,
        playerId: gameMove.playerId,
        movePosition: gameMove.movePosition,
        moveTime: gameMove.moveTime,
      }),
    );

    return gameMovesDto;
  }

  async startGame(userId: number) {
    // Finding if any game exists
    const existingGame: Game = await this.gamesRepository.findOneBy({
      player1Id: Not(userId),
      player2Id: IsNull(),
    });

    if (existingGame) {
      existingGame.player2Id = userId;
      existingGame.updated_at = new Date();
      existingGame.status = GameStatus.IN_PROGRESS;
      existingGame.currentMoveUserId = existingGame.player1Id;

      const game: Game = await this.gamesRepository.save(existingGame);

      const gameStartResponseDTO = new GameStartResponseDTO();
      gameStartResponseDTO.gameId = game.id;
      gameStartResponseDTO.gameStatus = game.status;
      gameStartResponseDTO.player1Id = game.player1Id;
      gameStartResponseDTO.player2Id = game.player2Id;
      gameStartResponseDTO.currentMoveUserId = game.currentMoveUserId;

      return gameStartResponseDTO;
    }
    const newGame: Game = new Game();
    newGame.player1Id = userId;
    newGame.status = GameStatus.WAITING_FOR_PLAYERS;
    newGame.created_at = new Date();
    newGame.updated_at = new Date();

    const game: Game = await this.gamesRepository.save(newGame);

    const gameStartResponseDTO = new GameStartResponseDTO();
    gameStartResponseDTO.gameId = game.id;
    gameStartResponseDTO.gameStatus = game.status;
    gameStartResponseDTO.player1Id = game.player1Id;
    gameStartResponseDTO.player2Id = game.player2Id;
    gameStartResponseDTO.currentMoveUserId = game.currentMoveUserId;

    return gameStartResponseDTO;
  }

  @Transactional()
  async makeGameMove(userId: number, gameMoveDto: GameMoveDto) {
    const game: Game = await this.gamesRepository.findOneBy({
      id: gameMoveDto.gameId,
    });

    if (game.status !== GameStatus.IN_PROGRESS) {
      throw new HttpException(
        `Game with ID: ${game.id} is not in Progress`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (game.currentMoveUserId !== userId) {
      throw new HttpException(
        'Its opponent players turn',
        HttpStatus.BAD_REQUEST,
      );
    }

    const doesMoveAlreadyExists: boolean =
      await this.gameMoveRepository.existsBy({
        gameId: gameMoveDto.gameId,
        movePosition: gameMoveDto.move,
      });
    if (doesMoveAlreadyExists) {
      throw new HttpException('Move already exists', HttpStatus.BAD_REQUEST);
    }

    const gameMove: GameMove = new GameMove();
    gameMove.gameId = gameMoveDto.gameId;
    gameMove.playerId = userId;
    gameMove.movePosition = gameMoveDto.move;
    gameMove.moveTime = new Date();

    game.currentMoveUserId =
      userId === game.player1Id ? game.player2Id : game.player1Id;

    gameMove.game = game;
    await this.gameMoveRepository.insert(gameMove);

    const updatedGameMoves: GameMove[] = await this.gameMoveRepository.find({
      where: {
        gameId: gameMoveDto.gameId,
        playerId: userId,
      },
    });

    const gameMovesTotalCount: number = await this.gameMoveRepository.countBy({
      gameId: gameMoveDto.gameId,
    });

    const gameResult: GameResultDTO = this.checkGameStatus(
      userId,
      updatedGameMoves,
    );

    if (gameResult.gameResult === GameStatus.WON) {
      game.status = gameResult.gameResult;
      game.winnerId = gameResult.winningPlayerId;
    }

    if (gameMovesTotalCount === 9) {
      game.status = GameStatus.DRAW;
      game.winnerId = null;
      gameResult.gameResult = GameStatus.DRAW;
    }

    await this.gamesRepository.save(game);

    return gameResult;
  }

  async getUsersGameHistory(
    userId: number,
    gameId: number,
  ): Promise<MatchHistory> {
    const game: Game = await this.gamesRepository.findOne({
      where: [
        {
          id: gameId,
          player1Id: userId,
        },
        {
          id: gameId,
          player2Id: userId,
        },
      ],
      relations: {
        gameMoves: true,
        player1: true,
        player2: true,
      },
    });

    if (!game) {
      throw new HttpException('Game not found', HttpStatus.NOT_FOUND);
    }

    const opponentPlayer: User =
      userId === game.player1Id ? game.player2 : game.player1;

    const gameMoves: GameMovesDto[] = game.gameMoves?.map(
      (gameMove: GameMove) => ({
        gameId: gameMove.gameId,
        playerId: gameMove.playerId,
        movePosition: gameMove.movePosition,
        moveTime: gameMove.moveTime,
      }),
    );

    const matchHistory = new MatchHistory();
    matchHistory.opponentsDetail = {
      id: opponentPlayer.id,
      username: opponentPlayer.username,
    };
    matchHistory.gameResult =
      game.status === GameStatus.DRAW
        ? game.status
        : game.winnerId === userId
          ? GameStatus.WON
          : GameStatus.LOOSE;
    matchHistory.moves = gameMoves;

    return matchHistory;
  }
}
