import { Player } from '../entities/Player.js';
import { Entity, EntityType } from '../entities/Entity.js';
import { DungeonMap } from '../world/Map.js';
import { CombatSystem } from './CombatSystem.js';

export class AiSystem {
  public process(player: Player, entities: Entity[], map: DungeonMap, log: (msg: string) => void): void {
    for (const entity of entities) {
      if (entity.type === EntityType.Monster) {
        const dx = player.x - entity.x;
        const dy = player.y - entity.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 8) {
          const stepX = Math.sign(dx);
          const stepY = Math.sign(dy);

          if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) {
             const msg = CombatSystem.resolveAttack(entity, player);
             log(msg);
             continue; 
          }

          let nextX = entity.x + stepX;
          let nextY = entity.y + stepY;
          
          if (map.isWalkable(nextX, nextY) && !this.isBlocked(nextX, nextY, player, entities)) {
             entity.x = nextX;
             entity.y = nextY;
          } else if (map.isWalkable(entity.x + stepX, entity.y) && !this.isBlocked(entity.x + stepX, entity.y, player, entities)) {
             entity.x += stepX;
          } else if (map.isWalkable(entity.x, entity.y + stepY) && !this.isBlocked(entity.x, entity.y + stepY, player, entities)) {
             entity.y += stepY;
          }
        }
      }
    }
  }

  private isBlocked(x: number, y: number, player: Player, entities: Entity[]): boolean {
    if (player.x === x && player.y === y) return true;
    return entities.some(e => e.x === x && e.y === y && e.blocksMovement);
  }
}
