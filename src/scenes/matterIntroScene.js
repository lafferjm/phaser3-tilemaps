import 'phaser';

class MatterIntroScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'MatterIntroScene',
            physics: {
                default: 'matter',
                matter: {
                    gravity: { y: 1}
                }
            }
        });

        this.controls = null;
    }

    preload() {
        this.load.tilemapTiledJSON('map', require('../../assets/tilemaps/simple-map-collision-mapped.json'));
        this.load.image('kenney-tileset-64px-extruded', require('../../assets/tilesets/kenney-tileset-64px-extruded.png'));

        this.load.atlas('emoji', require('../../assets/atlas/emoji.png'), require('../../assets/atlas/emoji.json'));
    }

    create() {
        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('kenney-tileset-64px-extruded');
        const groundLayer = map.createDynamicLayer('Ground', tileset, 0, 0);
        const lavaLayer = map.createDynamicLayer('Lava', tileset, 0, 0);

        groundLayer.setCollisionByProperty({ collides: true });
        lavaLayer.setCollisionByProperty({ collides: true });

        this.matter.world.convertTilemapLayer(groundLayer);
        this.matter.world.convertTilemapLayer(lavaLayer);

        const image1 = this.matter.add.image(275, 100, 'emoji', '1f92c');
        image1.setCircle(image1.width / 2, { restitution: 1, friction: 0.25 });
        image1.setScale(0.5);

        const image2 = this.matter.add.image(300, 75, 'emoji', '1f60d');
        image2.setCircle(image2.width / 2, { restitution: 1, friction: 0.25 });
        image2.setScale(0.5);

        const image3 = this.matter.add
            .image(325, 100, 'emoji', '1f4a9', { restitution: 1, friction: 0, shape: 'circle' })
            .setScale(0.5);

        const frameNames = Object.keys(this.cache.json.get('emoji').frames);
        this.input.on('pointerdown', () => {
            const worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);
            for (let i = 0; i < 4; i++) {
                const x = worldPoint.x + Phaser.Math.RND.integerInRange(-10, 10);
                const y = worldPoint.y + Phaser.Math.RND.integerInRange(-10, 10);
                const frame = Phaser.Utils.Array.GetRandom(frameNames);
                this.matter.add
                    .image(x, y, 'emoji', frame, { restitution: 1, friction: 0, shape: 'circle'})
                    .setScale(0.5);
            }
        });

        this.matter.world.createDebugGraphic();
        this.matter.world.drawDebug = false;
        this.input.keyboard.on('keydown_D', event => {
            this.matter.world.drawDebug = !this.matter.world.drawDebug;
            this.matter.world.debugGraphic.clear();
        });

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        
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
    }

    update(time, delta) {
        this.controls.update(delta);
    }
}

export default MatterIntroScene;
