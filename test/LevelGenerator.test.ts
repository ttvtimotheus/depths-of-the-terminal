import { describe, it, expect } from 'vitest';
import { LevelGenerator } from '../src/world/LevelGenerator.js';
import { TileType } from '../src/world/Tile.js';

describe('LevelGenerator', () => {
  it('should generate a map with rooms and corridors', () => {
    const width = 40;
    const height = 20;
    const { map, startX, startY } = LevelGenerator.generate(width, height);
    
    expect(map.width).toBe(width);
    expect(map.height).toBe(height);
    
    // Check start position is walkable
    expect(map.isWalkable(startX, startY)).toBe(true);
    
    // Check if there are stairs down
    let stairsFound = false;
    for(let y=0; y<height; y++) {
        for(let x=0; x<width; x++) {
            if (map.tiles[y][x].type === TileType.StairsDown) {
                stairsFound = true;
            }
        }
    }
    expect(stairsFound).toBe(true);
  });

  it('should ensure all walkable tiles are reachable from start', () => {
    const width = 40;
    const height = 20;
    const { map, startX, startY } = LevelGenerator.generate(width, height);
    
    // Count total walkable tiles
    let walkableCount = 0;
    for(let y=0; y<height; y++) {
        for(let x=0; x<width; x++) {
            if (map.isWalkable(x, y)) {
                walkableCount++;
            }
        }
    }
    
    // Flood fill
    const visited = new Set<string>();
    const stack: {x: number, y: number}[] = [{x: startX, y: startY}];
    visited.add(`${startX},${startY}`);
    
    let reachableCount = 0;
    
    while(stack.length > 0) {
        const p = stack.pop()!;
        reachableCount++;
        
        const dirs = [[0,1], [0,-1], [1,0], [-1,0]];
        for (const [dx, dy] of dirs) {
            const nx = p.x + dx;
            const ny = p.y + dy;
            
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                if (map.isWalkable(nx, ny) && !visited.has(`${nx},${ny}`)) {
                    visited.add(`${nx},${ny}`);
                    stack.push({x: nx, y: ny});
                }
            }
        }
    }
    
    expect(reachableCount).toBe(walkableCount);
  });
});
