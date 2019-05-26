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
    }

    preload() {}

    create() {}

    update() {}
}

export default MatterIntroScene;
