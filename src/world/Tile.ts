export enum TileType {
  Floor,
  Wall,
  Door,
  StairsDown,
  StairsUp,
  Void
}

export class Tile {
  constructor(
    public type: TileType,
    public seen: boolean = false,
    public visible: boolean = false
  ) {}

  public get char(): string {
    switch (this.type) {
      case TileType.Floor: return '.';
      case TileType.Wall: return '#';
      case TileType.Door: return '+';
      case TileType.StairsDown: return '>';
      case TileType.StairsUp: return '<';
      default: return ' ';
    }
  }

  public get isWalkable(): boolean {
    return this.type !== TileType.Wall && this.type !== TileType.Void;
  }

  public get isTransparent(): boolean {
    return this.type !== TileType.Wall && this.type !== TileType.Void && this.type !== TileType.Door;
  }
}
