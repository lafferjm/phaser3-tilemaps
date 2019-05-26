import MultiKey from '../utils/multi-key';

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

        this.sprite = scene.matter.add.sprite(0, 0, 'player', 0);

        const { Body, Bodies } = Phaser.Physics.Matter.Matter;
        const { width: w, height: h } = this.sprite;
        const mainBody = Bodies.rectangle(0, 0, w * 0.6, h, { chamfer: { radius: 10 }});
        this.sensors = {
            bottom: Bodies.rectangle(0, h * 0.5, w * 0.25, 2, { isSensor: true }),
            left: Bodies.rectangle(-w * 0.35, 0, 2, h * 0.5, { isSensor: true }),
            right: Bodies.rectangle(w * 0.35, 0, 2, h * 0.5, { isSensor: true })
        };
        const compoundBody = Body.create({
            parts: [ mainBody, this.sensors.bottom, this.sensors.left, this.sensors.right],
            frictionStatic: 0,
            frictionAir: 0.02,
            friction: 0.1
        });
        this.sprite
            .setExistingBody(compoundBody)
            .setScale(2)
            .setFixedRotation()
            .setPosition(x, y);

        this.isTouching = { left: false, right: false, ground: false };

        this.canJump = true;
        this.jumpCooldownTimer = null;

        scene.matter.world.on('beforeupdate', this.resetTouching, this);

        scene.matterCollision.addOnCollideStart({
            objectA: [this.sensors.bottom, this.sensors.left, this.sensors.right],
            callback: this.onSensorCollide,
            context: this
        });
        scene.matterCollision.addOnCollideActive({
            objectA: [this.sensors.bottom, this.sensors.left, this.sensors.right],
            callback: this.onSensorCollide,
            context: this
        });

        const { LEFT, RIGHT, UP, A, D, W } = Phaser.Input.Keyboard.KeyCodes;
        this.leftInput= new MultiKey(scene, [LEFT, A]);
        this.rightInput = new MultiKey(scene, [RIGHT, D]);
        this.jumpInput = new MultiKey(scene, [UP, W]);

        this.destroyed = false;
        this.scene.events.on('update', this.update, this);
        this.scene.events.once('shutdown', this.destroy, this);
        this.scene.events.once('destroy', this.destroy, this);
    }

    onSensorCollide({ bodyA, bodyB, pair }) {
        if (bodyB.isSensor) return;
        if (bodyA === this.sensors.left) {
            this.isTouching.left = true;
            if (pair.separation > 0.5) this.sprite.x += pair.separation - 0.5;
        } else if (bodyA === this.sensors.right) {
            this.isTouching.right = true;
            if (pair.spearation > 0.5) this.sprite.x -= pair.separation - 0.5;
        } else if (bodyA === this.sensors.bottom) {
            this.isTouching.ground = true;
        }
    }

    resetTouching() {
        this.isTouching.left = false;
        this.isTouching.right = false;
        this.isTouching.ground = false;
    }

    freeze() {
        this.sprite.setStatic(true);
    }

    update() {
        if (this.destroyed) return;

        const sprite = this.sprite;
        const velocity = sprite.body.velocity;
        const isRightKeyDown = this.rightInput.isDown();
        const isLeftKeyDown = this.leftInput.isDown();
        const isJumpKeyDown = this.jumpInput.isDown();
        const isOnGround = this.isTouching.ground;
        const isInAir = !isOnGround;

        const moveForce = isOnGround ? 0.01 : 0.005;

        if (isLeftKeyDown) {
            sprite.setFlipX(true);

            if (!(isInAir && this.isTouching.left)) {
                sprite.applyForce({ x: -moveForce, y: 0 });
            }
        } else if (isRightKeyDown) {
            sprite.setFlipX(false);

            if (!(isInAir && this.isTouching.right)) {
                sprite.applyForce({ x: moveForce, y: 0});
            }
        }

        if (velocity.x > 7) sprite.setVelocityX(7);
        else if (velocity.x < -7) sprite.setVelocityX(-7);

        if (isJumpKeyDown && this.canJump && isOnGround) {
            sprite.setVelocityY(-11);

            this.canJump = false;
            this.jumpCooldownTimer = this.scene.time.addEvent({
                delay: 250,
                callback: () => (this.canJump = true)
            });
        }

        if (isOnGround) {
            if (sprite.body.force.x !== 0) sprite.anims.play('player-run', true);
            else sprite.anims.play('player-idle', true);
        } else {
            sprite.anims.stop();
            sprite.setTexture('player', 10);
        }
    }

    destroy() {
        this.scene.events.off('update', this.update, this);
        this.scene.events.off('shutdown', this.destroy, this);
        this.scene.events.off('destroy', this.destroy, this);
        if (this.scene.matter.world) {
            this.scene.matter.world.off('beforeupdate', this.resetTouching, this);
        }
        const sensors = [this.sensors.bottom, this.sensors.left, this.sensors.right];
        this.scene.matterCollision.removeOnCollideStart({ objectA: sensors });
        this.scene.matterCollision.removeOnCollideActive({ objectA: sensors });
        if (this.jumpCooldownTimer) this.jumpCooldownTimer.destroy();

        this.destroyed = true;
        this.sprite.destroy();
    }
}

export default Player;
