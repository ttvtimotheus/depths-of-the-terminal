import { Player } from '../entities/Player.js';
import { Item, ItemType } from '../entities/Item.js';

export class InventorySystem {
  public static pickUp(player: Player, item: Item): boolean {
    if (player.inventory.length >= 20) return false;
    player.inventory.push(item);
    return true;
  }
  
  public static useItem(player: Player, item: Item): string {
    if (item.itemType === ItemType.Potion) {
      const heal = item.value;
      const oldHp = player.stats.hp;
      player.stats.hp = Math.min(player.stats.maxHp, player.stats.hp + heal);
      const healed = player.stats.hp - oldHp;
      
      const idx = player.inventory.indexOf(item);
      if (idx > -1) player.inventory.splice(idx, 1);
      
      return `You drink the ${item.name} and recover ${healed} HP.`;
    } else if (item.itemType === ItemType.Weapon) {
       if (player.equipment.weapon) {
          player.inventory.push(player.equipment.weapon);
       }
       player.equipment.weapon = item;
       const idx = player.inventory.indexOf(item);
       if (idx > -1) player.inventory.splice(idx, 1);
       
       InventorySystem.recalculateStats(player);
       
       return `You equip ${item.name}.`;
    } else if (item.itemType === ItemType.Armor) {
       if (player.equipment.armor) {
          player.inventory.push(player.equipment.armor);
       }
       player.equipment.armor = item;
       const idx = player.inventory.indexOf(item);
       if (idx > -1) player.inventory.splice(idx, 1);
       
       InventorySystem.recalculateStats(player);
       return `You equip ${item.name}.`;
    }
    return 'You cannot use this item.';
  }
  
  public static recalculateStats(player: Player): void {
     player.stats.attack = player.baseStats.attack + (player.equipment.weapon?.bonus.attack || 0);
     player.stats.defense = player.baseStats.defense + (player.equipment.armor?.bonus.defense || 0);
  }
}
