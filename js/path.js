import { GRID_COLS,GRID_ROWS,GRID_SIZE,PATH ,ctx,canvas} from './constants.js';

export function drawPath() {
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(
      PATH[0].x * GRID_SIZE + GRID_SIZE / 2,
      PATH[0].y * GRID_SIZE + GRID_SIZE / 2
    );
    for (let i = 1; i < PATH.length; i++) {
      ctx.lineTo(
        PATH[i].x * GRID_SIZE + GRID_SIZE / 2,
        PATH[i].y * GRID_SIZE + GRID_SIZE / 2
      );
    }
    ctx.stroke();
  }