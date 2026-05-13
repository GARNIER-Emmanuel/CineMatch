# User Stories — RegeFilms

## Ordre de développement recommandé (TDD)

| Priorité | US | Scénario | Description |
|---|---|---|---|
| 1 | US10 | 10.1 | Parser le RSS Letterboxd avec succès |
| 2 | US10 | 10.2 | Enrichir un film avec les données TMDB |
| 3 | US10 | 10.3 | Gérer l'absence de correspondance TMDB |
| 4 | US11 | 11.1 | Filtrer par note (best/worst) |
| 5 | US11 | 11.2 | Mise en cache des résultats |
| 6 | US12 | 12.1 | Affichage des deux sections (Coups de cœur / À éviter) |
| 7 | US12 | 12.2 | Lien vers le profil Letterboxd |

---

## US10 — Récupérer les notes de Règle Gorilla

**En tant que** cinéphile,
**Je veux** voir les derniers films notés par Règle Gorilla sur Letterboxd,
**Afin de** bénéficier de ses recommandations directement dans CineMatch.

### Scénario 10.1 — Parsing du flux RSS
```
Given  l'endpoint GET /movies/letterboxd-picks est appelé
When   le service récupère le flux RSS de https://letterboxd.com/reglegorilla/rss/
Then   il extrait une liste d'objets contenant : titre du film, note (/5), date de visionnage
```

### Scénario 10.2 — Enrichissement TMDB
```
Given  une liste de films extraits du RSS
When   le système cherche chaque titre sur l'API TMDB
Then   il récupère le poster, le synopsis, l'année et la note TMDB
And    il récupère la plateforme de streaming disponible en France (via watch/providers)
```

### Scénario 10.3 — Film introuvable sur TMDB
```
Given  un film présent dans le RSS mais introuvable sur TMDB
When   l'enrichissement est tenté
Then   le film est ignoré de la liste finale (pour garantir une UI premium)
```

---

## US11 — Filtrage et Performance

**En tant que** développeur,
**Je veux** optimiser les appels et permettre le filtrage,
**Afin d'** offrir une expérience fluide et respectueuse des APIs tierces.

### Scénario 11.1 — Filtrage par note
```
Given  l'utilisateur appelle GET /movies/letterboxd-picks?filter=best
When   la liste est récupérée
Then   ne retourner que les films ayant une note Letterboxd ≥ 4
```

### Scénario 11.2 — Mise en cache
```
Given  plusieurs appels successifs à l'endpoint
When   le premier appel a été effectué il y a moins d'une heure
Then   le backend retourne la version en cache sans re-parser le RSS ni re-solliciter TMDB
```

---

## US12 — Interface "Vu par Règle Gorilla"

**En tant que** utilisateur de CineMatch,
**Je veux** une page dédiée claire et visuelle,
**Afin de** distinguer rapidement les recommandations des films à éviter.

### Scénario 12.1 — Organisation en sections
```
Given  la page RegeFilms est ouverte
When   les données sont chargées
Then   afficher deux colonnes ou sections distinctes :
       - "⭐ Coups de cœur" (films notés ≥ 4)
       - "👎 À éviter" (films notés ≤ 2)
```

### Scénario 12.2 — Lien externe
```
Given  l'utilisateur consulte la page
When   il voit le bandeau d'en-tête
Then   un bouton "Voir sa page Letterboxd" redirige vers https://letterboxd.com/reglegorilla/
```
