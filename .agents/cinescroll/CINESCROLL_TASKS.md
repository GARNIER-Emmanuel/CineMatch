# Tâches Gemini — CineScroll

Lancer ces tâches dans l'ordre, une par une dans Antigravity.
Attendre la validation à chaque étape avant de passer à la suivante.

---

## Tâche 1 — Route et composant CineScroll (Frontend)

```
Contexte : projet CineMatch, frontend Angular.
Ne touche à aucun fichier existant sauf la navbar et le routing.

Crée un nouveau composant Angular standalone `cine-scroll`
accessible via la route `/cinescroll`.

Ajoute un lien "CineScroll" dans la navbar, à droite du lien "Ma Liste".

Le composant affiche pour l'instant uniquement un titre "CineScroll — À venir".

Propose uniquement :
1. La modification du fichier de routing
2. Le composant vide
3. La modification navbar

Attends ma validation avant toute autre modification.
```

---

## Tâche 2 — Mood Selector (Frontend)

```
Contexte : composant `cine-scroll` du projet CineMatch Angular.
Ne touche à aucun autre composant.

Dans `cine-scroll`, crée un sous-composant `mood-selector`.
Il affiche 7 cartes cliquables selon ce mapping (USER_STORIES_CINESCROLL.md) :
😂 Bonne humeur → genres 35,16
😢 Mélancolique → genres 18,10749
😱 Frissons → genres 27,53
🤯 Dépaysement → genres 878,12
❤️ Romantique → genres 10749,18
🧠 Réflexion → genres 18,878
🎲 Aléatoire → aucun filtre

Une seule carte sélectionnable à la fois. Aucune sélection = mode aléatoire.
Un bouton "Lancer CineScroll" toujours actif.
Au clic "Lancer", émettre un EventEmitter avec les genres sélectionnés (ou null).

Propose d'abord le TypeScript, attends validation, puis template, puis CSS.
```

---

## Tâche 3 — Endpoint GET /movies/cinescroll (Backend NestJS — TDD)

```
Contexte : backend NestJS du projet CineMatch.
Architecture : vertical slices, screaming architecture.
Workflow : TDD strict — un scénario à la fois.

Crée le use case `get-cinescroll-movies` dans `src/movies/`.

Endpoint : GET /movies/cinescroll
Paramètres : genres (string, optionnel), excludeGenres (string, optionnel), page (number, défaut 1)
Réponse : tableau de 20 films avec les champs :
  id, title, overview, releaseYear, rating, poster, backdrop, genreIds

Commence par le scénario 1 uniquement :
  Given  GET /movies/cinescroll?genres=28
  When   le service appelle TMDB discover
  Then   retourne 20 films avec les bons champs
  And    status 200

Étapes TDD :
1. Propose uniquement le fichier de test
2. Attends ma validation et mon commit
3. Propose uniquement l'implémentation minimale
4. Attends ma validation et mon commit
5. Passe au scénario suivant
```

---

## Tâche 4 — Endpoint GET /movies/trailer/:id (Backend NestJS — TDD)

```
Contexte : backend NestJS du projet CineMatch.
Workflow : TDD strict — un scénario à la fois.

Crée le use case `get-movie-trailer` dans `src/movies/`.

Endpoint : GET /movies/trailer/:id
Logique :
  1. Appeler TMDB GET /movie/{id}/videos
  2. Filtrer sur type=Trailer et site=YouTube
  3. Priorité : langue fr (VF) puis en (VO)
  4. Retourner { youtubeKey, language, name }
  5. Si aucun trailer : retourner null

Commence par le scénario 1 :
  Given  GET /movies/trailer/27205
  When   TMDB retourne des vidéos avec un trailer VF
  Then   retourner { youtubeKey: "xxx", language: "fr", name: "..." }

TDD : test → commit → implémentation → commit.
Un scénario à la fois, attends ma validation.
```

---

## Tâche 5 — Affichage scroll film par film (Frontend)

```
Contexte : composant `cine-scroll` du projet CineMatch Angular.

Après validation du mood selector, implémenter le scroll vertical film par film.

Chaque slide occupe 100vh et contient :
- En haut à gauche : affiche du film (poster TMDB w500)
- En bas à gauche : titre, synopsis (tronqué à 3 lignes), note arrondie au dixième, plateforme
- À droite : zone vidéo (iframe YouTube en autoplay muted, ou diaporama backdrops si pas de trailer)

Utiliser l'Intersection Observer API pour détecter le film actif.
Quand un slide entre dans le viewport : lancer sa bande-annonce.
Quand il en sort : stopper la bande-annonce.

Propose d'abord le TypeScript, attends validation, puis template, puis CSS.
```

---

## Tâche 6 — Service CineScrollProfile + interactions (Frontend)

```
Contexte : frontend Angular du projet CineMatch.

Crée un service Angular `CineScrollProfileService` (providedIn: 'root').
Il gère le profil d'affinement en mémoire de session uniquement.

Structure interne :
  likedGenres: Record<number, number>    (genreId → compteur)
  dislikedGenres: Record<number, number> (genreId → compteur)

Méthodes :
  like(genreIds: number[]) — incrémente les genres
  dislike(genreIds: number[]) — incrémente les genres rejetés
  getPreferredGenres(): number[] — retourne les genres avec compteur >= 2
  getExcludedGenres(): number[] — retourne les genres avec compteur >= 3
  reset() — réinitialise tout

Dans le composant film-slide, ajouter :
  - Bouton ✚ "Ma Liste" → appelle like() + ajoute le film à la liste en mémoire
  - Bouton ✕ "Pas intéressé" → appelle dislike()
  - Feedback visuel au clic (animation brève)

Après chaque interaction, si getPreferredGenres() ou getExcludedGenres() change,
relancer un appel GET /movies/cinescroll avec les genres mis à jour
et ajouter les nouveaux films à la suite de la liste.

Propose d'abord le service TypeScript, attends validation,
puis l'intégration dans film-slide.
```
