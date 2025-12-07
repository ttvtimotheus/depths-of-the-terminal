import { DungeonMap } from '../world/Map.js';
import { Player } from '../entities/Player.js';
import { GameMode } from './GameState.js';
import { Entity } from '../entities/Entity.js';
import { LevelGenerator } from '../world/LevelGenerator.js';
import { InputCommand } from '../input/InputHandler.js';
import { AiSystem } from '../systems/AiSystem.js';
import { CombatSystem } from '../systems/CombatSystem.js';

export class Game {
  public map: DungeonMap | null = null;
  public player: Player | null = null;
  public entities: Entity[] = [];
  public mode: GameMode = GameMode.MainMenu;
  public depth: number = 1;
  public turn: number = 0;
  public onLog: ((msg: string) => void) | null = null;
  
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
    
    this.log('Welcome to the Depths of the Terminal!');
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
  
  public log(msg: string): void {
    if (this.onLog) this.onLog(msg);
  }
  
  private movePlayer(dx: number, dy: number): void {
     if (!this.player || !this.map) return;
     
     const newX = this.player.x + dx;
     const newY = this.player.y + dy;
     
     if (this.map.isWalkable(newX, newY)) {
        const target = this.entities.find(e => e.x === newX && e.y === newY);
        if (target) {
           const msg = CombatSystem.resolveAttack(this.player, target);
           this.log(msg);
           
           if (target.stats.hp <= 0) {
              this.log(`${target.name} dies!`);
              this.entities = this.entities.filter(e => e !== target);
              this.player.experience += 10;
           }
           this.processTurn(); // Attack takes a turn
        } else {
           this.player.x = newX;
           this.player.y = newY;
           this.processTurn();
        }
     }
  }
  
  private processTurn(): void {
     if (this.player && this.map) {
         this.aiSystem.process(this.player, this.entities, this.map, (msg) => this.log(msg));
         
         if (this.player.stats.hp <= 0) {
             this.log('You have died!');
             this.mode = GameMode.GameOver;
         }
     }
     this.turn++;
  }
}
