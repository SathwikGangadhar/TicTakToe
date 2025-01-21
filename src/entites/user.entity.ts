import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { GameMove } from './game-move.entity';
import { Game } from './game.entity';
import { UserProfile } from './user-profile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Game, (game) => game.player1)
  gamesAsPlayer1: Game[];

  @OneToMany(() => Game, (game) => game.player2)
  gamesAsPlayer2: Game[];

  @OneToOne(() => Game, (game) => game.player2)
  latestMove: Game;

  @OneToMany(() => GameMove, (move) => move.player)
  gameMoves: GameMove[];

  @OneToMany(() => UserProfile, (profile) => profile.user)
  profiles: UserProfile[];

  @OneToMany(() => Game, (game) => game.winner)
  gamesWon: Game[];
}
