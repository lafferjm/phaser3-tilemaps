import 'phaser';

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    pixelArt: true,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var controls;

new Phaser.Game(config);

function preload() {
    this.load.image('tiles', require('../assets/tilesets/tuxmon-sample-32px-extruded.png'));
    this.load.tilemapTiledJSON('map', require('../assets/tilemaps/tuxemon-town.json'));
}

function create() {
    const map = this.make.tilemap({ key: 'map' });

    const tileset = map.addTilesetImage("tuxmon-sample-32px-extruded", "tiles");

    const belowLayer = map.createStaticLayer("Below Player", tileset, 0, 0);
    const worldLayer = map.createStaticLayer("World", tileset, 0, 0);
    const aboveLayer = map.createStaticLayer("Above Player", tileset, 0, 0);

    const camera = this.cameras.main;

    const cursors = this.input.keyboard.createCursorKeys();
    controls = new Phaser.Cameras.Controls.FixedKeyControl({
        camera: camera,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        speed: 0.5
    });

    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
}

function update(time, delta) {
    controls.update(delta);
}
