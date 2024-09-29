import { ENEMY_TYPES,GRID_COLS,GRID_ROWS,GRID_SIZE,PATH ,ctx,canvas , gameState} from "./constants.js";
export  class Enemy {
    constructor(type) {
      this.type = type;
      this.pathIndex = 0;
      this.x = PATH[0].x * GRID_SIZE;
      this.y = PATH[0].y * GRID_SIZE;
      this.health = ENEMY_TYPES[type].health;
      this.speed = ENEMY_TYPES[type].speed;
      this.reward = ENEMY_TYPES[type].reward;
    }
  
    update() {
      const targetX = PATH[this.pathIndex].x * GRID_SIZE + GRID_SIZE / 2;
      const targetY = PATH[this.pathIndex].y * GRID_SIZE + GRID_SIZE / 2;
  
      const dx = targetX - this.x;
      const dy = targetY - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
  
      if (distance < this.speed) {
        this.pathIndex++;
        if (this.pathIndex >= PATH.length) {
          gameState.lives--;
          return false;
        }
      } else {
        this.x += (dx / distance) * this.speed;
        this.y += (dy / distance) * this.speed;
      }
  
      if (this.health <= 0) {
        gameState.money += this.reward;
        return false;
      }
  
      return true;
    }
  
    draw() {
      ctx.fillStyle = ENEMY_TYPES[this.type].color;
      ctx.fillRect(
        this.x - GRID_SIZE * 0.4,
        this.y - GRID_SIZE * 0.4,
        GRID_SIZE * 0.8,
        GRID_SIZE * 0.8
      );
  
      // Health bar
      ctx.fillStyle = "red";
      ctx.fillRect(
        this.x - GRID_SIZE * 0.4,
        this.y - GRID_SIZE * 0.6,
        GRID_SIZE * 0.8,
        GRID_SIZE * 0.1
      );
      ctx.fillStyle = "green";
      ctx.fillRect(
        this.x - GRID_SIZE * 0.4,
        this.y - GRID_SIZE * 0.6,
        GRID_SIZE * 0.8 * (this.health / ENEMY_TYPES[this.type].health),
        GRID_SIZE * 0.1
      );
    }
  }