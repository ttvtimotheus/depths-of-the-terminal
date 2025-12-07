import { Entity, EntityType, Stats } from './Entity.js';
import { Item } from './Item.js';

export class Player extends Entity {
  public level: number = 1;
  public experience: number = 0;
  public nextLevelXp: number = 100;
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

  public gainXp(amount: number): boolean {
    this.experience += amount;
    if (this.experience >= this.nextLevelXp) {
      this.levelUp();
      return true;
    }
    return false;
  }

  private levelUp(): void {
    this.experience -= this.nextLevelXp;
    this.level++;
    this.nextLevelXp = Math.floor(this.nextLevelXp * 1.5);
    
    // Stats increase
    this.baseStats.maxHp += 5;
    this.baseStats.hp = this.baseStats.maxHp; // Full heal on level up
    this.baseStats.attack += 1;
    if (this.level % 3 === 0) this.baseStats.defense += 1; // Defense every 3 levels

    this.stats.hp = this.baseStats.hp;
    this.updateStats();
  }

  public updateStats(): void {
    this.stats.maxHp = this.baseStats.maxHp;
    
    let bonusAttack = 0;
    let bonusDefense = 0;
    
    if (this.equipment.weapon) bonusAttack += (this.equipment.weapon.bonus.attack || 0);
    if (this.equipment.armor) bonusDefense += (this.equipment.armor.bonus.defense || 0);
    
    this.stats.attack = this.baseStats.attack + bonusAttack;
    this.stats.defense = this.baseStats.defense + bonusDefense;
  }
}
