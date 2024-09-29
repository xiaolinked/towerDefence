import { TOWER_TYPES } from './tower.js';

export async function loadImages() {
    const imagePromises = Object.values(TOWER_TYPES).flatMap(towerType =>
      towerType.levels.map(level => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = level.image;
        });
      })
    );
  
    try {
      await Promise.all(imagePromises);
      console.log('All images loaded successfully');
    } catch (error) {
      console.error('Error loading images:', error);
    }
  }