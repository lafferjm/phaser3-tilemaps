import 'phaser';
import Dungeon from '@mikewesthad/dungeon';
import Player from '../player/dungeonPlayer';
import TILES from '../utils/tile-mapping';

class DugneonScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'DungeonScene',
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 }
                }
            }
        });

        this.dungeon = null;
        this.groundLayer = null;
        this.stuffLayer = null;
    }

    preload() {
        this.load.image('tiles', require('../../assets/tilesets/buch-tileset-48px-extruded.png'));
        this.load.spritesheet('characters', require('../../assets/spritesheets/buch-characters-64px-extruded.png'),
        {
            frameWidth: 64,
            frameHeight: 64,
            margin: 1,
            spacing: 2
        });
    }

    create() {
        this.dungeon = new Dungeon({
            width: 50,
            height: 50,
            doorPadding: 2,
            rooms: {
                width: { min: 7, max: 15, onlyOdd: true },
                height: { min: 7, max: 15, onlyOdd: true }
            }
        });

        const map = this.make.tilemap({
            tileWidth: 48,
            tileHeight: 48,
            width: this.dungeon.width,
            height: this.dungeon.height
        });
        const tileset = map.addTilesetImage('tiles', null, 48, 48, 1, 2);
        this.groundLayer = map.createBlankDynamicLayer('Ground', tileset);
        this.stuffLayer = map.createBlankDynamicLayer('Stuff', tileset);

        this.groundLayer.fill(TILES.BLANK);

        this.dungeon.rooms.forEach(room => {
            const { x, y, width, height, left, right, top, bottom } = room;

            this.groundLayer.weightedRandomize(x + 1, y + 1, width - 2, height - 2, TILES.FLOOR);

            this.groundLayer.putTileAt(TILES.WALL.TOP_LEFT, left, top);
            this.groundLayer.putTileAt(TILES.WALL.TOP_RIGHT, right, top);
            this.groundLayer.putTileAt(TILES.WALL.BOTTOM_RIGHT, right, bottom);
            this.groundLayer.putTileAt(TILES.WALL.BOTTOM_LEFT, left, bottom);

            this.groundLayer.weightedRandomize(left + 1, top, width - 2, 1, TILES.WALL.TOP);
            this.groundLayer.weightedRandomize(left + 1, bottom, width - 2, 1, TILES.WALL.BOTTOM);
            this.groundLayer.weightedRandomize(left, top + 1, 1, height - 2, TILES.WALL.LEFT);
            this.groundLayer.weightedRandomize(right, top + 1, 1, height - 2, TILES.WALL.RIGHT);

            room.getDoorLocations().forEach(door => {
                if (door.y === 0) {
                    this.groundLayer.putTilesAt(TILES.DOOR.TOP, x + door.x - 1, y + door.y);
                } else if (door.y === room.height - 1) {
                    this.groundLayer.putTilesAt(TILES.DOOR.BOTTOM, x + door.x - 1, y + door.y);
                } else if (door.x === 0) {
                    this.groundLayer.putTilesAt(TILES.DOOR.LEFT, x + door.x, y + door.y - 1);
                } else if (door.x === room.width - 1) {
                    this.groundLayer.putTilesAt(TILES.DOOR.RIGHT, x + door.x, y + door.y - 1);
                }
            });
        });

        this.groundLayer.setCollisionByExclusion([-1, 6, 7, 8, 26]);

        this.player = new Player(this, map.widthInPixels / 2, map.heightInPixels / 2);

        this.physics.add.collider(this.player.sprite, this.groundLayer);

        const camera = this.cameras.main;

        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        camera.startFollow(this.player.sprite);
    }

    update() {
        this.player.update();
    }
}

export default DugneonScene;
