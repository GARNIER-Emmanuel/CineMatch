# Tâches Gemini — RegeFilms

Lancer ces tâches dans l'ordre, une par une dans Antigravity.
Attendre la validation à chaque étape avant de passer à la suivante.

---

## Tâche 1 — Endpoint GET /movies/letterboxd-picks (Backend NestJS — TDD)

```
Contexte : backend NestJS du projet CineMatch.
Architecture : vertical slices, screaming architecture.
Workflow : TDD strict — un scénario à la fois.

Crée le use case `get-letterboxd-picks` dans `src/movies/`.

Endpoint : GET /movies/letterboxd-picks
Logique :
  1. Parser le flux RSS https://letterboxd.com/reglegorilla/rss/ (utiliser rss-parser)
  2. Pour chaque item, extraire le titre et la note (ex: "★★★★½" -> 4.5)
  3. Enrichir via TMDB (recherche par titre + watch providers France)
  4. Retourner la liste formatée

Commence par le scénario 10.1 uniquement :
  Given  le service appelle le parser RSS
  When   le flux est récupéré
  Then   retourne une liste d'objets avec title, letterboxdRating, watchedDate

Étapes TDD :
1. Propose uniquement le fichier de test (mocker rss-parser)
2. Attends ma validation et mon commit
3. Propose l'implémentation minimale
4. Attends validation
```

---

## Tâche 2 — Enrichissement TMDB et Filtrage (Backend NestJS — TDD)

```
Contexte : use case `get-letterboxd-picks` du projet CineMatch.

Implémenter l'enrichissement TMDB pour chaque film trouvé dans le RSS.
Logique : search/movie (1er résultat) + watch/providers (FR).

Ajouter le support du paramètre `filter` :
- best : note >= 4
- worst : note <= 2
- all : tout (défaut)

TDD : 
1. Test pour l'enrichissement TMDB (mocker axios pour search et providers)
2. Implémentation
3. Test pour le filtrage par note
4. Implémentation
```

---

## Tâche 3 — Mise en cache (Backend NestJS)

```
Contexte : backend NestJS du projet CineMatch.

Ajouter une mise en cache de 1 heure (TTL 3600) pour l'appel au flux RSS
et l'enrichissement TMDB, afin de ne pas saturer les services externes.

Propose l'implémentation (CacheModule ou simple cache service).
```

---

## Tâche 4 — Page RegeFilms (Frontend Angular)

```
Contexte : projet CineMatch, frontend Angular.
Ne touche à aucun fichier existant sauf la navbar et le routing.

Crée un nouveau composant `regefilms` accessible via `/regefilms`.
Il appelle le backend `GET /movies/letterboxd-picks`.

Le composant affiche deux sections :
1. "⭐ Coups de cœur" (films avec letterboxdRating >= 4)
2. "👎 À éviter" (films avec letterboxdRating <= 2)

Utilise un composant de carte dédié `movie-card-rege` pour afficher :
- Poster w500
- Titre + Année
- Note Letterboxd (étoiles) vs Note TMDB
- Plateforme de streaming (badge)

Ajoute un lien "Règle Gorilla" dans la navbar.
Ajoute un lien "Voir son Letterboxd" en haut de la page.

Propose d'abord le TypeScript, attends validation, puis template + CSS.
```
