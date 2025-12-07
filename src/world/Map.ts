import { Tile, TileType } from './Tile.js';

export class DungeonMap {
  public tiles: Tile[][];
  
  constructor(public width: number, public height: number) {
    this.tiles = [];
    for (let y = 0; y < height; y++) {
      const row: Tile[] = [];
      for (let x = 0; x < width; x++) {
        row.push(new Tile(TileType.Wall));
      }
      this.tiles.push(row);
    }
  }

  public getTile(x: number, y: number): Tile | null {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return null;
    }
    return this.tiles[y][x];
  }

  public isWalkable(x: number, y: number): boolean {
    const tile = this.getTile(x, y);
    return tile ? tile.isWalkable : false;
  }
}
