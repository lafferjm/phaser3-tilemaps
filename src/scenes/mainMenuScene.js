import 'phaser';

const textColor = '#FFF';
const textHoverColor = '#FF0';

class MainMenuScene extends Phaser.Scene {
    constructor() {
        super('MainMenuScene');

        this.titleText = null;
        this.menuOptions = {
            'Tile Map With Camera': 'TileMapWithCameraScene',
            'Tile Map With Player': 'TileMapWithPlayerScene',
            'Simple Platformer': 'SimplePlatformerScene',
            'Platformer': 'PlatformerScene',
            'Drawing Platformer': 'DrawingTilePlatformerScene'
        };
    }

    preload() {}

    create() {
        this.cameras.main.setBackgroundColor('#6495ed');
        this.titleText = this.add.text(0, 16, 'TileMap Examples', {
            fontSize: '32px',
            fill: textColor
        }).setInteractive().setOrigin(0.5).setX(400);
        
        Object.keys(this.menuOptions).forEach((menuItem, index) => {
            const button = this.add.text(0, index * 64 + 64, menuItem, {
                fontSize: '20px',
                fill: '#FFF'
            });

            button.setOrigin(0.5);
            button.setX(400);
            button.setInteractive();
            
            button.on('pointerover', () => {
                button.setFill(textHoverColor);
            });
            button.on('pointerout', () => {
                button.setFill(textColor);
            });
            button.on('pointerdown', () => {
                this.scene.start(this.menuOptions[menuItem]);
            });
        });
    }

    update() {}

}

export default MainMenuScene;
