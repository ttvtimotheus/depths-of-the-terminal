import { DungeonMap } from './Map.js';

export class Fov {
  public static compute(map: DungeonMap, startX: number, startY: number, radius: number): void {
    // Reset visibility
    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        map.tiles[y][x].visible = false;
      }
    }

    // Always see the starting tile
    if (map.getTile(startX, startY)) {
        map.tiles[startY][startX].visible = true;
        map.tiles[startY][startX].seen = true;
    }

    // Cast rays
    // 360 steps is usually enough for small radius, but for larger radius we might need finer steps.
    // Circumference at radius 10 is 2*pi*10 ~= 62 tiles.
    // 360 steps is plenty.
    
    for (let i = 0; i < 360; i++) {
      const rad = i * (Math.PI / 180);
      const dx = Math.cos(rad);
      const dy = Math.sin(rad);

      let ox = startX + 0.5;
      let oy = startY + 0.5;

      for (let j = 0; j < radius; j++) {
        const tx = Math.floor(ox);
        const ty = Math.floor(oy);

        if (tx < 0 || tx >= map.width || ty < 0 || ty >= map.height) break;

        const tile = map.tiles[ty][tx];
        tile.visible = true;
        tile.seen = true;

        if (!tile.isTransparent) {
             break;
        }

        ox += dx;
        oy += dy;
      }
    }
  }
}
