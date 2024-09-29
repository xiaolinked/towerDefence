import { gameState ,  ctx, canvas, PATH } from "./constants.js";
import { Tower,TOWER_TYPES } from "./tower.js";
import { Grid } from "./grid.js";

export function setupEventListeners(grid) {
    canvas.addEventListener("click", (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        handleCanvasClick(x, y, grid);
    });
}

function handleCanvasClick(x, y, grid) {
    // Handle tower placement and upgrades
    const gridX = Math.floor(x / 60);
    const gridY = Math.floor(y / 60);

    if (y > canvas.height - 60) {
        handleTowerSelection(x);
    } else if (gameState.selectedTower) {
        placeTower(gridX, gridY, grid);
    } else {
        upgradeExistingTower(gridX, gridY);
    }
}

function handleTowerSelection(x) {
    const towerIndex = Math.floor(x / 100);
    gameState.selectedTower = Object.keys(TOWER_TYPES)[towerIndex];
}

function placeTower(gridX, gridY, grid) {
    if (grid.canPlaceTower(gridX, gridY)) {
        const towerType = gameState.selectedTower;
        const towerCost = TOWER_TYPES[towerType].levels[0].cost;

        if (gameState.money >= towerCost) {
            const newTower = new Tower(gridX, gridY, towerType);
            gameState.towers.push(newTower);
            gameState.money -= towerCost;
            grid.placeTower(gridX, gridY);
            gameState.selectedTower = null;
        }
    }
}

function upgradeExistingTower(gridX, gridY) {
    const tower = gameState.towers.find(t => t.x === gridX && t.y === gridY);
    if (tower) {
        gameState.selectedForUpgrade = tower;
    } else {
        gameState.selectedForUpgrade = null;
    }
}