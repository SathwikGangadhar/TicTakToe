import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GameMoveDto } from 'src/dto/game.dto';
import { GamesService } from 'src/services/gamesService';

@Controller('game')
export class GameController {
  constructor(private readonly gamesService: GamesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('start')
  async create(@Request() req: any) {
    return this.gamesService.startGame(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('move')
  async gameMove(@Request() req: any, @Body() gameMoveDto: GameMoveDto) {
    if (!req?.user?.userId) {
      throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
    }
    return this.gamesService.makeGameMove(req.user.userId, gameMoveDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('moves/:gameId')
  async getAllMoves(@Param('gameId') gameId: number) {
    return this.gamesService.getAllMoves(gameId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('history/:gameId')
  async getAllGameHistory(
    @Request() req: any,
    @Param('gameId') gameId: number,
  ) {
    if (!req?.user?.userId) {
      throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
    }
    return this.gamesService.getUsersGameHistory(req.user.userId, gameId);
  }
}
