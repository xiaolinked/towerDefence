import { GRID_COLS,GRID_ROWS,GRID_SIZE,PATH ,ctx,canvas} from './constants.js';
import { Tower ,TOWER_TYPES} from "./tower.js";
export class Grid {
    constructor() {
      this.cells = Array(GRID_ROWS)
        .fill()
        .map(() => Array(GRID_COLS).fill(0));
      // Mark path cells as occupied
 // Mark path cells as occupied
 PATH.forEach((point, index) => {
  this.cells[point.y][point.x] = 1;
  if (index < PATH.length - 1) {
    const nextPoint = PATH[index + 1];
    const dx = Math.sign(nextPoint.x - point.x);
    const dy = Math.sign(nextPoint.y - point.y);
    let x = point.x, y = point.y;
    while (x !== nextPoint.x || y !== nextPoint.y) {
      if (x !== nextPoint.x) x += dx;
      if (y !== nextPoint.y) y += dy;
      this.cells[y][x] = 1;
    }
  }
});
    }
  
    canPlaceTower(gridX, gridY) {
      return this.cells[gridY][gridX] === 0;
    }
  
    placeTower(gridX, gridY, towerType) {
      if (this.canPlaceTower(gridX, gridY)) {
        this.cells[gridY][gridX] = 2;
        return new Tower(gridX, gridY, towerType);
      }
      return null;
    }
  
    draw() {
      ctx.strokeStyle = "lightgray";
      for (let y = 0; y < GRID_ROWS; y++) {
        for (let x = 0; x < GRID_COLS; x++) {
          if (this.cells[y][x] === 1) {
            ctx.fillStyle = "rgba(255, 255, 0, 0.3)"; // Yellow for path
            ctx.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
          }
        }
      }
      for (let x = 0; x <= canvas.width; x += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y <= canvas.height; y += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }
  }