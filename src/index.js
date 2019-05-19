import 'phaser';
import TileMapWithCameraScene from './scenes/tileMapWithCameraScene';

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    pixelArt: true,
    scene: [TileMapWithCameraScene]
};

new Phaser.Game(config);
