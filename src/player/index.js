import 'Phaser';

class Player {
    constructor(scene, x, y) {
        this.scene = scene;

        const anims = scene.anims;
        anims.create({
            key: 'player-idle',
            frames: anims.generateFrameNumbers('player', {
                start: 0,
                end: 3
            }),
            frameRate: 3,
            repeat: -1
        });
        anims.create({
            key: 'player-run',
            frames: anims.generateFrameNumbers('player', {
                start: 8,
                end: 15
            }),
            frameRate: 12,
            repeat: -1
        });

        this.sprite = scene.physics.add.sprite(x, y, 'player', 0)
            .setDrag(1000, 0)
            .setMaxVelocity(300, 400);

        const { LEFT, RIGHT, UP, W, A, D } = Phaser.Input.Keyboard.KeyCodes;
        this.keys = scene.input.keyboard.addKeys({
            left: LEFT,
            right: RIGHT,
            up: UP,
            w: W,
            a: A,
            d: D
        });
    }

    update() {
        const keys = this.keys;
        const sprite = this.sprite;
        const onGround = sprite.body.blocked.down;
        const acceleration = onGround ? 600 : 200;

        if (keys.left.isDown || keys.a.isDown) {
            sprite.setAccelerationX(-acceleration);
            sprite.setFlipX(true);
        } else if (keys.right.isDown || keys.d.isDown) {
            sprite.setAccelerationX(acceleration);
            sprite.setFlipX(false);
        } else {
            sprite.setAccelerationX(0);
        }

        if (onGround && (keys.up.isDown || keys.w.isDown)) {
            sprite.setVelocityY(-500);
        }

        if (onGround) {
            if (sprite.body.velocity.x !== 0) {
                sprite.anims.play('player-run', true);
            } else {
                sprite.anims.play('player-idle', true);
            }
        } else {
            sprite.anims.stop();
            sprite.setTexture('player', 10);
        }
    }

    destroy() {
        this.sprite.destroy();
    }
}

export default Player;
