import { gameState , ctx, canvas,PATH} from "./constants.js";
import { Tower ,TOWER_TYPES} from "./tower.js";
export function drawUI() {
    // Draw tower selection UI
    Object.entries(TOWER_TYPES).forEach(([type, data], index) => {
      ctx.fillStyle = data.color;
      ctx.fillRect(10 + index * 100, canvas.height - 60, 80, 50);
      ctx.fillStyle = "white";
      ctx.fillText(data.name, 15 + index * 100, canvas.height - 30);
      ctx.fillText(
        `$${data.levels[0].cost}`,
        15 + index * 100,
        canvas.height - 10
      );
    });
  
    ctx.strokeStyle = "yellow";
    ctx.strokeRect(
      10 + Object.keys(TOWER_TYPES).indexOf(gameState.selectedTower) * 100,
      canvas.height - 60,
      80,
      50
    );
  
    // Draw game stats
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`Money: $${gameState.money}`, 10, 30);
    ctx.fillText(`Lives: ${gameState.lives}`, 10, 60);
    ctx.fillText(`Wave: ${gameState.wave}`, 10, 90);
  
    // // Draw upgrade UI if a tower is selected
    // if (gameState.selectedForUpgrade) {
    //     const tower = gameState.selectedForUpgrade;
    //     const nextUpgrade = TOWER_TYPES[tower.type].upgrades[tower.level];
    //     if (nextUpgrade) {
    //         ctx.fillStyle = 'black';
    //         ctx.fillRect(canvas.width - 200, 10, 190, 100);
    //         ctx.fillStyle = 'white';
    //         ctx.fillText(`Upgrade ${TOWER_TYPES[tower.type].name}`, canvas.width - 190, 30);
    //         ctx.fillText(`Cost: $${nextUpgrade.cost}`, canvas.width - 190, 50);
    //         ctx.fillText(`Damage: ${tower.damage} -> ${nextUpgrade.damage}`, canvas.width - 190, 70);
    //         ctx.fillText(`Range: ${tower.range} -> ${nextUpgrade.range}`, canvas.width - 190, 90);
    //     }
    // }
  }
  export function drawTowerStats(tower) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(canvas.width - 200, 10, 190, 200); // Increased height to fit all information
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText(
      `${TOWER_TYPES[tower.type].name} (Level ${tower.level + 1})`,
      canvas.width - 190,
      30
    );
    ctx.fillText(`---Current level:`, canvas.width - 190, 50);
    ctx.fillText(`Damage: ${tower.damage}`, canvas.width - 190, 70);
    ctx.fillText(`Range: ${tower.range}`, canvas.width - 190, 90);
    ctx.fillText(
      `Fire Rate: ${tower.fireRate.toFixed(2)}/s`,
      canvas.width - 190,
      110
    );
    const nextLevel = TOWER_TYPES[tower.type].levels[tower.level + 1];
    if (nextLevel) {
      ctx.fillText(`---Next Upgrade:`, canvas.width - 190, 130);
      ctx.fillText(`Damage: ${nextLevel.damage}`, canvas.width - 190, 150);
      ctx.fillText(`Range: ${nextLevel.range}`, canvas.width - 190, 170);
      ctx.fillText(
        `Fire Rate: ${nextLevel.fireRate.toFixed(2)}/s`,
        canvas.width - 190,
        190
      );
  
      ctx.fillStyle = "yellow";
      ctx.fillRect(canvas.width - 190, 200, 180, 30);
      ctx.fillStyle = "black";
      ctx.fillText(`Upgrade to level ${tower.level + 2}`, canvas.width - 180, 220);
    }
  }
  // Helper function to draw game over screen
  export function drawGameOver() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "48px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
    ctx.font = "24px Arial";
    ctx.fillText(
      `You survived ${gameState.wave} waves`,
      canvas.width / 2 - 100,
      canvas.height / 2 + 50
    );
  }

  export function updateGameObjects() {
    gameState.enemies = gameState.enemies.filter((enemy) => {
      enemy.update();
      enemy.draw();
      return enemy.health > 0 && enemy.pathIndex < PATH.length;
    });
  
    gameState.towers.forEach((tower) => {
      tower.update(gameState.enemies);
      tower.draw();
    });
  
    gameState.projectiles = gameState.projectiles.filter((projectile) => {
      projectile.update();
      projectile.draw();
      return !projectile.toRemove;
    });
  }