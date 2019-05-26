import 'phaser';
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';

class PhysicsPlatformerScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'PhysicsPlatformerScene',
            physics: { default: 'matter' },
            plugins: {
                scene: [
                    {
                        plugin: PhaserMatterCollisionPlugin,
                        key: 'matterCollision',
                        mapping: 'matterCollision'
                    }
                ]
            }
        });

    }

    preload() {}

    create() {}

    update() {}
}

export default PhysicsPlatformerScene;
