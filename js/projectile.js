import {
  gameState,
  GRID_SIZE,
  ctx,
  towerImages,
  canvas,
  PATH,
  projectileImages
} from "./constants.js";
export class Projectile {
  constructor(x, y, target, damage, towerType) {
    this.x = x;
    this.y = y;
    this.target = target;
    this.speed = 10;
    this.damage = damage;
    this.towerType = towerType;
  }

  update() {
    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > this.speed) {
      this.x += (dx / distance) * this.speed;
      this.y += (dy / distance) * this.speed;
      return true;
    } else {
      this.target.health -= this.damage;
      this.toRemove = true;
      return false;
    }
  }

  draw() {
    const img = projectileImages[this.towerType];

    if (img) {
      const dx = this.target.x - this.x;
      const dy = this.target.y - this.y;
      const angle = Math.atan2(dy, dx);
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(angle + Math.PI / 2);
      ctx.drawImage(img, -8, -8, 20, 20);
      ctx.restore();
    } else {
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
