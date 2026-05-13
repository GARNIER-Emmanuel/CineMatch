# Master Plan — CineScroll (Web & Mobile)

Ce document définit les étapes de développement pour l'expérience CineScroll, intégrant l'algorithme d'affinement en temps réel et les fonctionnalités de conclusion de session.

---

## 🛠️ Phase 1 : Infrastructure & Data (Backend NestJS)

### Tâche 1.1 — Endpoint de découverte enrichi
**Objectif** : Fournir une liste de 20 films avec métadonnées complètes pour le scoring.
- **Scénario** : `GET /movies/cinescroll?genres=28,12`
- **Besoin** : Pour chaque film, récupérer parallèlement le **Réalisateur** et les **5 acteurs principaux** via l'endpoint `/credits` de TMDB.
- **Paramètres** : `excludeGenres` (exclure les genres avec 3+ dislikes).

### Tâche 1.2 — Endpoint Vidéo (Trailers)
**Objectif** : Récupérer la clé YouTube du trailer le plus pertinent.
- **Logique** : Priorité VF (fr), puis VO (en). Filtrer sur `type="Trailer"` et `site="YouTube"`.

---

## 🧠 Phase 2 : Intelligence & Scoring (Frontend)

### Tâche 2.1 — CineScrollProfileService
**Objectif** : Gérer l'apprentissage de la session.
- **Stockage** : `likedGenres`, `dislikedGenres` et `likedPeople`.
- **Calcul** : Méthode `getPreferredGenres()` (seuil 2 likes) et `getExcludedGenres()` (seuil 3 dislikes).

### Tâche 2.2 — Algorithme de tri dynamique (Scoring)
**Objectif** : Trier les films chargés avant présentation.
- **Formule** : `(Poids Genres Likés - Poids Genres Dislikés) + (Bonus Personne Favorie : +2)`.
- **Intégration** : Ré-exécuter le tri à chaque fois que de nouveaux films sont ajoutés à la file.

---

## 📱 Phase 3 : Expérience Utilisateur (UI/UX)

### Tâche 3.1 — Mood Selector & Chrono
- Interface de sélection du "Mood" initial (7 choix).
- Option "Session Rapide" : Sélection d'un timer (2 min, 5 min, 10 min).

### Tâche 3.2 — Interface de Swipe (Mobile focus)
- **Design** : Carte plein écran (100vh).
- **Interactions** : Swipe Droite (Cool) / Swipe Gauche (Bof).
- **Vidéo** : Autoplay en boucle une fois la carte stabilisée. Fallback sur `backdrop` si pas de vidéo.

---

## 🏁 Phase 4 : Conclusion & Conversion

### Tâche 4.1 — La Conclusion Flash (Top 3)
**Objectif** : Conclure la session par le meilleur de ce qui a été vu.
- **Déclencheur** : Fin du chrono ou 20 films vus.
- **Scoring Boosté** : Priorité aux films mis en watchlist (+10) et aux réalisateurs/acteurs favoris (+5).
- **Interface** : Affichage d'un podium avec les 3 meilleures recommandations.

### Tâche 4.2 — Historique & Ma Liste
- Persistance des films ajoutés durant le scroll dans la "Watchlist" globale.
- Ajout des films vus à l'historique général de l'application.
