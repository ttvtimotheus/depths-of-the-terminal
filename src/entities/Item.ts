import { Entity, EntityType, Stats } from './Entity.js';

export enum ItemType {
  Weapon,
  Armor,
  Potion
}

export class Item extends Entity {
  constructor(
    x: number,
    y: number,
    public itemType: ItemType,
    name: string,
    char: string,
    color: string,
    public bonus: Partial<Stats> = {},
    public value: number = 0 
  ) {
    super(x, y, char, color, name, EntityType.Item, false);
  }
}
