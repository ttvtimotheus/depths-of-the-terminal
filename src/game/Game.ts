import { DungeonMap } from '../world/Map.js';
import { Player } from '../entities/Player.js';
import { GameMode } from './GameState.js';
import { Entity } from '../entities/Entity.js';
import { LevelGenerator } from '../world/LevelGenerator.js';
import { InputCommand } from '../input/InputHandler.js';
import { AiSystem } from '../systems/AiSystem.js';

export class Game {
  public map: DungeonMap | null = null;
  public player: Player | null = null;
  public entities: Entity[] = [];
  public mode: GameMode = GameMode.MainMenu;
  public depth: number = 1;
  public turn: number = 0;
  private aiSystem: AiSystem;

  constructor() {
    this.aiSystem = new AiSystem();
  }

  public startNewGame(): void {
    this.depth = 1;
    this.mode = GameMode.InDungeon;
    this.turn = 0;
    
    const { map, startX, startY, entities } = LevelGenerator.generate(60, 20, this.depth);
    this.map = map;
    this.player = new Player(startX, startY);
    this.entities = entities;
  }
  
  public handleInput(cmd: InputCommand): void {
     if (this.mode === GameMode.InDungeon) {
        if (cmd.type === 'move') {
           this.movePlayer(cmd.dx, cmd.dy);
        } else if (cmd.type === 'wait') {
           this.processTurn();
        }
     }
  }
  
  private movePlayer(dx: number, dy: number): void {
     if (!this.player || !this.map) return;
     
     const newX = this.player.x + dx;
     const newY = this.player.y + dy;
     
     if (this.map.isWalkable(newX, newY)) {
        // Check for entity collision (attack)
        const target = this.entities.find(e => e.x === newX && e.y === newY);
        if (target) {
           // Attack logic will go here
           // console.log('Attack!');
        } else {
           this.player.x = newX;
           this.player.y = newY;
        }
        this.processTurn();
     }
  }
  
  private processTurn(): void {
     if (this.player && this.map) {
         this.aiSystem.process(this.player, this.entities, this.map);
     }
     this.turn++;
  }
}
