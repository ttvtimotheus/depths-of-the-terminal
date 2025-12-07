import { v4 as uuidv4 } from 'uuid';

export enum EntityType {
  Player,
  Monster,
  Item
}

export interface Stats {
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
}

export abstract class Entity {
  public id: string;
  
  constructor(
    public x: number,
    public y: number,
    public char: string,
    public color: string,
    public name: string,
    public type: EntityType,
    public blocksMovement: boolean = true,
    public stats: Stats = { hp: 10, maxHp: 10, attack: 1, defense: 0 }
  ) {
    this.id = uuidv4();
  }

  public move(dx: number, dy: number): void {
    this.x += dx;
    this.y += dy;
  }
}
