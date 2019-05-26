import 'phaser';

import MainMenuScene from './scenes/mainMenuScene';
import TileMapWithCameraScene from './scenes/tileMapWithCameraScene';
import TileMapWithPlayerScene from './scenes/tileMapWithPlayerScene';
import SimplePlatformerScene from './scenes/simplePlatformerScene';
import PlatformerScene from './scenes/platformerScene';
import DrawingPlatformerTileScene from './scenes/drawingTilePlatformerScene';

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    pixelArt: true,
    scene: [
        MainMenuScene,
        TileMapWithCameraScene,
        TileMapWithPlayerScene,
        SimplePlatformerScene,
        PlatformerScene,
        DrawingPlatformerTileScene
    ]
};


new Phaser.Game(config);
