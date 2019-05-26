import 'phaser';
import Player from '../player';

class PlatformerScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'PlatformerScene',
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 1000 }
                }
            }
        });
    }

    preload() {
        this.load.spritesheet('player', require('../../assets/spritesheets/0x72-industrial-player-32px-extruded.png'),
        {
            frameWidth: 32,
            frameHeight: 32,
            margin: 1,
            spacing: 2
        });
        this.load.image('tiles', require('../../assets/tilesets/0x72-industrial-tileset-32px-extruded.png'));
        this.load.tilemapTiledJSON('map', require('../../assets/tilemaps/platformer-simple.json'));
    }

    create() {
        const map = this.make.tilemap({ key: 'map' });
        const tiles = map.addTilesetImage('0x72-industrial-tileset-32px-extruded', 'tiles');

        map.createDynamicLayer('Background', tiles);
        this.groundLayer = map.createDynamicLayer('Ground', tiles);
        map.createDynamicLayer('Foreground', tiles);

        const spawnPoint = map.findObject('Objects', obj => obj.name === 'Spawn Point');
        this.player = new Player(this, spawnPoint.x, spawnPoint.y);

        this.groundLayer.setCollisionByProperty({ collides: true });
        this.physics.world.addCollider(this.player.sprite, this.groundLayer);

        this.cameras.main.startFollow(this.player.sprite);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    }

    update() {
        this.player.update();
        
        if (this.player.sprite.y > this.groundLayer.height) {
            this.player.destroy();
            this.scene.restart();
        }
    }
}

export default PlatformerScene;
