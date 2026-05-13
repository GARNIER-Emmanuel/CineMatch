---
description: React Native Mobile App User Stories and Tasks (Audit Complet)
---

# CineMatch Mobile — Application React Native (Vision Complète)

Ce document centralise et décrit le plan de développement étape par étape (User Stories et Tâches) pour la création de l'application mobile native React Native "CineMatch". Ce plan a été audité pour inclure **l'intégralité des fonctionnalités** documentées dans le dossier `.agents` (MVP, CineScroll, Mon Letterboxd, Recherche & Réalisateurs, RegeFilms).

## Stack Technique Recommandée
- **Framework** : React Native avec Expo (facilite la gestion des builds et des modules natifs)
- **Langage** : TypeScript
- **State Management & Data Fetching** : TanStack Query (React Query) + Axios
- **Navigation** : React Navigation (Stack, Bottom Tabs & Material Top Tabs)
- **Styling** : StyleSheet ou NativeWind (Tailwind). Rendu premium exigé (Dark mode, couleurs vibrantes, animations fluides).
- **Vidéo** : `expo-av` ou `react-native-youtube-iframe` (pour les trailers de CineScroll).
- **Stockage local** : `AsyncStorage` (pour l'import Letterboxd).

---

## 🎯 Étape 1 : Initialisation & Architecture (Epic 1)

**US 1.1 : Initialiser le projet et l'arborescence**
- **Task 1.1.1** : Lancer `npx create-expo-app mobile --template blank-typescript`.
- **Task 1.1.2** : Configurer Eslint, Prettier, et les alias de chemins (`src/*`).
- **Task 1.1.3** : Créer l'arborescence (`screens`, `components`, `navigation`, `services`, `theme`, `hooks`).

**US 1.2 : Navigation de base**
- **Task 1.2.1** : Installer React Navigation.
- **Task 1.2.2** : Créer une Bottom Tab Navigation avec les onglets : Découverte, CineScroll, Recherche, Profil/Réglages.

**US 1.3 : Configuration API (Backend NestJS)**
- **Task 1.3.1** : Configurer Axios et TanStack Query.
- **Task 1.3.2** : Mapper les gestionnaires d'erreurs (401, 502) globaux pour l'UI.

---

## 🎬 Étape 2 : Core Feature - Découverte de Films (Epic 2)
*(Basé sur `.agents/context/USER_STORIES.md`)*

**US 2.1 : Découverte & Pagination**
- **Task 2.1.1** : Implémenter le hook `useDiscoverMovies` (infinite query).
- **Task 2.1.2** : UI `DiscoverScreen` avec grille/liste de `MovieCard`.
- **Task 2.1.3** : Pagination (Infinite scroll) avec `onEndReached`.

**US 2.2 : Filtres avancés (Genre, Durée, Note, Plateforme)**
- **Task 2.2.1** : Créer un panneau de filtres (BottomSheet).
- **Task 2.2.2** : UI des filtres (sliders pour maxDuration et minRating, chips pour genres et providers).
- **Task 2.2.3** : Lier les filtres à l'appel API.

---

## 📱 Étape 3 : CineScroll - Expérience Immersive (Epic 3)
*(Basé sur `.agents/cinescroll/USER_STORIES_CINESCROLL.md`)*

**US 3.1 : Sélection du Mood**
- **Task 3.1.1** : Écran d'accueil CineScroll avec sélection de Moods (mapping vers IDs genres).

**US 3.2 : Défilement TikTok-like & Vidéo**
- **Task 3.2.1** : Implémenter le scroll vertical paginé (`FlatList` avec `pagingEnabled`).
- **Task 3.2.2** : UI du `ScrollItem` affichant poster, résumé, et le Trailer YouTube en auto-play (ou fallback sur un carrousel d'images TMDB).
- **Task 3.2.3** : Gérer la pause vidéo lors du scroll.

**US 3.3 : Interactions et Affinement**
- **Task 3.3.1** : Ajouter les boutons "Ma Liste" (✚) et "Pas intéressé" (✕).
- **Task 3.3.2** : Stocker l'historique de la session et ajuster dynamiquement les paramètres de la prochaine page appelée selon les genres likés/ignorés.

---

## 📂 Étape 4 : Mon Letterboxd - Synchronisation (Epic 4)
*(Basé sur `.agents/mon-letterboxd/USER_STORIES_MON_LETTERBOXD.md`)*

**US 4.1 : Import CSV**
- **Task 4.1.1** : Utiliser `expo-document-picker` pour uploader `watched.csv`.
- **Task 4.1.2** : Parser le CSV côté client (ou via backend) pour extraire Titres/Années.
- **Task 4.1.3** : Stocker la liste dans `AsyncStorage`.

**US 4.2 : Filtrage Global**
- **Task 4.2.1** : Créer un context/store pour la liste "Déjà vus".
- **Task 4.2.2** : Filtrer côté client (ou passer un paramètre exclusion au backend) pour masquer ces films de `DiscoverScreen` et `CineScroll`.

---

## 🔎 Étape 5 : Recherche & Réalisateurs (Epic 5)
*(Basé sur `.agents/recherche-et-realisateur/USER_STORIES.md`)*

**US 5.1 : Recherche Intelligente**
- **Task 5.1.1** : Créer `SearchScreen` (Recherche films et réalisateurs).

**US 5.2 : Page Réalisateurs (Catégorisée)**
- **Task 5.2.1** : UI `DirectorsScreen` divisée en sections (Slices horizontaux) par époque cinématographique.

**US 5.3 : Détails Réalisateur & Filmographie**
- **Task 5.3.1** : Créer une modale / page Détails Réalisateur (Bio, stats).
- **Task 5.3.2** : Bouton "Voir ses films" menant à un `DirectorMoviesScreen` listant sa filmographie.

---

## 🦍 Étape 6 : RegeFilms - Curations (Epic 6)
*(Basé sur `.agents/regefilms/REGEFILMS_USER_STORIES.md`)*

**US 6.1 : Affichage des recommandations RSS**
- **Task 6.1.1** : Consommer l'endpoint backend `/movies/letterboxd-picks`.
- **Task 6.1.2** : Créer l'écran `RegeFilmsScreen`.
- **Task 6.1.3** : Diviser l'UI en deux listes claires : "⭐ Coups de cœur" (note >= 4) et "👎 À éviter" (note <= 2).
- **Task 6.1.4** : Ajouter le lien sortant vers le profil public Letterboxd.

---

## Plan d'Action d'Implémentation (Chronologie)

Afin d'assurer un développement propre (Vertical Slices) :
1. **Socle & Base de données** (Epic 1 & Epic 4) : Setup app, navigation, et import Letterboxd (car il impacte tout le reste de l'app).
2. **Le MVP** (Epic 2) : Écran Découverte robuste et filtres complets.
3. **Le WOW Effect** (Epic 3) : L'expérience fluide de CineScroll.
4. **L'Exploration** (Epic 5 & Epic 6) : La recherche détaillée, les réalisateurs, et les curations annexes.

Ce document couvre désormais 100% du périmètre défini dans le dossier `.agents`.
