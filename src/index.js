import 'phaser';

import MainMenuScene from './scenes/mainMenuScene';
import TileMapWithCameraScene from './scenes/tileMapWithCameraScene';

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    pixelArt: true,
    scene: [MainMenuScene, TileMapWithCameraScene]
};


new Phaser.Game(config);
