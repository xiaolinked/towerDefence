// main.js
import {
  GRID_SIZE,
  ENEMY_TYPES,
  gameState,
  ctx,
  canvas,
  loadProjectileImages,
  backgroundImage,
} from "./constants.js";
import { Tower,  TOWER_TYPES} from "./tower.js";
import { Enemy } from "./enemy.js";
import { Grid } from "./grid.js";
import { Projectile } from "./projectile.js";
import {
  drawUI,
  drawTowerStats,
  drawGameOver,
  updateGameObjects,
} from "./ui.js";
import { loadTowerImages } from "./constants.js";
import { drawPath } from "./path.js";
import { setupEventListeners } from "./eventHandlers.js";

let grid;
let isSpawning = false;


canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;

  // Check if click is in the tower selection area
  if (clickY > canvas.height - 60) {
    const towerIndex = Math.floor((clickX - 10) / 100);
    if (towerIndex >= 0 && towerIndex < Object.keys(TOWER_TYPES).length) {
      gameState.selectedTower = Object.keys(TOWER_TYPES)[towerIndex];
      gameState.selectedForUpgrade = null; // Deselect upgrade when selecting a new tower
    }
  } else {
    const gridX = Math.floor(clickX / GRID_SIZE);
    const gridY = Math.floor(clickY / GRID_SIZE);

    // Check if a tower is clicked for upgrade
    const clickedTower = gameState.towers.find(
      (tower) => tower.gridX === gridX && tower.gridY === gridY
    );

    if (clickedTower) {
      gameState.selectedForUpgrade = clickedTower;
      // Show tower stats and upgrade button
      drawTowerStats(clickedTower);
      // Show tower stats
      console.log(`Clicked on a tower.Tower Stats:
                Type: ${clickedTower.type}
                Level: ${clickedTower.level + 1}
                Damage: ${clickedTower.damage}
                Range: ${clickedTower.range}
                Fire Rate: ${clickedTower.fireRate.toFixed(2)} shots/second`);
    } else if (gameState.selectedForUpgrade) {
      const upgradeButtonRect = {
        x: canvas.width - 190,
        y: 200,
        width: 180,
        height: 30,
      };
      function isClickInsideRect(x, y, rect) {
        return (
          x >= rect.x &&
          x <= rect.x + rect.width &&
          y >= rect.y &&
          y <= rect.y + rect.height
        );
      }
      if (isClickInsideRect(clickX, clickY, upgradeButtonRect)) {
        // Attempt to upgrade if upgrade button is clicked
        if (gameState.selectedForUpgrade.upgrade()) {
          console.log(`Tower upgraded:
                        Type: ${gameState.selectedForUpgrade.type}
                        New Level: ${gameState.selectedForUpgrade.level + 1}
                        New Damage: ${gameState.selectedForUpgrade.damage}
                        New Range: ${gameState.selectedForUpgrade.range}
                        New Fire Rate: ${gameState.selectedForUpgrade.fireRate.toFixed(
                          2
                        )} shots/second`);
          drawTowerStats(gameState.selectedForUpgrade);
        } else {
          console.log("Upgrade failed. Not enough money or max level reached.");
        }
      } else {
        gameState.selectedForUpgrade = null;
      }
    } else {
      // Place a new tower if no tower is selected for upgrade
      if (
        gameState.money >=
          TOWER_TYPES[gameState.selectedTower].levels[0].cost &&
        grid.canPlaceTower(gridX, gridY)
      ) {
        const tower = grid.placeTower(gridX, gridY, gameState.selectedTower);
        if (tower) {
          gameState.towers.push(tower);
          gameState.money -=
            TOWER_TYPES[gameState.selectedTower].levels[0].cost;
        } else {
          console.error("Failed to place tower");
        }
      }
    }
  }
});

// Initialize game objects and start the game loop
async function initGame() {
  await loadTowerImages();
  await loadProjectileImages();
  backgroundImage
  grid = new Grid();

  gameLoop();
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw background image
  if (backgroundImage) {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  }
  // Draw grid
  grid.draw();

  drawPath();

  // Update and draw game objects
  updateGameObjects();

  // Draw UI
  drawUI();

  if (gameState.selectedForUpgrade) {
    drawTowerStats(gameState.selectedForUpgrade);
  }

  // Check for wave completion
  if (gameState.enemies.length === 0 && !isSpawning) {
    gameState.wave++;
    gameState.money += 100 + gameState.wave * 10; // Bonus money between waves
    setTimeout(() => {
      spawnWave();
    }, 0);
    isSpawning = true; // Set isSpawning to true immediately
  }

  // Check game over condition
  if (gameState.lives <= 0) {
    drawGameOver();
    return;
  }

  requestAnimationFrame(gameLoop);
}


function spawnWave() {
  const enemyCount = 10 + gameState.wave * 3;
  const spawnInterval = 800 - gameState.wave * 20;
  let enemiesSpawned = 0;

  const spawnEnemy = () => {
    if (enemiesSpawned < enemyCount) {
      const randomType = Object.keys(ENEMY_TYPES)[Math.floor(Math.random() * Object.keys(ENEMY_TYPES).length)];
      gameState.enemies.push(new Enemy(randomType));
      enemiesSpawned++;
      setTimeout(spawnEnemy, spawnInterval);
    } else {
      isSpawning = false;
    }
  };

  isSpawning = true;
  spawnEnemy();
}

initGame();
