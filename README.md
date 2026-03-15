# Landesert

Site statique pour le projet 4L Trophy.

## Développement

Le site est statique (HTML/CSS/JS). Pour le développer en local :

### Option 1 : Python (recommandé)

```bash
python -m http.server 8000
```

Puis ouvrez http://localhost:8000

### Option 2 : VS Code

Installer l'extension "Live Server" et cliquer sur "Go Live".

### Option 3 : Node.js

```bash
npx serve
```

## Mode développeur

Le site dispose d'un mode développeur qui affiche une bannière orange en haut de la page et active certaines fonctionnalités de debug.

Pour l'activer, ouvrez la console du navigateur (F12) et tapez :

```js
toggle_dev()
```

Relancez la commande pour désactiver le mode. Le paramètre est persisté dans le localStorage.

## Structure

- `index.html` - Page principale
- `simulate.html` - Simulateur
- `sponsor.html` - Page sponsor
- `edit-zones.html` - Éditeur de zones
- `css/style.css` - Styles
- `js/` - Scripts JavaScript
- `assets/` - Images, données JSON, modèles 3D
