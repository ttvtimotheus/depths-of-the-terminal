import { DungeonMap } from '../world/Map.js';
import { Player } from '../entities/Player.js';
import { GameMode } from './GameState.js';
import { Entity } from '../entities/Entity.js';

export class Game {
  public map: DungeonMap | null = null;
  public player: Player | null = null;
  public entities: Entity[] = [];
  public mode: GameMode = GameMode.MainMenu;
  public depth: number = 1;

  constructor() {
    // Initialization will happen when starting a new game
  }

  public startNewGame(): void {
    this.depth = 1;
    this.mode = GameMode.InDungeon;
    // Map generation and player placement will be called here
  }
}
