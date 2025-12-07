import { describe, it, expect } from 'vitest';
import { CombatSystem } from '../src/systems/CombatSystem.js';
import { Entity, EntityType } from '../src/entities/Entity.js';

describe('CombatSystem', () => {
  it('should calculate damage correctly', () => {
    const attacker = new class extends Entity {
        constructor() { super(0,0, 'A', 'red', 'Attacker', EntityType.Monster, true, { hp: 10, maxHp: 10, attack: 5, defense: 0 }); }
    }();
    
    const defender = new class extends Entity {
        constructor() { super(0,0, 'D', 'blue', 'Defender', EntityType.Player, true, { hp: 10, maxHp: 10, attack: 1, defense: 2 }); }
    }();

    const msg = CombatSystem.resolveAttack(attacker, defender);
    
    expect(defender.stats.hp).toBe(7); // 10 - (5 - 2) = 7
    expect(msg).toContain('Attacker hits Defender for 3 damage');
  });
});
