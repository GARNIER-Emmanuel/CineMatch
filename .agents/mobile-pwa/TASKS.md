# Tasks : Implémentation PWA & Mobile CineScroll

Ce document détaille les tâches à réaliser pour la feature mobile.

## Tâche 1 : Configuration PWA
- [ ] Installer `@angular/pwa` via `ng add`.
- [ ] Configurer `manifest.webmanifest` (Priorité Android) :
    - `name` & `short_name` : "CineMatch"
    - `theme_color` : #05080f
    - `display` : "standalone"
    - `orientation` : "portrait"
    - `start_url` : "/cinescroll"
- [ ] Ajouter la compatibilité iOS dans `index.html` :
    - Balises `<meta name="apple-mobile-web-app-capable" content="yes">`
    - Lien vers `apple-touch-icon.png`
- [ ] Générer les icônes PWA (Android adaptive + iOS fixed).
- [ ] Vérifier `ngsw-config.json` pour la stratégie de cache.

## Tâche 2 : Adaptation Responsive CSS
*Modifier uniquement les fichiers CSS de `cine-scroll` et `film-slide`.*

- [ ] Implémenter le layout vertical pour mobile (≤ 768px).
- [ ] Masquer les éléments Desktop non adaptés.
- [ ] Agrandir les boutons d'action (min 44px).
- [ ] Utiliser des media queries pour préserver le layout Desktop (> 768px).

## Tâche 3 : Fallback Autoplay iOS
*Modification séquentielle du composant `film-slide`.*

- [ ] **TS** : Ajouter la détection d'échec de lecture `isAutoplayBlocked`.
- [ ] **HTML** : Ajouter le bouton "Play" conditionnel sur la zone vidéo.
- [ ] **CSS** : Styler le bouton Play (centré, glassmorphism).

---

## Workflow de validation
1. Validation Tâche 1 (Manifest)
2. Validation Tâche 2 (CSS Layout)
3. Validation Tâche 3 (Fallback iOS - TS d'abord)
