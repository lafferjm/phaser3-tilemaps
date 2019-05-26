function createRotatingPlatform(scene, x, y, numTiles = 5) {
    const platform = scene.add.tileSprite(x, y, 64 * numTiles, 18, 'wooden-plank');

    scene.matter.add.gameObject(platform, {
        restitution: 0,
        frictionAir: 0,
        friction: 0.2,
        density: 0.0005
    });

    const { Constraint } = Phaser.Physics.Matter.Matter;

    const constraint = Constraint.create({
        pointA: { x: platform.x, y: platform.y },
        bodyB: platform.body,
        length: 0
    });

    scene.matter.world.add(constraint);

    const sign = Math.random() < 0.5 ? -1 : 1;
    const angle = sign * Phaser.Math.Between(15, 25);
    platform.setAngle(angle);
}

export default createRotatingPlatform;
