import { DungeonMap } from '../world/Map.js';
import { Player } from '../entities/Player.js';
import { GameMode } from './GameState.js';
import { Entity, EntityType } from '../entities/Entity.js';
import { LevelGenerator } from '../world/LevelGenerator.js';
import { InputCommand } from '../input/InputHandler.js';
import { AiSystem } from '../systems/AiSystem.js';
import { CombatSystem } from '../systems/CombatSystem.js';
import { InventorySystem } from '../systems/InventorySystem.js';
import { Item } from '../entities/Item.js';
import { TileType } from '../world/Tile.js';
import { Fov } from '../world/Fov.js';
import { GameConfig } from '../config/GameConfig.js';

export class Game {
  public map: DungeonMap | null = null;
  public player: Player | null = null;
  public entities: Entity[] = [];
  public mode: GameMode = GameMode.MainMenu;
  public depth: number = 1;
  public turn: number = 0;
  public onLog: ((msg: string) => void) | null = null;
  public inventoryIndex: number = 0;
  
  private aiSystem: AiSystem;

  constructor() {
    this.aiSystem = new AiSystem();
  }

  public startNewGame(): void {
    this.depth = 1;
    this.mode = GameMode.InDungeon;
    this.turn = 0;
    
    this.generateLevel();
    
    this.log('Welcome to the Depths of the Terminal!');
    this.updateFov();
  }
  
  private generateLevel(): void {
      const { map, startX, startY, entities } = LevelGenerator.generate(GameConfig.map.width, GameConfig.map.height, this.depth);
      this.map = map;
      if (!this.player) {
          this.player = new Player(startX, startY);
      } else {
          this.player.x = startX;
          this.player.y = startY;
      }
      this.entities = entities;
      this.updateFov();
  }

  public handleInput(cmd: InputCommand): void {
     if (this.mode === GameMode.InDungeon) {
        if (cmd.type === 'move') {
           this.movePlayer(cmd.dx, cmd.dy);
        } else if (cmd.type === 'wait') {
           this.processTurn();
        } else if (cmd.type === 'pickup') {
           this.pickUpItem();
        } else if (cmd.type === 'inventory') {
           this.mode = GameMode.Inventory;
           this.inventoryIndex = 0;
           this.log('Inventory opened. Use UP/DOWN to select, ENTER to use/equip, ESC/Q to close.');
        } else if (cmd.type === 'quit') {
            process.exit(0);
        }
     } else if (this.mode === GameMode.Inventory) {
        if (cmd.type === 'quit' || cmd.type === 'cancel') {
            this.mode = GameMode.InDungeon;
            this.log('Closed inventory.');
        } else if (cmd.type === 'move') {
            if (cmd.dy < 0) this.inventoryIndex = Math.max(0, this.inventoryIndex - 1);
            if (cmd.dy > 0 && this.player) this.inventoryIndex = Math.min(this.player.inventory.length - 1, this.inventoryIndex + 1);
        } else if (cmd.type === 'use') {
            this.useItem();
        }
     } else if (this.mode === GameMode.GameOver) {
         if (cmd.type === 'quit') process.exit(0);
         if (cmd.type === 'use' || cmd.type === 'wait') {
             this.player = null; // Reset player
             this.startNewGame();
         }
     }
  }
  
  public log(msg: string): void {
    if (this.onLog) this.onLog(msg);
  }
  
  private pickUpItem(): void {
     if (!this.player) return;
     const item = this.entities.find(e => e.x === this.player!.x && e.y === this.player!.y && e.type === EntityType.Item) as Item;
     if (item) {
        if (InventorySystem.pickUp(this.player, item)) {
           this.entities = this.entities.filter(e => e !== item);
           this.log(`Picked up ${item.name}.`);
           this.processTurn();
        } else {
           this.log('Inventory full!');
        }
     } else {
        this.log('There is nothing here to pick up.');
     }
  }

  private useItem(): void {
      if (!this.player || this.player.inventory.length === 0) return;
      const item = this.player.inventory[this.inventoryIndex];
      const msg = InventorySystem.useItem(this.player, item);
      this.log(msg);
      
      // Check if index still valid
      if (this.inventoryIndex >= this.player.inventory.length) {
          this.inventoryIndex = Math.max(0, this.player.inventory.length - 1);
      }
      
      this.processTurn();
  }
  
  private movePlayer(dx: number, dy: number): void {
     if (!this.player || !this.map) return;
     
     const newX = this.player.x + dx;
     const newY = this.player.y + dy;
     
     if (this.map.isWalkable(newX, newY)) {
        const target = this.entities.find(e => e.x === newX && e.y === newY && e.blocksMovement);
        if (target) {
           const msg = CombatSystem.resolveAttack(this.player, target);
           this.log(msg);
           
           if (target.stats.hp <= 0) {
              this.log(`${target.name} dies!`);
              this.entities = this.entities.filter(e => e !== target);
              
              const leveledUp = this.player.gainXp(10 + (this.depth * 2));
              if (leveledUp) {
                  this.log(`Leveled up! You are now level ${this.player.level}.`);
              }
           }
           this.processTurn();
        } else {
            // Check if stairs down
            if (this.map.getTile(newX, newY)?.type === TileType.StairsDown) {
                this.log('You descend deeper into the dungeon...');
                this.depth++;
                this.generateLevel();
                return;
            }
            
           this.player.x = newX;
           this.player.y = newY;
           this.updateFov();
           this.processTurn();
        }
     }
  }
  
  private processTurn(): void {
     if (this.player && this.map) {
         this.aiSystem.process(this.player, this.entities, this.map, (msg) => this.log(msg));
         
         if (this.player.stats.hp <= 0) {
             this.log('You have died! Press ENTER to restart.');
             this.mode = GameMode.GameOver;
         }
     }
     this.turn++;
  }
  
  private updateFov(): void {
      if (this.player && this.map) {
          Fov.compute(this.map, this.player.x, this.player.y, GameConfig.fov.radius);
      }
  }
}
