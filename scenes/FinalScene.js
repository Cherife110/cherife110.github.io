/**
 * FinalScene - Scène finale avec la question "Veux-tu être ma valentine ?"
 * Affiche les boutons Oui/Non avec interaction spéciale
 */
class FinalScene extends Phaser.Scene {
    constructor() {
        super({ key: 'FinalScene' });
        this.gameData = null;
    }

    create() {
        const { width, height } = this.cameras.main;

        // Charger les données
        this.gameData = this.cache.json.get('gameData');

        // Fond romantique
        const gradient = this.add.graphics();
        gradient.fillGradientStyle(0xFFCCD5, 0xFFCCD5, 0xFFA8B4, 0xFFA8B4, 1, 1, 1, 1);
        gradient.fillRect(0, 0, width, height);

        // Ajouter des cœurs qui tombent en arrière-plan
        this.createFallingHearts();

        // Afficher le message collecté (les mots rouges)
        this.displayCollectedMessage();

        // Afficher la question finale mot par mot
        this.time.delayedCall(2000, () => {
            this.showFinalQuestion();
        });
    }

    displayCollectedMessage() {
        const { width } = this.cameras.main;
        
        // Récupérer tous les mots des cœurs rouges collectés
        const redHearts = this.gameData.hearts.filter(h => h.color === 'red');
        const words = redHearts.map(h => h.word).join(' ');

        const message = this.add.text(width / 2, 100, words, {
            fontSize: '32px',
            fontFamily: 'Cormorant Garamond, serif',
            color: '#c9485b',
            fontStyle: 'italic',
            align: 'center',
            wordWrap: { width: width - 100 }
        }).setOrigin(0.5);

        // Animation d'apparition
        message.setAlpha(0);
        this.tweens.add({
            targets: message,
            alpha: 1,
            duration: 1500,
            ease: 'Power2'
        });
    }

    showFinalQuestion() {
        const { width, height } = this.cameras.main;
        const questionWords = this.gameData.dialogues.finalQuestion;
        
        let currentY = height / 2 - 50;
        let fullQuestion = '';

        questionWords.forEach((word, index) => {
            this.time.delayedCall(index * 400, () => {
                fullQuestion += (index > 0 ? ' ' : '') + word;
                
                // Créer ou mettre à jour le texte de la question
                if (index === 0) {
                    this.questionText = this.add.text(width / 2, currentY, fullQuestion, {
                        fontSize: '48px',
                        fontFamily: 'Playfair Display, serif',
                        color: '#c9485b',
                        fontStyle: 'bold',
                        align: 'center'
                    }).setOrigin(0.5);
                } else {
                    this.questionText.setText(fullQuestion);
                }

                // Après le dernier mot, afficher les boutons
                if (index === questionWords.length - 1) {
                    this.time.delayedCall(800, () => {
                        this.showButtons();
                    });
                }
            });
        });
    }

    showButtons() {
        // Référence aux boutons HTML
        const buttonsContainer = document.getElementById('final-buttons');
        const btnNon = document.getElementById('btn-non');
        const btnOui = document.getElementById('btn-oui');

        // Afficher les boutons
        buttonsContainer.classList.remove('hidden');

        // Gérer le bouton "Non" qui s'échappe
        let escapeCount = 0;
        const maxEscapes = 20;

        const escapeButton = (event) => {
            if (escapeCount >= maxEscapes) return;

            const buttonRect = btnNon.getBoundingClientRect();
            const mouseX = event.clientX;
            const mouseY = event.clientY;

            // Calculer la distance entre la souris et le bouton
            const distance = Math.sqrt(
                Math.pow(mouseX - (buttonRect.left + buttonRect.width / 2), 2) +
                Math.pow(mouseY - (buttonRect.top + buttonRect.height / 2), 2)
            );

            // Si la souris est proche, déplacer le bouton
            if (distance < 150) {
                const newX = Math.random() * (window.innerWidth - 200) - (window.innerWidth / 2 - 100);
                const newY = Math.random() * (window.innerHeight - 100) - (window.innerHeight / 2 - 50);
                
                btnNon.style.left = `${newX}px`;
                btnNon.style.top = `${newY}px`;
                
                escapeCount++;
            }
        };

        document.addEventListener('mousemove', escapeButton);

        // Clic sur "Oui"
        btnOui.onclick = () => {
            document.removeEventListener('mousemove', escapeButton);
            buttonsContainer.classList.add('hidden');
            this.showFinalMessage();
        };

        // Empêcher le clic sur "Non"
        btnNon.onclick = (e) => {
            e.preventDefault();
            // Déplacer plus loin
            const newX = Math.random() * (window.innerWidth - 200) - (window.innerWidth / 2 - 100);
            const newY = Math.random() * (window.innerHeight - 100) - (window.innerHeight / 2 - 50);
            btnNon.style.left = `${newX}px`;
            btnNon.style.top = `${newY}px`;
        };
    }

    showFinalMessage() {
        const finalMessage = document.getElementById('final-message');
        finalMessage.classList.remove('hidden');

        // Lancer des confettis de cœurs
        this.launchHeartConfetti();
    }

    createFallingHearts() {
        const { width, height } = this.cameras.main;
        
        this.time.addEvent({
            delay: 500,
            callback: () => {
                const x = Phaser.Math.Between(0, width);
                const heart = this.add.sprite(x, -50, 'heart_red');
                heart.setAlpha(0.4);
                heart.setScale(Phaser.Math.FloatBetween(0.5, 1.2));

                this.tweens.add({
                    targets: heart,
                    y: height + 50,
                    duration: Phaser.Math.Between(3000, 6000),
                    ease: 'Linear',
                    onComplete: () => {
                        heart.destroy();
                    }
                });

                // Rotation pendant la chute
                this.tweens.add({
                    targets: heart,
                    angle: 360,
                    duration: Phaser.Math.Between(2000, 4000),
                    repeat: -1,
                    ease: 'Linear'
                });
            },
            loop: true
        });
    }

    launchHeartConfetti() {
        const { width, height } = this.cameras.main;
        const colors = ['red', 'blue', 'yellow', 'purple'];

        for (let i = 0; i < 50; i++) {
            this.time.delayedCall(i * 50, () => {
                const x = Phaser.Math.Between(0, width);
                const y = Phaser.Math.Between(0, height);
                const color = Phaser.Utils.Array.GetRandom(colors);
                
                const heart = this.add.sprite(x, y, `heart_${color}`);
                heart.setScale(0);

                this.tweens.add({
                    targets: heart,
                    scaleX: 1.5,
                    scaleY: 1.5,
                    alpha: 0,
                    duration: 1500,
                    ease: 'Power2'
                });

                this.tweens.add({
                    targets: heart,
                    angle: Phaser.Math.Between(-360, 360),
                    duration: 1500,
                    ease: 'Power2'
                });
            });
        }
    }
}
