import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { Game } from './game.entity';
import { User } from './user.entity';
import { MovePosition } from 'src/constants/gameConstants';

@Entity()
export class GameMove {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Game, (game) => game.gameMoves)
  game: Game;

  @Column({ name: 'gameId', type: 'int', nullable: true })
  gameId: number;

  @ManyToOne(() => User, (user) => user.gameMoves)
  player: User;

  @Column({ name: 'playerId', type: 'int', nullable: true })
  playerId: number;

  @Column()
  movePosition: MovePosition;

  @CreateDateColumn()
  moveTime: Date;
}
