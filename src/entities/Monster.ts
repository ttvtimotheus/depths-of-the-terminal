import { Entity, EntityType, Stats } from './Entity.js';

export enum MonsterType {
  Goblin,
  Orc,
  Troll
}

export class Monster extends Entity {
  constructor(x: number, y: number, public monsterType: MonsterType) {
    let char = 'g';
    let color = 'green';
    let name = 'Goblin';
    let stats: Stats = { hp: 5, maxHp: 5, attack: 2, defense: 0 };

    switch (monsterType) {
      case MonsterType.Orc:
        char = 'o';
        color = 'red';
        name = 'Orc';
        stats = { hp: 10, maxHp: 10, attack: 4, defense: 1 };
        break;
      case MonsterType.Troll:
        char = 'T';
        color = 'magenta';
        name = 'Troll';
        stats = { hp: 20, maxHp: 20, attack: 6, defense: 2 };
        break;
    }

    super(x, y, char, color, name, EntityType.Monster, true, stats);
  }
}
