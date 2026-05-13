# User Stories : PWA & CineScroll Mobile

Ce document liste les scénarios d'utilisation (Given/When/Then) pour l'adaptation mobile et PWA.

## US1 : Installation PWA
**En tant qu'** utilisateur mobile,
**je veux** pouvoir installer CineMatch sur mon écran d'accueil,
**afin de** lancer CineScroll comme une application native sans barre d'adresse.

*   **Scénario 1.1 : Installation Native (Android/Chrome)**
    *   **Given** l'application est configurée comme PWA.
    *   **When** j'ouvre le site sur Chrome/Android pour la deuxième fois.
    *   **Then** une bannière d'installation native CineMatch s'affiche.

*   **Scénario 1.2 : Installation Manuelle (iOS/Safari)**
    *   **Given** l'application est configurée comme PWA.
    *   **When** j'ouvre le site sur Safari iOS.
    *   **Then** je peux utiliser le bouton "Partager" -> "Sur l'écran d'accueil" pour installer CineMatch.

## US2 : Layout Vertical CineScroll
**En tant qu'** utilisateur sur smartphone,
**je veux** que CineScroll s'affiche verticalement,
**afin de** voir l'affiche et la vidéo sans avoir à tourner mon téléphone.

*   **Scénario 2.1 : Stacking Mobile**
    *   **Given** un écran de largeur ≤ 768px.
    *   **When** j'ouvre CineScroll.
    *   **Then** l'affiche occupe le haut de l'écran et la vidéo est centrée en dessous, sans chevauchement.

## US3 : Ergonomie Tactile
**En tant qu'** utilisateur mobile,
**je veux** des boutons d'action larges et accessibles,
**afin de** ne pas faire de fausses manipulations avec mes doigts.

*   **Scénario 3.1 : Zone de Tap**
    *   **Given** la vue mobile CineScroll.
    *   **Then** les boutons ✚ (Watchlist) et ✕ (Skip) mesurent au moins 44x44px.

## US4 : Lecture Vidéo iOS
**En tant qu'** utilisateur d'iPhone (Safari),
**je veux** pouvoir lancer la bande-annonce même si l'autoplay est bloqué,
**afin de** ne pas avoir un rectangle noir à la place de la vidéo.

*   **Scénario 4.1 : Bouton Play manuel**
    *   **Given** l'autoplay est bloqué par le navigateur.
    *   **When** le film apparaît à l'écran.
    *   **Then** un bouton "Play" central apparaît sur la zone vidéo.
    *   **When** je clique sur ce bouton.
    *   **Then** la vidéo se lance.
