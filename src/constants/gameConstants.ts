export enum GameStatus {
  INITIATED = 'INITIATED',
  IN_PROGRESS = 'IN_PROGRESS',
  WAITING_FOR_PLAYERS = 'WAITING_FOR_PLAYERS',
  WON = 'WON',
  DRAW = 'DRAW',
  LOOSE = 'LOOSE',
  ENDED = 'ENDED',
}

export enum MovePosition {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
  SIX = 6,
  SEVEN = 7,
  EIGHT = 8,
  NINE = 9,
}

export enum GameResult {
  IN_PROGRESS = 'IN_PROGRESS',
  DRAW = 'DRAW',
  WON = 'WON',
}

export const WINNING_COMBINATIONS: number[][] = [
  [1, 2, 3], // Top row
  [4, 5, 6], // Middle row
  [7, 8, 9], // Bottom row
  [1, 4, 7], // Left column
  [2, 5, 8], // Middle column
  [3, 6, 9], // Right column
  [1, 5, 9], // Diagonal from top-left
  [3, 5, 7], // Diagonal from top-right
];
