/**
 * main.js - Point d'entrée du jeu
 * Configure Phaser et lance toutes les scènes
 */

// Configuration de Phaser
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#fff8f0',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [BootScene, MenuScene, GameScene, FinalScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

// Créer le jeu
const game = new Phaser.Game(config);

// Message de bienvenue dans la console
console.log('💖 Jeu chargé avec succès !');
console.log('🎮 Utilise les flèches du clavier pour te déplacer');
console.log(' Collecte les cœurs de la bonne couleur pour découvrir le message...');
