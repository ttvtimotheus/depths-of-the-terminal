import { Entity, EntityType, Stats } from './Entity.js';

export class Player extends Entity {
  public level: number = 1;
  public experience: number = 0;

  constructor(x: number, y: number) {
    const stats: Stats = {
      hp: 20,
      maxHp: 20,
      attack: 4,
      defense: 1
    };
    super(x, y, '@', 'white', 'Player', EntityType.Player, true, stats);
  }
}
