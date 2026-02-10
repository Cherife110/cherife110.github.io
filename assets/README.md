# 💖 Message du Cœur - Jeu Saint-Valentin

Un jeu 2D romantique en vue du dessus où le joueur collecte des cœurs colorés pour découvrir un message d'amour caché.
# a faire
1. ajouter des colisions
2. ajouter de la musique
3. modifier les boutons, les rendre plus styler
4. modifier la maniere dont les messages s'affichent
5. les autres coeurs doivent etre accessible que quand c'est leur tour sinon il sont des obstale,
et in peut pas passer a travers
6. pour qu'un message s'affiche tous les coeur de la couleur doivent etre ramasser, 
## 🎮 Comment jouer

1. **Lancer le jeu** : Ouvrez `index.html` dans votre navigateur
2. **Déplacement** : Utilisez les **flèches du clavier** (↑ ↓ ← →)
3. **Objectif** : Collectez les cœurs de la couleur indiquée
4. **Attention** : Certaines couleurs sont des pièges ! 😊
5. **But final** : Trouvez le vrai message et répondez à la question finale

## 📁 Structure du projet

```
valentine-game/
├── index.html          # Page principale
├── style.css           # Styles et animations
├── main.js             # Configuration Phaser
├── scenes/             # Scènes du jeu
│   ├── BootScene.js    # Chargement des ressources
│   ├── MenuScene.js    # Menu principal
│   ├── GameScene.js    # Jeu principal
│   └── FinalScene.js   # Scène finale
├── data/
│   └── gameData.json   # Données (cœurs, messages, dialogues)
└── assets/             # (vide - sprites générés en code)
```

## 🎨 Personnalisation

### Modifier les messages

Éditez `data/gameData.json` :

#### 1. Changer les mots des cœurs
```json
{
  "id": "red1",
  "color": "red",
  "word": "Ton mot ici",  // ← Modifier ici
  "x": 300,
  "y": 150
}
```

#### 2. Changer les phrases des couleurs
```json
{
  "color": "blue",
  "message": "Ton message ici",  // ← Modifier ici
  "isTrap": false
}
```

#### 3. Modifier le dialogue d'intro
```json
"intro": [
  "Ton premier message...",
  "Ton deuxième message...",
  "etc."
]
```

#### 4. Changer la question finale
```json
"finalQuestion": [
  "Ta",
  "question",
  "mot",
  "par",
  "mot",
  "?"
]
```

### Modifier les couleurs

Dans `style.css`, changez les variables CSS :
```css
:root {
    --rose-dawn: #ffd4d8;     /* Rose clair */
    --rose-blush: #ffb3ba;    /* Rose moyen */
    --rose-deep: #ff6b7a;     /* Rose vif */
    --rose-wine: #c9485b;     /* Rose foncé */
}
```

### Modifier le message final

Dans `index.html`, section `#final-message` :
```html
<h1 class="final-title">💕 Ton titre ! 💕</h1>
<p class="final-text">Ton message principal</p>
<p class="final-subtext">Ton sous-message</p>
```

### Ajouter des cœurs

Dans `data/gameData.json`, ajoutez des objets dans le tableau `hearts` :
```json
{
  "id": "identifiant_unique",
  "color": "blue|green|yellow|purple|red",
  "word": "Mot à afficher",
  "x": 300,    // Position X (0-800)
  "y": 200     // Position Y (0-600)
}
```

### Changer l'ordre des couleurs

Modifiez `colorSequence` dans `gameData.json`. L'ordre détermine quelle couleur collecter en premier, deuxième, etc.

## 🚀 Hébergement gratuit

### Option 1 : GitHub Pages
1. Créez un dépôt GitHub
2. Uploadez tous les fichiers
3. Activez GitHub Pages dans Settings
4. Votre jeu sera accessible à `username.github.io/nom-du-repo`

### Option 2 : Netlify
1. Créez un compte sur netlify.com
2. Glissez-déposez le dossier du projet
3. Votre jeu est en ligne instantanément !

### Option 3 : Vercel
1. Créez un compte sur vercel.com
2. Importez le projet
3. Déployez en un clic

## 🎵 Ajouter de la musique (optionnel)

1. Ajoutez un fichier MP3 dans le dossier `assets/`
2. Dans `BootScene.js`, ajoutez dans `preload()` :
```javascript
this.load.audio('musique', 'assets/votre-musique.mp3');
```
3. Dans `MenuScene.js` ou `GameScene.js`, ajoutez dans `create()` :
```javascript
this.sound.play('musique', { loop: true, volume: 0.5 });
```

## 🖼️ Ajouter des images personnalisées

Si vous voulez remplacer les cœurs par vos propres images :

1. Placez vos images dans `assets/` (ex: `heart_red.png`)
2. Dans `BootScene.js`, remplacez `createHeartSprites()` par :
```javascript
preload() {
    this.load.image('heart_red', 'assets/heart_red.png');
    this.load.image('heart_blue', 'assets/heart_blue.png');
    // etc.
}
```

## ⚙️ Configuration avancée

### Vitesse du joueur
Dans `GameScene.js`, ligne ~190 :
```javascript
const speed = 200; // Augmentez pour aller plus vite
```

### Taille de la carte
Dans `main.js`, modifiez :
```javascript
width: 800,  // Largeur
height: 600, // Hauteur
```

### Durée des dialogues
Dans `GameScene.js`, méthode `showDialogue()` :
```javascript
this.time.delayedCall(2500, ...) // Durée d'affichage en ms
```

## 🐛 Dépannage

**Le jeu ne se charge pas** : Vérifiez que vous avez une connexion Internet (pour charger Phaser depuis le CDN)

**Les cœurs ne s'affichent pas** : Vérifiez le fichier `gameData.json` pour les erreurs de syntaxe

**Les boutons ne fonctionnent pas** : Assurez-vous que les IDs dans `index.html` correspondent à ceux utilisés dans le code JavaScript

**Erreur de module** : Si vous testez en local, utilisez un serveur HTTP local :
```bash
# Python 3
python -m http.server 8000

# Ou utilisez l'extension "Live Server" dans VSCode
```

## 💡 Idées d'amélioration

- Ajouter des effets sonores à la collecte
- Créer plusieurs niveaux
- Ajouter des obstacles sur la carte
- Créer un système de timer
- Ajouter des animations plus complexes
- Intégrer une vraie musique de fond
- Ajouter un compteur de cœurs collectés

## 📝 Licence

Libre d'utilisation pour usage personnel. Fait avec ❤️ pour la Saint-Valentin !

---

**Bon jeu et bonne Saint-Valentin ! 💖**
