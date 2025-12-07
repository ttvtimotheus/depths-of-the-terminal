import { Entity, EntityType, Stats } from './Entity.js';
import { Item } from './Item.js';

export class Player extends Entity {
  public level: number = 1;
  public experience: number = 0;
  public inventory: Item[] = [];
  public equipment: { weapon: Item | null; armor: Item | null } = { weapon: null, armor: null };
  public baseStats: Stats;

  constructor(x: number, y: number) {
    const stats: Stats = {
      hp: 20,
      maxHp: 20,
      attack: 4,
      defense: 1
    };
    super(x, y, '@', 'white', 'Player', EntityType.Player, true, { ...stats });
    this.baseStats = { ...stats };
  }
}
