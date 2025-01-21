import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { GameMove } from './game-move.entity';
import { GameStatus } from 'src/constants/gameConstants';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.gamesAsPlayer1)
  player1: User;

  @Column({ name: 'player1Id', type: 'int', nullable: true })
  player1Id: number;

  @ManyToOne(() => User, (user) => user.gamesAsPlayer2)
  player2: User;

  @Column({ name: 'player2Id', type: 'int', nullable: true })
  player2Id: number;

  @ManyToOne(() => User, (user) => user.gamesWon, { nullable: true })
  winner: User;

  @Column({ name: 'winnerId', type: 'int', nullable: true })
  winnerId: number;

  @Column({ default: GameStatus.INITIATED })
  status: GameStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => GameMove, (move) => move.game)
  gameMoves: GameMove[];

  @ManyToOne(() => User, (user) => user.latestMove)
  currentMoveUser: User;

  @Column({ name: 'currentMoveUserId', type: 'int', nullable: true })
  currentMoveUserId: number;
}
