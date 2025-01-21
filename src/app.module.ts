import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameMove } from './entites/game-move.entity';
import { Game } from './entites/game.entity';
import { UserProfile } from './entites/user-profile.entity';
import { User } from './entites/user.entity';
import { UsersController } from './controllers/users.controler';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from './services/usersService';
import { Authentication } from './services/authentication.service';
import { JwtStrategy } from './authStratergy/local.stratergy';
import { PassportModule } from '@nestjs/passport';
import { GameController } from './controllers/game.controler';
import { Repository } from 'typeorm';
import { GamesService } from './services/gamesService';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forRoot({
      // TODO: hardcoding for now, should be moved to an environment file.
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'sathwikgshetty',
      password: 'your-db-password',
      database: 'tic_tak_game_db',
      entities: [GameMove, Game, UserProfile, User],
      logging: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Game, GameMove]),
    // TODO: hardcoding for now, should be moved to an environment file.
    JwtModule.register({
      // TODO: update the secrete with a complex string
      secret: 'yourSecretKey',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AppController, UsersController, GameController],
  providers: [
    AppService,
    UsersService,
    Repository,
    Authentication,
    JwtStrategy,
    GamesService,
  ],
})
export class AppModule {}
