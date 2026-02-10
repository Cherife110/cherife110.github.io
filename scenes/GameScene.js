/**
 * GameScene - Scène principale du jeu
 * Le joueur se déplace et collecte les cœurs
 */
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.player = null;
        this.hearts = null;
        this.cursors = null;
        this.gameData = null;
        this.collectedHearts = [];
        this.currentColorIndex = 0;
        this.isNarratorActive = false;
    }

    create() {
        const { width, height } = this.cameras.main;

        // Charger les données
        this.gameData = this.cache.json.get('gameData');

        // Créer le fond
        this.createBackground();

        // Créer le groupe de cœurs
        this.hearts = this.physics.add.group();
        this.createHearts();

        // Créer le joueur avec sprite directionnel
        // Vérifier si les sprites personnalisés existent
        if (this.textures.exists('player-down')) {
            // Utiliser les sprites personnalisés
            this.player = this.physics.add.sprite(width / 2, height / 2, 'player-down');
            this.playerDirection = 'down'; // Direction par défaut
        } else {
            // Fallback : utiliser le sprite par défaut (cercle rose)
            this.player = this.physics.add.sprite(width / 2, height / 2, 'player');
            this.playerDirection = null;
        }
        
        // Réduire la taille du personnage
 
        this.player.setScale(0.16);  // ← CHANGEZ CETTE VALEUR pour ajuster la taille
        
        this.player.setCollideWorldBounds(true);

        // Configurer les collisions
        // Overlap pour les cœurs accessibles (collectibles)
        this.physics.add.overlap(this.player, this.hearts, this.collectHeart, this.canCollectHeart, this);
        
        // Collider pour bloquer les cœurs non accessibles
        this.physics.add.collider(this.player, this.hearts);

        // Contrôles
        this.cursors = this.input.keyboard.createCursorKeys();

        // Référence au narrateur HTML
        this.narratorOverlay = document.getElementById('narrator-overlay');
        this.narratorText = document.getElementById('narrator-text');
        this.narratorButton = document.getElementById('narrator-button');
        
        // Gérer le clic sur le bouton OK
        this.narratorButton.addEventListener('click', () => {
            this.hideMessage();
        });

        // Afficher le dialogue d'introduction
        this.time.delayedCall(500, () => {
            this.showDialogue(this.gameData.dialogues.intro);
        });
    }

    createBackground() {
        const { width, height } = this.cameras.main;
        
        // Vérifier si l'image de fond personnalisée existe
        if (this.textures.exists('mapBackground')) {
            // Utiliser l'image personnalisée
            const background = this.add.image(width / 2, height / 2, 'mapBackground');
            
            // Calculer l'échelle pour couvrir tout l'écran sans déformation
            const scaleX = width / background.width;
            const scaleY = height / background.height;
            
            // Utiliser le plus grand scale pour couvrir entièrement (comme background-size: cover en CSS)
            const scale = Math.max(scaleX, scaleY);
            background.setScale(scale);
            
            // Optionnel : réduire légèrement l'opacité pour que les cœurs ressortent mieux
            // background.setAlpha(0.9); // Décommentez cette ligne si besoin
            
            console.log(`Image de fond chargée : ${background.width}x${background.height} pixels`);
            console.log(`Redimensionnée avec un facteur de : ${scale.toFixed(2)}`);
            
        } else {
            // Utiliser le fond par défaut (dégradé)
            const gradient = this.add.graphics();
            gradient.fillGradientStyle(0xFFF8F0, 0xFFF8F0, 0xFFE5E5, 0xFFE5E5, 1, 1, 1, 1);
            gradient.fillRect(0, 0, width, height);

            // Ajouter des formes décoratives
            const decorGraphics = this.add.graphics();
            decorGraphics.fillStyle(0xFFD4D8, 0.2);
            
            for (let i = 0; i < 10; i++) {
                const x = Phaser.Math.Between(0, width);
                const y = Phaser.Math.Between(0, height);
                decorGraphics.fillCircle(x, y, Phaser.Math.Between(30, 80));
            }
        }
    }

    createHearts() {
        this.gameData.hearts.forEach(heartData => {
            const heart = this.hearts.create(heartData.x, heartData.y, `heart_${heartData.color}`);
            heart.setData('heartData', heartData);
            
            // Déterminer si ce cœur est accessible maintenant
            const currentColor = this.gameData.colorSequence[this.currentColorIndex].color;
            const isAccessible = heartData.color === currentColor;
            
            if (isAccessible) {
                // Cœur collectible - pas de physique solide
                heart.body.setAllowGravity(false);
                heart.setAlpha(1); // Opacité normale
            } else {
                // Cœur non accessible - devient un obstacle
                heart.body.setImmovable(true);
                heart.setAlpha(0.4); // Plus transparent pour montrer qu'il n'est pas accessible
            }
            
            // Animation de battement
            this.tweens.add({
                targets: heart,
                scaleX: 1.2,
                scaleY: 1.2,
                duration: 800,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });

            // Animation de rotation légère
            this.tweens.add({
                targets: heart,
                angle: Phaser.Math.Between(-10, 10),
                duration: 1500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
    }

    canCollectHeart(player, heart) {
        const heartData = heart.getData('heartData');
        const currentColor = this.gameData.colorSequence[this.currentColorIndex].color;
        
        // Ne peut collecter que si c'est la bonne couleur
        return heartData.color === currentColor;
    }

    collectHeart(player, heart) {
        const heartData = heart.getData('heartData');
        
        // Collecter le cœur
        this.collectedHearts.push(heartData);
        
        // Effet visuel
        this.tweens.add({
            targets: heart,
            scaleX: 2,
            scaleY: 2,
            alpha: 0,
            duration: 300,
            onComplete: () => {
                heart.destroy();
            }
        });

        // Afficher le mot collecté
        this.showMessage(`"${heartData.word}" 💖`);

        // Vérifier si tous les cœurs de cette couleur sont collectés
        const currentColor = this.gameData.colorSequence[this.currentColorIndex].color;
        this.checkColorCompletion(currentColor);
    }

    checkColorCompletion(color) {
        const totalHeartsOfColor = this.gameData.hearts.filter(h => h.color === color).length;
        const collectedOfColor = this.collectedHearts.filter(h => h.color === color).length;

        if (collectedOfColor === totalHeartsOfColor) {
            // Tous les cœurs de cette couleur sont collectés
            const colorData = this.gameData.colorSequence[this.currentColorIndex];
            
            if (colorData.isFinal) {
                // C'est la couleur finale, lancer la scène finale
                this.time.delayedCall(1000, () => {
                    this.scene.start('FinalScene');
                });
            } else {
                // Afficher le message de cette couleur
                this.time.delayedCall(1000, () => {
                    this.showColorMessage(colorData);
                });
            }
        }
    }

    showColorMessage(colorData) {
        this.isNarratorActive = true;
        this.showMessage(colorData.message, () => {
            // Callback après avoir cliqué sur OK
            // Passer à la couleur suivante
            this.currentColorIndex++;
            
            if (this.currentColorIndex < this.gameData.colorSequence.length) {
                const nextColor = this.gameData.colorSequence[this.currentColorIndex].color;
                this.updateHeartsAccessibility();
                this.showMessage(`Cherche maintenant les cœurs ${this.getColorName(nextColor)} !`);
            }
        });
    }

    updateHeartsAccessibility() {
        // Mettre à jour tous les cœurs restants
        const currentColor = this.gameData.colorSequence[this.currentColorIndex].color;
        
        this.hearts.children.entries.forEach(heart => {
            const heartData = heart.getData('heartData');
            const isAccessible = heartData.color === currentColor;
            
            if (isAccessible) {
                heart.body.setImmovable(false);
                heart.setAlpha(1);
            } else {
                heart.body.setImmovable(true);
                heart.setAlpha(0.4);
            }
        });
    }

    showMessage(message, callback = null) {
        this.isNarratorActive = true;
        this.narratorText.textContent = message;
        this.narratorOverlay.classList.add('visible');
        this.currentMessageCallback = callback;
    }

    hideMessage() {
        this.narratorOverlay.classList.remove('visible');
        this.isNarratorActive = false;
        
        // Exécuter le callback s'il existe
        if (this.currentMessageCallback) {
            const callback = this.currentMessageCallback;
            this.currentMessageCallback = null;
            callback();
        }
    }

    showDialogue(lines) {
        this.isNarratorActive = true;
        let currentLine = 0;

        const showNextLine = () => {
            if (currentLine < lines.length) {
                this.showMessage(lines[currentLine], () => {
                    currentLine++;
                    showNextLine();
                });
            } else {
                this.isNarratorActive = false;
            }
        };

        showNextLine();
    }

    getColorName(color) {
        const names = {
            blue: 'BLEUS 💙',
            green: 'VERTS 💚',
            yellow: 'JAUNES 💛',
            red: 'ROUGES ❤️'
        };
        return names[color] || color;
    }

    update() {
        if (this.isNarratorActive) {
            // Bloquer les mouvements pendant le narrateur
            this.player.setVelocity(0);
            return;
        }

        // Déplacement du joueur
        const speed = 200;
        let moving = false;
        let newDirection = this.playerDirection;

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-speed);
            this.player.setVelocityY(0);
            newDirection = 'left';
            moving = true;
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(speed);
            this.player.setVelocityY(0);
            newDirection = 'right';
            moving = true;
        } else if (this.cursors.up.isDown) {
            this.player.setVelocityY(-speed);
            this.player.setVelocityX(0);
            newDirection = 'up';
            moving = true;
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(speed);
            this.player.setVelocityX(0);
            newDirection = 'down';
            moving = true;
        } else {
            this.player.setVelocity(0);
        }

        // Changer le sprite selon la direction (si les sprites existent)
        if (this.playerDirection !== null && newDirection !== this.playerDirection && moving) {
            this.playerDirection = newDirection;
            
            // Vérifier que la texture existe avant de la changer
            const textureName = `player-${newDirection}`;
            if (this.textures.exists(textureName)) {
                this.player.setTexture(textureName);
            }
        }
    }
}