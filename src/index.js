import 'phaser';

import MainMenuScene from './scenes/mainMenuScene';
import TileMapWithCameraScene from './scenes/tileMapWithCameraScene';
import TileMapWithPlayerScene from './scenes/tileMapWithPlayerScene';
import SimplePlatformerScene from './scenes/simplePlatformerScene';
import PlatformerScene from './scenes/platformerScene';
import DrawingPlatformerTileScene from './scenes/drawingTilePlatformerScene';
import DungeonScene from './scenes/dungeonScene';
import MatterIntroScene from './scenes/matterIntroScene';
import PhysicsPlatformerScene from './scenes/physicsPlatformerScene';

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
        DrawingPlatformerTileScene,
        DungeonScene,
        MatterIntroScene,
        PhysicsPlatformerScene
    ]
};


new Phaser.Game(config);
