# CineMatch - Architecture Technique

Ce document décrit l'architecture globale du projet CineMatch, incluant le backend, le mobile et les règles d'intégration des différentes features.

---

## 🏗️ Structure Globale

Le projet est divisé en deux parties principales :
- **Backend** : API NestJS (Node.js) utilisant l'API TMDB comme source de données.
- **Mobile** : Application React Native / Expo (PWA ready) pour l'expérience utilisateur.

---

## 🛠️ Backend (NestJS)

### Architecture
- **Screaming Architecture** : Les dossiers sont organisés par domaine métier (ex: `src/movies`, `src/directors`).
- **Vertical Slices** : Chaque fonctionnalité contient son propre module, contrôleur, service et DTO.
- **TDD** : Tous les endpoints sont testés (`.spec.ts`) avant leur implémentation.

### Endpoints Principaux
- `GET /movies/discover` : Liste de films filtrable.
- `GET /movies/cinescroll` : Sélection optimisée pour le swipe.
- `GET /movies/trailer/:id` : Récupération des trailers YouTube.
- `GET /movies/letterboxd-picks` : Flux RSS RegeFilms enrichi.
- `GET /movies/:id/providers` : Plateformes de streaming disponibles.
- `GET /movies/:id/images` : Galerie d'images et backdrops.
- `GET /movies/:id/credits` : Récupération du réalisateur et du casting.
- `GET /search` : Recherche globale (Films & Personnes).

---

## 📱 Mobile (React Native / Expo)

### Principes UI/UX
- **Design Premium** : Thème sombre, glassmorphism, et typographie moderne (Inter/Outfit).
- **CineScroll** : Interface de découverte basée sur le geste (Swipe).
- **Modales** : Utilisation de modales partagées pour les détails des films et des réalisateurs.

### Services de Données Persistants
- **WatchlistService** : Gestion de "Ma Liste" via `localStorage` (clé `cinematch_watchlist`).
- **HistoryService** : Stockage des 10 derniers films consultés (`cinematch_history`).
- **WatchedFilmsService** : Filtrage des films déjà vus (Import Letterboxd).

### Composants UI Fondamentaux
- **Hero** : Bannière dynamique de mise en avant sur la Home.
- **MovieRow** : Rangées thématiques de films défilantes.
- **Pagination** : Système de navigation par pages pour les listes volumineuses.

### Technologies Clés
- **React Navigation** : Gestion des onglets et de la stack de navigation.
- **TanStack Query** : Mise en cache et gestion des appels API.
- **Lucide React Native** : Bibliothèque d'icônes.
- **Reanimated & Gesture Handler** : Moteur d'interactions fluides.

---

## 🧩 Features Spécifiques

### Mon Letterboxd (Import CSV)
- **Côté Client uniquement** : Le parsing du CSV Letterboxd se fait dans le navigateur/app.
- **Stockage** : `localStorage` pour persister la liste des films vus.
- **Filtrage** : Intersection entre les résultats API et la liste locale pour masquer les contenus déjà vus.

### RegeFilms
- **RSS Parser** : Extraction des notes de Règle Gorilla.
- **Enrichissement** : Le backend fait le pont entre le flux RSS et les données visuelles de TMDB.

### CineScroll Algorithm
- **Session-based Profile** : Affinement des résultats en fonction des likes/dislikes durant la session active.
- **Dynamic Filtering** : Exclusion des genres rejetés en temps réel.
