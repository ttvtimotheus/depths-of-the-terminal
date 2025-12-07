export enum GameMode {
  MainMenu,
  InDungeon,
  Inventory,
  GameOver
}

export interface GameState {
  mode: GameMode;
  depth: number;
  turn: number;
}
