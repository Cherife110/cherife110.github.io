/**
 * MenuScene - Écran d'accueil du jeu
 * Affiche le titre et un bouton pour commencer
 */
class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        const { width, height } = this.cameras.main;

        // Fond dégradé
        const gradient = this.add.graphics();
        gradient.fillGradientStyle(0xFFD4D8, 0xFFD4D8, 0xFFB3BA, 0xFFB3BA, 1, 1, 1, 1);
        gradient.fillRect(0, 0, width, height);

        // Ajouter des cœurs décoratifs en arrière-plan
        this.addDecorativeHearts();

        // Titre principal
        const title = this.add.text(width / 2, height / 2 - 80, '💖 Pour toi bby 💖', {
            fontSize: '56px',
            fontFamily: 'Playfair Display, serif',
            color: '#c9485b',
            fontStyle: 'bold',
            align: 'center'
        }).setOrigin(0.5);

        // Animation du titre
        this.tweens.add({
            targets: title,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Sous-titre
        const subtitle = this.add.text(width / 2, height / 2, 'Un message spécial t\'attend...', {
            fontSize: '24px',
            fontFamily: 'Cormorant Garamond, serif',
            color: '#ff6b7a',
            align: 'center'
        }).setOrigin(0.5);

        // Bouton Jouer
        const button = this.add.text(width / 2, height / 2 + 100, 'Jouer ❤️', {
            fontSize: '36px',
            fontFamily: 'Playfair Display, serif',
            color: '#ffffff',
            backgroundColor: '#c9485b',
            padding: { x: 40, y: 15 },
            align: 'center'
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        // Arrondir le bouton
        button.setStyle({ 
            ...button.style,
            fixedWidth: 200,
            fixedHeight: 70,
            borderRadius: 35
        });

        // Effet hover
        button.on('pointerover', () => {
            this.tweens.add({
                targets: button,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 200,
                ease: 'Back.easeOut'
            });
        });

        button.on('pointerout', () => {
            this.tweens.add({
                targets: button,
                scaleX: 1,
                scaleY: 1,
                duration: 200,
                ease: 'Back.easeIn'
            });
        });

        // Clic sur le bouton
        button.on('pointerdown', () => {
            this.tweens.add({
                targets: button,
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 100,
                yoyo: true,
                onComplete: () => {
                    this.cameras.main.fadeOut(500, 255, 212, 216);
                    this.time.delayedCall(500, () => {
                        this.scene.start('GameScene');
                    });
                }
            });
        });
    }

    addDecorativeHearts() {
        const { width, height } = this.cameras.main;
        const heartColors = ['blue', 'green', 'yellow', 'red'];

        for (let i = 0; i < 15; i++) {
            const x = Phaser.Math.Between(0, width);
            const y = Phaser.Math.Between(0, height);
            const color = Phaser.Utils.Array.GetRandom(heartColors);
            
            const heart = this.add.sprite(x, y, `heart_${color}`);
            heart.setAlpha(0.15);
            heart.setScale(Phaser.Math.FloatBetween(0.5, 1.5));

            // Animation flottante
            this.tweens.add({
                targets: heart,
                y: y + Phaser.Math.Between(-20, 20),
                duration: Phaser.Math.Between(2000, 4000),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }
}
