import {
  gameState,
  GRID_SIZE,
  ctx,
  towerImages,
  canvas,
  PATH,
} from "./constants.js";
import { Projectile } from "./projectile.js";

export class Tower {
  constructor(gridX, gridY, towerType) {
    this.gridX = gridX;
    this.gridY = gridY;
    this.x = gridX * GRID_SIZE + GRID_SIZE / 2;
    this.y = gridY * GRID_SIZE + GRID_SIZE / 2;
    this.type = towerType;
    this.level = 0;
    this.updateStats();
    this.lastFired = 0;
    this.angle = 0;
    this.lastTarget = null;
    this.images = towerImages[towerType];
  }
  upgrade() {
    if (this.level < TOWER_TYPES[this.type].levels.length - 1) {
      const upgradeCost = TOWER_TYPES[this.type].levels[this.level + 1].cost;
      if (gameState.money >= upgradeCost) {
        gameState.money -= upgradeCost;
        this.level++;
        this.updateStats();
        return true;
      }
    }
    return false;
  }

  updateStats() {
    console.log(this.type);
    const currentLevel = TOWER_TYPES[this.type].levels[this.level];
    this.damage = currentLevel.damage;
    this.range = currentLevel.range;
    this.fireRate = currentLevel.fireRate;
    this.color = TOWER_TYPES[this.type].color;
  }

  update(enemies) {
    if (Date.now() - this.lastFired > 1000 / this.fireRate) {
      const target = enemies.find((enemy) => {
        const distance = Math.sqrt(
          Math.pow(enemy.x - this.x, 2) + Math.pow(enemy.y - this.y, 2)
        );
        return distance <= this.range;
      });

      if (target) {
        const currentLevel = TOWER_TYPES[this.type].levels[this.level];
        gameState.projectiles.push(
          new Projectile(
            this.x,
            this.y,
            target,
            this.damage,
            this.type,
            currentLevel.projectileSpeed
          )
        );
        this.lastFired = Date.now();
        this.lastTarget = target;
      }
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);

    // Calculate rotation angle if there's a target
    if (this.lastTarget) {
      const dx = this.lastTarget.x - this.x;
      const dy = this.lastTarget.y - this.y;
      this.angle = Math.atan2(dy, dx);
    }

    // Rotate the context
    ctx.rotate(this.angle + Math.PI / 2);

    // Draw the tower image instead of the triangle
    const imageSize = GRID_SIZE * 1; // Adjust this value to fit your needs
    const image = this.images[this.level];
    ctx.drawImage(image, -imageSize / 2, -imageSize / 2, imageSize, imageSize);

    ctx.restore();
  }
}

export const TOWER_TYPES = {
  BASIC: {
    name: "Basic",
    color: "blue",
    levels: [
      {
        cost: 50,
        damage: 10,
        range: 120,
        fireRate: 1,
        projectileSpeed: 10,
        image: "statics/towers/basic_tower_1.png",
      },
      {
        cost: 30,
        damage: 15,
        range: 130,
        fireRate: 1.2,
        projectileSpeed: 10,
        image: "statics/towers/basic_tower_2.png",
      },
      {
        cost: 50,
        damage: 20,
        range: 140,
        fireRate: 1.4,
        projectileSpeed: 10,
        image: "statics/towers/basic_tower_3.png",
      },
    ],
  },
  SNIPER: {
    name: "Sniper",
    color: "purple",
    levels: [
      {
        cost: 100,
        damage: 30,
        range: 200,
        fireRate: 0.5,
        projectileSpeed: 15,
        image: "statics/towers/sniper_tower_1.png",
      },
      {
        cost: 60,
        damage: 45,
        range: 220,
        fireRate: 0.6,
        projectileSpeed: 15,
        image: "statics/towers/sniper_tower_2.png",
      },
      {
        cost: 100,
        damage: 60,
        range: 240,
        fireRate: 0.7,
        projectileSpeed: 15,
        image: "statics/towers/sniper_tower_3.png",
      },
    ],
  },
  MACHINE_GUN: {
    name: "Machine Gun",
    color: "orange",
    levels: [
      {
        cost: 150,
        damage: 5,
        range: 100,
        fireRate: 3.0,
        projectileSpeed: 8,

        image: "statics/towers/machine_gun_tower_1.png",
      },
      {
        cost: 80,
        damage: 6,
        range: 110,
        fireRate: 3.5,
        projectileSpeed: 8,

        image: "statics/towers/machine_gun_tower_2.png",
      },
      {
        cost: 120,
        damage: 7,
        range: 120,
        fireRate: 4.0,
        projectileSpeed: 8,
        image: "statics/towers/machine_gun_tower_3.png",
      },
    ],
  },
  ROCKET: {
    name: "Rocket",
    color: "purple",
    levels: [
      {
        cost: 100,
        damage: 40,
        range: 400,
        fireRate: 0.5,
        projectileSpeed: 5,
        image: "statics/towers/rocket_tower_1.png",
      },
      {
        cost: 60,
        damage: 55,
        range: 500,
        fireRate: 0.6,
        projectileSpeed: 5,
        image: "statics/towers/rocket_tower_2.png",
      },
      {
        cost: 100,
        damage: 70,
        range: 600,
        fireRate: 0.7,
        projectileSpeed: 5,
        image: "statics/towers/rocket_tower_3.png",
      },
    ],
  },
};
