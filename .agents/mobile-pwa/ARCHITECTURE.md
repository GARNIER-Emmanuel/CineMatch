# Architecture : PWA & Optimisation Mobile CineScroll

Ce document définit les choix techniques pour transformer CineMatch en Progressive Web App et adapter l'expérience de scroll vertical sur mobile.

## 1. Stratégie PWA & Compatibilité
- **Priorité Android** : Exploitation maximale du `manifest.webmanifest` pour le Splash Screen automatique, les icônes adaptatives et le bouton d'installation natif (Chrome/Android).
- **Compatibilité iOS** : Ajout manuel des balises `apple-mobile-web-app-capable` et des `apple-touch-icon` pour garantir une expérience similaire sur Safari.
- **Manifest** : Configuration en mode `standalone` et orientation `portrait` forcée pour CineScroll.
- **Start URL** : Redirection directe vers `/cinescroll`.

## 2. Design System & Responsivité
- **Approche** : Mobile-First. Le CSS de base définit le layout vertical (stacking), les media queries `@media (min-width: 768px)` restaurent le layout cinématographique desktop.
- **CineScroll Layout (Mobile)** :
    - Flux vertical : Affiche (Haut) -> Vidéo (Milieu) -> Infos/Actions (Bas).
    - Optimisation "Thumb Zone" : Boutons d'action agrandis (44px+) et placés en bas à droite pour un accès facile au pouce.
- **Performance** : Utilisation de `backdrop-filter: blur` pour les overlays mobiles tout en préservant la fluidité du scroll.

## 3. Gestion du Lecteur Vidéo (iOS Fallback)
- **Problématique** : L'autoplay muted est souvent bloqué sur Safari iOS si le mode "Économie d'énergie" est activé ou selon les réglages utilisateur.
- **Solution** : 
    - Détection via l'API HTML5 Video (échec de la promesse `play()`).
    - État `isAutoplayBlocked` dans le composant `FilmSlide`.
    - Overlay "Play" central pour déclencher l'interaction utilisateur requise par iOS.

## 4. Contraintes de Développement
- **Zéro Logique UI** : Utilisation exclusive du CSS pour les changements de layout.
- **Zéro Backend** : Pas de modifications API requises.
- **Isolation** : Les styles mobiles ne doivent pas impacter le mode Desktop existant.
