import { Layout } from './Layout.js';
import { Game } from '../game/Game.js';
import { TileType } from '../world/Tile.js';
import { GameMode } from '../game/GameState.js';
import { Item } from '../entities/Item.js';

export class Renderer {
  private layout: Layout;
  private game: Game;

  constructor(layout: Layout, game: Game) {
    this.layout = layout;
    this.game = game;
  }

  public render(): void {
    if (this.game.mode === GameMode.Inventory) {
       this.renderInventory();
       return;
    }
    
    if (this.game.mode === GameMode.GameOver) {
        this.layout.mapBox.setContent('{center}{red-fg}GAME OVER{/red-fg}\n\nPress ENTER to restart{/center}');
        this.layout.render();
        return;
    }

    if (!this.game.map || !this.game.player) {
       this.renderPlaceholder();
       return;
    }

    const lines: string[] = [];
    const map = this.game.map;
    
    for (let y = 0; y < map.height; y++) {
      let line = '';
      for (let x = 0; x < map.width; x++) {
        const tile = map.getTile(x, y);
        if (!tile) {
            line += ' ';
            continue;
        }

        if (tile.visible) {
            // Render entities only if visible
            const entity = this.game.entities.find(e => e.x === x && e.y === y);
            const player = this.game.player.x === x && this.game.player.y === y ? this.game.player : null;
            
            if (player) {
              line += `{${player.color}-fg}${player.char}{/}`;
            } else if (entity) {
              line += `{${entity.color}-fg}${entity.char}{/}`;
            } else {
               line += tile.char;
            }
        } else if (tile.seen) {
            // Render remembered map as gray
            line += `{grey-fg}${tile.char}{/}`;
        } else {
            line += ' ';
        }
      }
      lines.push(line);
    }
    
    this.layout.mapBox.setContent(lines.join('\n'));
    
    const p = this.game.player;
    const stats = `Name: ${p.name}
Level: ${p.level}
HP: ${p.stats.hp}/${p.stats.maxHp}
ATK: ${p.stats.attack}
DEF: ${p.stats.defense}
XP: ${p.experience}/${p.nextLevelXp}

Depth: ${this.game.depth}`;

    this.layout.sidebarBox.setContent(stats);
    
    this.layout.render();
  }
  
  private renderInventory(): void {
     const p = this.game.player;
     if (!p) return;
     
     let content = '{center}{bold}Inventory{/bold}{/center}\n\n';
     if (p.inventory.length === 0) {
        content += 'Your inventory is empty.';
     } else {
        p.inventory.forEach((item: Item, index: number) => {
           if (index === this.game.inventoryIndex) {
              content += `{blue-fg}> ${item.name}{/}\n`;
           } else {
              content += `  ${item.name}\n`;
           }
        });
     }
     
     content += '\n\n{bold}Equipment:{/bold}\n';
     content += `Weapon: ${p.equipment.weapon ? p.equipment.weapon.name : 'None'}\n`;
     content += `Armor: ${p.equipment.armor ? p.equipment.armor.name : 'None'}\n`;
     
     this.layout.mapBox.setContent(content);
     this.layout.render();
  }
  
  public renderPlaceholder(): void {
    this.layout.mapBox.setContent('{center}Map Area Placeholder{/center}');
    this.layout.sidebarBox.setContent('Player: Hero\nHP: 10/10');
    this.layout.logBox.setContent('Welcome to Depths of the Terminal!');
    this.layout.render();
  }
  
  public addLog(msg: string): void {
      this.layout.logBox.pushLine(msg);
      this.layout.logBox.setScrollPerc(100);
      this.layout.render();
  }
}
