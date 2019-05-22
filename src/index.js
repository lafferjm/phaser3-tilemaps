import 'phaser';

import MainMenuScene from './scenes/mainMenuScene';
import TileMapWithCameraScene from './scenes/tileMapWithCameraScene';
import TileMapWithPlayerScene from './scenes/tileMapWithPlayerScene';
import SimplePlatformerScene from './scenes/simplePlatformerScene';

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    pixelArt: true,
    scene: [MainMenuScene, TileMapWithCameraScene, TileMapWithPlayerScene, SimplePlatformerScene]
};


new Phaser.Game(config);
