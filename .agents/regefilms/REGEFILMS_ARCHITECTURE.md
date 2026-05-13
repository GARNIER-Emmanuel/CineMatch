# Architecture — RegeFilms (Règle Gorilla Picks)

## Nouveaux use cases backend (NestJS)

```
src/
└── movies/
    └── get-letterboxd-picks/              ← NOUVEAU
        ├── get-letterboxd-picks.controller.ts
        ├── get-letterboxd-picks.controller.spec.ts
        ├── get-letterboxd-picks.service.ts
        ├── get-letterboxd-picks.service.spec.ts
        └── get-letterboxd-picks.dto.ts
```

## Nouveaux composants frontend (Angular)

```
src/app/
└── features/
    └── regefilms/                           ← NOUVEAU
        ├── regefilms.component.ts
        ├── regefilms.component.html
        ├── regefilms.component.css
        └── components/
            └── movie-card-rege/             ← Carte spécifique pour cette vue
                ├── movie-card-rege.component.ts
                ├── movie-card-rege.component.html
                └── movie-card-rege.component.css
```

## Nouveaux endpoints backend

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/movies/letterboxd-picks` | Films notés par Règle Gorilla (enrichis TMDB) |

### GET /movies/letterboxd-picks

Paramètres :
| Param | Type | Description |
|---|---|---|
| filter | string | `best` (≥ 4), `worst` (≤ 2), ou `all` (défaut) |

Réponse :
```json
[
  {
    "letterboxdRating": 4.5,
    "watchedDate": "2024-11-10",
    "tmdbId": 27205,
    "title": "Inception",
    "overview": "...",
    "releaseYear": "2010",
    "tmdbRating": "8.4",
    "poster": "https://image.tmdb.org/t/p/w500/...",
    "platform": "Netflix"
  }
]
```

## Logique Backend (Service)

1.  **Extraction RSS** : Utiliser `rss-parser` sur `https://letterboxd.com/reglegorilla/rss/`.
    - Le titre du film et la note sont dans les items du flux.
2.  **Enrichissement TMDB** :
    - Pour chaque item, extraire le titre.
    - Appeler `GET /search/movie?query=<titre>`.
    - Prendre le premier résultat pour récupérer l'ID, le synopsis, le poster, etc.
    - Appeler `GET /movie/{id}/watch/providers` pour la plateforme (France).
3.  **Mise en cache** :
    - TTL de 1 heure pour la liste complète.
    - Utiliser `CacheModule` de NestJS ou une simple variable en mémoire si non configuré.

## Logique Frontend

- **Page RegeFilms** :
    - Appelle le backend au chargement.
    - Trie les films en deux colonnes/sections : "⭐ Coups de cœur" et "👎 À éviter".
    - Affiche un lien externe vers le profil Letterboxd.
