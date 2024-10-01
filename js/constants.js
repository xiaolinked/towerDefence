import { TOWER_TYPES } from "./tower.js";
const paths = [
  [
    { x: 0, y: 3 },
    { x: 5, y: 3 },
    { x: 5, y: 7 },
    { x: 10, y: 7 },
    { x: 10, y: 2 },
    { x: 15, y: 2 },
    { x: 15, y: 10 },
    { x: 8, y: 10 },
    { x: 8, y: 9 },
    { x: 20, y: 9 },
    { x: 20, y: 5 },
    { x: 23, y: 5 },
  ],
  [
    { x: 0, y: 8 },
    { x: 4, y: 8 },
    { x: 4, y: 4 },
    { x: 8, y: 4 },
    { x: 8, y: 10},
    { x: 12, y: 10 },
    { x: 12, y: 2 },
    { x: 16, y: 2 },
    { x: 16, y: 8 },
    { x: 20, y: 8 },
    { x: 20, y: 10 },
    { x: 23, y: 10 },
  ],
  [
    { x: 0, y: 6 },
    { x: 6, y: 6 },
    { x: 6, y: 2 },
    { x: 12, y: 2 },
    { x: 12, y: 10 },
    { x: 18, y: 10 },
    { x: 18, y: 6 },
    { x: 23, y: 6 },
  ],
];

function selectPath() {
  return paths[Math.floor(Math.random() * paths.length)];
}
export const PATH = selectPath();

export const canvas = document.getElementById("gameCanvas");
export const ctx = canvas.getContext("2d");

// Set canvas size
canvas.width = 1440; // 24 grid cells wide
canvas.height = 660; // 16 grid cells high
export const GRID_SIZE = 60;
export const GRID_ROWS = canvas.height / GRID_SIZE;
export const GRID_COLS = canvas.width / GRID_SIZE;

// Load all tower images
export const towerImages = {};

export async function loadTowerImages() {
  for (const [type, data] of Object.entries(TOWER_TYPES)) {
    towerImages[type] = await Promise.all(data.levels.map(level => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = level.image;
      });
    }));
  }
}

// load background image
export const backgroundImage = await loadBackgroundImage('./statics/background/sand_bg.jpg');

export async function loadBackgroundImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Load all projectile images
export const projectileImages = {};

export async function loadProjectileImages() {
  const projectileTypes = ['BASIC', 'MACHINE_GUN', 'ROCKET', 'SNIPER'];
  for (const type of projectileTypes) {
    projectileImages[type] = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = `./statics/projectiles/${type.toLowerCase()}_projectile.png`;
    });
  }
}
// Game state
export const gameState = {
  money: 1000,
  lives: 20,
  wave: 1,
  enemies: [],
  towers: [],
  towers: [],
  projectiles: [],
  selectedTower: "BASIC",
  selectedForUpgrade: null,
};



export const ENEMY_TYPES = {
  SLIME: {
    health: 100,
    speed: 1,
    color: "red",
    reward: 15,
    imageCount:5,
  },
  FAST: {
    health: 50,
    speed: 2,
    color: "green",
    reward: 20,
    imageCount:5,
  }
};
