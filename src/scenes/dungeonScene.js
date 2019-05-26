import 'phaser';
import Dungeon from '@mikewesthad/dungeon';
import Player from '../player/dungeonPlayer';
import TILES from '../utils/tile-mapping';
import TilemapVisibility from '../utils/tilemap-visibility';

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
        this.level = 0;
        this.hasPlayerReachedStairs = false;
        this.tilemapVisibility = null;
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
        this.level = this.level + 1;
        this.hasPlayerReachedStairs = false;

        this.dungeon = new Dungeon({
            width: 50,
            height: 50,
            doorPadding: 2,
            rooms: {
                width: { min: 7, max: 15, onlyOdd: true },
                height: { min: 7, max: 15, onlyOdd: true }
            }
        });

        this.dungeon.drawToConsole();

        const map = this.make.tilemap({
            tileWidth: 48,
            tileHeight: 48,
            width: this.dungeon.width,
            height: this.dungeon.height
        });
        const tileset = map.addTilesetImage('tiles', null, 48, 48, 1, 2);
        this.groundLayer = map.createBlankDynamicLayer('Ground', tileset).fill(TILES.BLANK);
        this.stuffLayer = map.createBlankDynamicLayer('Stuff', tileset);
        const shadowLayer = map.createBlankDynamicLayer('Shadow', tileset).fill(TILES.BLANK);

        this.tilemapVisibility = new TilemapVisibility(shadowLayer);

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

        const rooms = this.dungeon.rooms.slice();
        const startRoom = rooms.shift();
        const endRoom = Phaser.Utils.Array.RemoveRandomElement(rooms);
        const otherRooms = Phaser.Utils.Array.Shuffle(rooms).slice(0, rooms.length * 0.9);

        this.stuffLayer.putTileAt(TILES.STAIRS, endRoom.centerX, endRoom.centerY);

        otherRooms.forEach(room => {
            var rand = Math.random();
            if (rand <= 0.25) {
                this.stuffLayer.putTileAt(TILES.CHEST, room.centerX, room.centerY);
            } else if (rand <= 0.5) {
                const x = Phaser.Math.Between(room.left + 2, room.right - 2);
                const y = Phaser.Math.Between(room.top + 2, room.bottom - 2);
                this.stuffLayer.weightedRandomize(x, y, 1, 1, TILES.POT);
            } else {
                if (room.height >= 9) {
                    this.stuffLayer.putTilesAt(TILES.TOWER, room.centerX - 1, room.centerY + 1);
                    this.stuffLayer.putTilesAt(TILES.TOWER, room.centerX + 1, room.centerY + 1);
                    this.stuffLayer.putTilesAt(TILES.TOWER, room.centerX - 1, room.centerY - 2);
                    this.stuffLayer.putTilesAt(TILES.TOWER, room.centerX + 1, room.centerY - 2);
                } else {
                    this.stuffLayer.putTilesAt(TILES.TOWER, room.centerX - 1, room.centerY - 1);
                    this.stuffLayer.putTilesAt(TILES.TOWER, room.centerX + 1, room.centerY - 1);
                }
            }
        });

        this.groundLayer.setCollisionByExclusion([-1, 6, 7, 8, 26]);
        this.stuffLayer.setCollisionByExclusion([-1, 6, 7, 8, 26]);

        this.stuffLayer.setTileIndexCallback(TILES.STAIRS, () => {
            this.stuffLayer.setTileIndexCallback(TILES.STAIRS, null);
            this.hasPlayerReachedStairs = true;
            this.player.freeze();
            const cam = this.cameras.main;
            cam.fade(250, 0, 0, 0);
            cam.once('camerafadeoutcomplete', () => {
                this.player.destroy();
                this.scene.restart();
            });
        });

        const playerRoom = startRoom;
        const x = map.tileToWorldX(playerRoom.centerX);
        const y = map.tileToWorldY(playerRoom.centerY);
        this.player = new Player(this, x, y);

        this.physics.add.collider(this.player.sprite, this.groundLayer);
        this.physics.add.collider(this.player.sprite, this.stuffLayer);

        const camera = this.cameras.main;

        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        camera.startFollow(this.player.sprite);

        this.add
            .text(16, 16, `Find the stairs.  Go deeper. \n CurrentLevel: ${this.level}`, {
                font: '18px monospace',
                fill: '#000000',
                padding: { x: 20, y: 10 },
                backgroundColor: '#FFFFFF'
            })
            .setScrollFactor(0);
    }

    update() {
        if (this.hasPlayerReachedStairs) {
            return;
        }

        this.player.update();

        const playerTileX = this.groundLayer.worldToTileX(this.player.sprite.x);
        const playerTileY = this.groundLayer.worldToTileY(this.player.sprite.y);
        const playerRoom = this.dungeon.getRoomAt(playerTileX, playerTileY);

        this.tilemapVisibility.setActiveRoom(playerRoom);
    }
}

export default DugneonScene;
