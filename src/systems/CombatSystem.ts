import { Entity } from '../entities/Entity.js';

export class CombatSystem {
  public static resolveAttack(attacker: Entity, defender: Entity): string {
    const damage = Math.max(0, attacker.stats.attack - defender.stats.defense);
    defender.stats.hp -= damage;
    
    return `${attacker.name} hits ${defender.name} for ${damage} damage.`;
  }
}
