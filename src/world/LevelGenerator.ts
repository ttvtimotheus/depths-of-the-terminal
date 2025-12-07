import { DungeonMap } from './Map.js';
import { Tile, TileType } from './Tile.js';

interface Room {
  x: number;
  y: number;
  w: number;
  h: number;
}

export class LevelGenerator {
  public static generate(width: number, height: number): { map: DungeonMap, startX: number, startY: number } {
    const map = new DungeonMap(width, height);
    const rooms: Room[] = [];
    const maxRooms = 15;
    const minSize = 6;
    const maxSize = 12;

    for (let i = 0; i < maxRooms; i++) {
      const w = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
      const h = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
      const x = Math.floor(Math.random() * (width - w - 1)) + 1;
      const y = Math.floor(Math.random() * (height - h - 1)) + 1;

      const newRoom: Room = { x, y, w, h };

      // Check intersection
      let failed = false;
      for (const other of rooms) {
        if (LevelGenerator.intersects(newRoom, other)) {
          failed = true;
          break;
        }
      }

      if (!failed) {
        LevelGenerator.createRoom(map, newRoom);
        
        if (rooms.length > 0) {
           const prev = rooms[rooms.length - 1];
           const prevCenterX = Math.floor(prev.x + prev.w / 2);
           const prevCenterY = Math.floor(prev.y + prev.h / 2);
           const newCenterX = Math.floor(newRoom.x + newRoom.w / 2);
           const newCenterY = Math.floor(newRoom.y + newRoom.h / 2);

           if (Math.random() < 0.5) {
             LevelGenerator.createHCorridor(map, prevCenterX, newCenterX, prevCenterY);
             LevelGenerator.createVCorridor(map, prevCenterY, newCenterY, newCenterX);
           } else {
             LevelGenerator.createVCorridor(map, prevCenterY, newCenterY, prevCenterX);
             LevelGenerator.createHCorridor(map, prevCenterX, newCenterX, newCenterY);
           }
        }

        rooms.push(newRoom);
      }
    }
    
    // Place stairs in the last room
    if (rooms.length > 0) {
        const lastRoom = rooms[rooms.length - 1];
        const stairsX = Math.floor(lastRoom.x + lastRoom.w / 2);
        const stairsY = Math.floor(lastRoom.y + lastRoom.h / 2);
        map.tiles[stairsY][stairsX].type = TileType.StairsDown;
    }

    const firstRoom = rooms[0];
    const startX = Math.floor(firstRoom.x + firstRoom.w / 2);
    const startY = Math.floor(firstRoom.y + firstRoom.h / 2);

    return { map, startX, startY };
  }

  private static intersects(r1: Room, r2: Room): boolean {
    return (
      r1.x <= r2.x + r2.w &&
      r1.x + r1.w >= r2.x &&
      r1.y <= r2.y + r2.h &&
      r1.y + r1.h >= r2.y
    );
  }

  private static createRoom(map: DungeonMap, room: Room): void {
    for (let y = room.y + 1; y < room.y + room.h; y++) {
      for (let x = room.x + 1; x < room.x + room.w; x++) {
        map.tiles[y][x].type = TileType.Floor;
      }
    }
  }

  private static createHCorridor(map: DungeonMap, x1: number, x2: number, y: number): void {
    for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
      if (y >= 0 && y < map.height && x >= 0 && x < map.width) {
        map.tiles[y][x].type = TileType.Floor;
      }
    }
  }

  private static createVCorridor(map: DungeonMap, y1: number, y2: number, x: number): void {
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
      if (y >= 0 && y < map.height && x >= 0 && x < map.width) {
        map.tiles[y][x].type = TileType.Floor;
      }
    }
  }
}
