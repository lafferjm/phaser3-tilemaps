import 'phaser';

class SimplePlatformerScene extends Phaser.Scene {
    constructor() {
        super('SimplePlatformerScene');

        this.controls = null;
        this.marker = null;
        this.shiftKey = null;
        this.groundLayer = null;
    }

    preload() {
        this.load.image('tiles', require('../../assets/tilesets/0x72-industrial-tileset-32px-extruded.png'));
        this.load.tilemapTiledJSON('map', require('../../assets/tilemaps/platformer-simple.json'));
    }

    create() {
        const map = this.make.tilemap({ key: 'map' });
        const tiles = map.addTilesetImage('0x72-industrial-tileset-32px-extruded', 'tiles');

        map.createDynamicLayer('Background', tiles);
        this.groundLayer = map.createDynamicLayer('Ground', tiles);
        map.createDynamicLayer('Foreground', tiles);

        this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        const cursors = this.input.keyboard.createCursorKeys();
        const controlConfig = {
            camera: this.cameras.main,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            speed: 0.5
        };
        this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.marker = this.add.graphics();
        this.marker.lineStyle(5, 0xffffff, 1);
        this.marker.strokeRect(0, 0, map.tileWidth, map.tileHeight);
        this.marker.lineStyle(3, 0xff4f78, 1);
        this.marker.strokeRect(0, 0, map.tileWidth, map.tileHeight);
    }

    update(time, delta) {
        this.controls.update(delta);

        const worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);

        const pointerTileXY = this.groundLayer.worldToTileXY(worldPoint.x, worldPoint.y);
        const snappedWorldPoint = this.groundLayer.tileToWorldXY(pointerTileXY.x, pointerTileXY.y);
        this.marker.setPosition(snappedWorldPoint.x, snappedWorldPoint.y);

        if (this.input.manager.activePointer.isDown) {
            if (this.shiftKey.isDown) {
                this.groundLayer.removeTileAtWorldXY(worldPoint.x, worldPoint.y);
            } else {
                this.groundLayer.putTileAtWorldXY(353, worldPoint.x, worldPoint.y);
            }
        }
    }
}

export default SimplePlatformerScene;
