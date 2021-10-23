import { GuildMember } from "discord.js";
import { Player as PlayerRPG } from "discordjs-rpg";
import { User, UserDocument } from "../database/User";
import { BasePet } from "./Pet";
import { BaseArmor } from "./Armor";
import { inlineCode } from "./utils";
import { Item } from "./Item";

export class Player extends PlayerRPG {
  private user: UserDocument;
  inventory: Item[] = [];

  constructor(member: GuildMember, user: UserDocument) {
    super(member);
    this.user = user;
    this.attack += this.level * Math.round(this.attack * 0.1);
    this.hp += this.level * Math.round(this.hp * 0.1);
    this.critChance += this.level * this.critChance * 0.001;
    this.critDamage += this.level * this.critDamage * 0.01;
  }

  get balance() {
    return this.user.balance;
  }

  set balance(amount: number) {
    this.user.balance = amount;
  }

  get level() {
    return this.user.level;
  }

  get xp() {
    return this.user.xp;
  }

  netWorth() {
    return this.balance + this.user.bank;
  }

  /** adds xp and upgrades level accordingly */
  addXP(amount: number) {
    this.user.xp += amount;
    const requiredXP = this.requiredXP();

    if (this.user.xp >= requiredXP) {
      this.user.level++;
      this.addXP(0);
    }
  }

  setPet(pet: BasePet) {
    pet.setOwner(this);
    this.user.pet = pet.id;
  }

  addArmor(armor: BaseArmor) {
    this.equipArmor(armor);
    this.user.armor.push(armor.id);
  }

  addInventory(item: Item) {
    this.user.inventory.push(item.id);
  }

  removeInventory(item: Item, count = 1) {
    const index = this.inventory.findIndex(x => x.id === item.id);
    if (!index) {
      this.user.inventory.splice(index, count);
    }
  }

  save() {
    return this.user.save();
  }

  copy() {
    const clone = super.copy();
    Object.assign(clone, this);
    return clone;
  }

  show() {
    const profile = super.show();
    const armorIndex = 8;
    const armor = profile.fields.at(armorIndex)!.value;
    profile.fields.at(armorIndex)!.name = "Coin";
    profile.fields.at(armorIndex)!.value = this.balance.toString();
    profile.fields.at(armorIndex)!.inline = true;

    profile.addField("Level", inlineCode(this.level), true);
    profile.addField("xp", `\`${this.xp}/${this.requiredXP()}\``, true);

    profile.addField("Armor", armor);
    return profile;
  }

  /** required xp to upgrade to the next level */
  private requiredXP() {
    let x = 10;
    let lvl = this.level
    while (lvl > 1) {
      x += Math.round(x * 0.4);
      lvl--;
    }
    return x;
  }

  static async fromMember(member: GuildMember) {
    let user = await User.findByUserID(member.id);

    if (!user) {
      user = new User({ userID: member.id });
      await user.save();
    }

    const player = new Player(member, user);
    const pet = BasePet.all.find(x => x.id === user.pet);
    const armors = user.armor
      .map(armorID => {
        return BaseArmor.all.find(x => x.id === armorID)!;
      })
      .filter(x => x !== undefined);

    const inventory = user.inventory
      .map(itemID => Item.all.find(item => item.id === itemID)!);

    player.inventory = inventory;

    pet?.setOwner(player);

    for (const armor of armors) {
      player.equipArmor(armor);
    }

    return player;
  }
}
