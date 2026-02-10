# 📁 Dossier Assets

Ce dossier est destiné à contenir vos fichiers multimédias personnalisés.

## 🎵 Musique et Sons

Pour ajouter de la musique de fond :

1. **Téléchargez** une musique libre de droits (ex: sur FreeMusicArchive.org)
2. **Placez** le fichier MP3 ici (ex: `musique-romantique.mp3`)
3. **Modifiez** `scenes/BootScene.js` :

```javascript
preload() {
    // Ajouter cette ligne
    this.load.audio('bgmusic', 'assets/musique-romantique.mp3');
}
```

4. **Démarrez** la musique dans `scenes/MenuScene.js` :

```javascript
create() {
    // Ajouter après le fond
    this.music = this.sound.add('bgmusic', { loop: true, volume: 0.3 });
    this.music.play();
}
```

### Sons recommandés
- **Collecte de cœur** : Son doux "ding" ou carillon
- **Changement de couleur** : Son de notification
- **Scène finale** : Musique triomphale

### Sources de musique libre de droits
- https://freemusicarchive.org
- https://incompetech.com
- https://www.bensound.com
- https://pixabay.com/music

## 🖼️ Images personnalisées

Pour remplacer les cœurs dessinés en code :

1. **Créez** vos images de cœurs (40x40 pixels recommandés)
   - `heart_red.png`
   - `heart_blue.png`
   - `heart_green.png`
   - `heart_yellow.png`
   - `heart_purple.png`

2. **Placez-les** dans ce dossier

3. **Modifiez** `scenes/BootScene.js` :

```javascript
preload() {
    // Remplacer createHeartSprites() par :
    this.load.image('heart_red', 'assets/heart_red.png');
    this.load.image('heart_blue', 'assets/heart_blue.png');
    this.load.image('heart_green', 'assets/heart_green.png');
    this.load.image('heart_yellow', 'assets/heart_yellow.png');
    this.load.image('heart_purple', 'assets/heart_purple.png');
}

// Supprimer la méthode createHeartSprites()
```

### Image du joueur

Pour un sprite personnalisé du joueur :

1. **Créez** `player.png` (32x32 pixels)
2. **Placez-le** ici
3. **Dans BootScene.js**, remplacez la génération du player par :

```javascript
preload() {
    this.load.image('player', 'assets/player.png');
}
```

## 📐 Dimensions recommandées

- **Cœurs** : 40x40 pixels
- **Joueur** : 32x32 pixels
- **Fond** : 800x600 pixels (si vous voulez un fond d'image)

## 🎨 Format des fichiers

- **Images** : PNG avec transparence (recommandé) ou JPG
- **Sons** : MP3 (meilleure compatibilité) ou OGG
- **Musique** : MP3, 128-192kbps suffit

## 💡 Exemples d'assets

### Pack minimal (optionnel)
```
assets/
├── heart_red.png
├── heart_blue.png
├── heart_green.png
├── heart_yellow.png
├── heart_purple.png
├── player.png
├── collect.mp3        (son de collecte)
├── music-menu.mp3     (musique du menu)
└── music-game.mp3     (musique du jeu)
```

### Pack complet (pour aller plus loin)
```
assets/
├── hearts/
│   ├── heart_red.png
│   ├── heart_blue.png
│   └── ...
├── sounds/
│   ├── collect.mp3
│   ├── wrong-color.mp3
│   ├── complete-color.mp3
│   └── victory.mp3
├── music/
│   ├── menu.mp3
│   ├── game.mp3
│   └── final.mp3
└── backgrounds/
    ├── menu-bg.png
    ├── game-bg.png
    └── final-bg.png
```

## 🔧 Tips

- **Optimisez vos images** : utilisez TinyPNG.com pour réduire la taille
- **Préchargez tout** dans BootScene pour éviter les bugs
- **Testez les sons** à faible volume d'abord
- **Vérifiez les droits** : utilisez uniquement de la musique libre

---

**Note** : Le jeu fonctionne parfaitement sans assets ! Les graphiques sont générés en code par défaut.
