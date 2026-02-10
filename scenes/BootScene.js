/**
 * BootScene - Scène de chargement des ressources
 * Charge les données JSON et prépare les assets
 */
class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Afficher un texte de chargement
        const loadingText = this.add.text(400, 300, 'Chargement...', {
            fontSize: '32px',
            fontFamily: 'Cormorant Garamond, serif',
            color: '#c9485b'
        }).setOrigin(0.5);

        // Charger les données du jeu
        this.load.json('gameData', 'data/gameData.json');
        
        // Charger l'image de fond personnalisée
        // Si le fichier n'existe pas, le jeu utilisera un fond par défaut
        this.load.image('mapBackground', 'assets/map-background.png');
        
        // Charger les sprites du joueur (4 directions)
        this.load.image('player-up', 'assets/player-up.png');
        this.load.image('player-down', 'assets/player-down.png');
        this.load.image('player-left', 'assets/player-left.png');
        this.load.image('player-right', 'assets/player-right.png');

        // Créer les sprites de cœurs en code (pas besoin d'images)
        this.createHeartSprites();
    }

    createHeartSprites() {
        // Créer des graphiques pour chaque couleur de cœur
        const colors = {
            blue: 0x4A90E2,
            green: 0x50C878,
            yellow: 0xFFD700,
            red: 0xFF6B7A
        };

        Object.entries(colors).forEach(([name, color]) => {
            const graphics = this.make.graphics({ x: 0, y: 0, add: false });
            
            // Dessiner un cœur simple avec des cercles et un triangle
            graphics.fillStyle(color, 1);
            
            // Deux cercles en haut pour former le haut du cœur
            graphics.fillCircle(14, 14, 7);
            graphics.fillCircle(26, 14, 7);
            
            // Triangle pour le bas du cœur
            graphics.fillTriangle(
                8, 16,   // coin gauche
                32, 16,  // coin droit  
                20, 32   // pointe du bas
            );
            
            // Rectangle pour remplir le milieu
            graphics.fillRect(8, 14, 24, 8);

            // Contour blanc pour rendre plus joli
            graphics.lineStyle(2, 0xFFFFFF, 0.6);
            graphics.strokeCircle(14, 14, 7);
            graphics.strokeCircle(26, 14, 7);

            // Générer la texture
            graphics.generateTexture(`heart_${name}`, 40, 40);
            graphics.destroy();
        });

        // Créer le sprite du joueur (simple cercle)
        const playerGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        playerGraphics.fillStyle(0xFFB3BA, 1);
        playerGraphics.fillCircle(16, 16, 14);
        playerGraphics.lineStyle(2, 0xFFFFFF, 1);
        playerGraphics.strokeCircle(16, 16, 14);
        playerGraphics.generateTexture('player', 32, 32);
        playerGraphics.destroy();
    }

    create() {
        // Passer à la scène de menu
        this.scene.start('MenuScene');
    }
}