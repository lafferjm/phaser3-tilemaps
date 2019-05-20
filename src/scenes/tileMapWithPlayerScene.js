import 'phaser';

class TileMapWithPlayerScene extends Phaser.Scene {
    constructor() {
        // super('TileMapWithPlayerScene');
        super({
            key: 'TileMapWithPlayerScene',
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 } // Top down game, so no gravity
                }
            }
        });

        this.controls = null;
    }

    preload() {
        this.load.image('tiles', require('../../assets/tilesets/tuxmon-sample-32px-extruded.png'));
        this.load.tilemapTiledJSON('map', require('../../assets/tilemaps/tuxemon-town.json'));
    }
    
    create() {
        const map = this.make.tilemap({ key: 'map' });
    
        const tileset = map.addTilesetImage("tuxmon-sample-32px-extruded", "tiles");
    
        const belowLayer = map.createStaticLayer("Below Player", tileset, 0, 0);
        const worldLayer = map.createStaticLayer("World", tileset, 0, 0);
        const aboveLayer = map.createStaticLayer("Above Player", tileset, 0, 0);
    
        worldLayer.setCollisionByProperty({ collides: true });

        const debugGraphics = this.add.graphics().setAlpha(0.75);
        // worldLayer.renderDebug(debugGraphics, {
        //     tileColor: null,
        //     collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
        //     faceColor: new Phaser.Display.Color(40, 39, 37, 255)
        // });

        const camera = this.cameras.main;
    
        const cursors = this.input.keyboard.createCursorKeys();
        this.controls = new Phaser.Cameras.Controls.FixedKeyControl({
            camera: camera,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            speed: 0.5
        });
    
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    }
    
    update(time, delta) {
        this.controls.update(delta);
    }
}

export default TileMapWithPlayerScene;
