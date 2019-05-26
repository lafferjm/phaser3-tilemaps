import 'phaser';
import Player from '../player/physicsPlayer';
import createRotatingPlatform from '../utils/create-rotating-platform';

class PhysicsPlatformerScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'PhysicsPlatformerScene',
            physics: {
                default: 'matter',
                matter: {
                    gravity: { y: 1}
                }
            }
        });

        this.player = null;
        this.unsubscribePlayerCollide = null;
        this.unsubscribeCelebrate = null;
    }

    preload() {
        this.load.tilemapTiledJSON('map', require('../../assets/tilemaps/level.json'));
        this.load.image('kenney-tileset-64px-extruded', require('../../assets/tilesets/kenney-tileset-64px-extruded.png'));

        this.load.image('wooden-plank', require('../../assets/images/wooden-plank.png'));
        this.load.image('block', require('../../assets/images/block.png'));

        this.load.spritesheet('player', require('../../assets/spritesheets/0x72-industrial-player-32px-extruded.png'), {
            frameWidth: 32,
            frameHeight: 32,
            margin: 1,
            spacing: 2
        });

        this.load.atlas('emoji', require('../../assets/atlas/emoji.png'), require('../../assets/atlas/emoji.json'));
    }

    create() {
        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('kenney-tileset-64px-extruded');
        const groundLayer = map.createDynamicLayer('Ground', tileset, 0, 0);
        const lavaLayer = map.createDynamicLayer('Lava', tileset, 0, 0);
        map.createDynamicLayer('Background', tileset, 0, 0);
        map.createDynamicLayer('Foreground', tileset, 0, 0).setDepth(10);

        groundLayer.setCollisionByProperty({ collides: true });
        lavaLayer.setCollisionByProperty({ collides: true });

        this.matter.world.convertTilemapLayer(groundLayer);
        this.matter.world.convertTilemapLayer(lavaLayer);

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.matter.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        const { x, y } = map.findObject('Spawn', obj => obj.name === 'Spawn Point');
        this.player = new Player(this, x, y);

        this.cameras.main.startFollow(this.player.sprite, false, 0.5, 0.5);

        this.unsubscribePlayerCollide = this.matterCollision.addOnCollideStart({
            objectA: this.player.sprite,
            callback: this.onPlayerCollide,
            context: this
        });

        map.getObjectLayer('Crates').objects.forEach(crateObject => {
            const { x, y, width, height } = crateObject;

            this.matter.add
                .image(x + width / 2, y - height / 2, 'block')
                .setBody({ shape: 'rectangle', density: 0.001 });
        });

        map.getObjectLayer('Platform Locations').objects.forEach(point => {
            createRotatingPlatform(this, point.x, point.y);
        });

        const rect = map.findObject('Sensors', obj => obj.name === 'Celebration');
        const celebrateSensor = this.matter.add.rectangle(
            rect.x + rect.width / 2,
            rect.y + rect.height / 2,
            rect.width,
            rect.height,
            {
                isSensor: true,
                isStatic: true
            }
        );
        this.unsubscribeCelebrate = this.matterCollision.addOnCollideStart({
            objectA: this.player.sprite,
            objectB: celebrateSensor,
            callback: this.onPlayerWin,
            context: this
        });
    }

    onPlayerCollide({ gameObjectB }) {
        if (!gameObjectB || !(gameObjectB instanceof Phaser.Tilemaps.Tile)) return;

        const tile = gameObjectB;

        if (tile.properties.isLethal) {
            this.unsubscribePlayerCollide();

            this.player.freeze();
            const cam = this.cameras.main;
            cam.fade(250, 0, 0, 0);
            cam.once('camerafadeoutcomplete', () => this.scene.restart());
        }
    }

    onPlayerWin() {
        this.unsubscribeCelebrate();

        for (let i = 0; i < 35; i++) {
            const x = this.player.sprite.x + Phaser.Math.RND.integerInRange(-50, 50);
            const y = this.player.sprite.y - 150 + Phaser.Math.RND.integerInRange(-10, 10);
            this.matter.add
                .image(x, y, 'emoji', '1f60d', {
                    restitution: 1,
                    friction: 0,
                    density: 0.0001,
                    shape: 'circle'
                })
                .setScale(0.5);
        }
    }

    update() {}
}

export default PhysicsPlatformerScene;
