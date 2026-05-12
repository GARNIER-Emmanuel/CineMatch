# Architecture — CineScroll

## Nouveaux use cases backend (NestJS)

```
src/
└── movies/
    ├── movies.module.ts                    ← ajouter les nouveaux use cases ici
    ├── discover-movies/                    ← existant
    ├── get-cinescroll-movies/              ← NOUVEAU
    │   ├── get-cinescroll-movies.controller.ts
    │   ├── get-cinescroll-movies.controller.spec.ts
    │   ├── get-cinescroll-movies.service.ts
    │   ├── get-cinescroll-movies.service.spec.ts
    │   └── get-cinescroll-movies.dto.ts
    └── get-movie-trailer/                  ← NOUVEAU
        ├── get-movie-trailer.controller.ts
        ├── get-movie-trailer.controller.spec.ts
        ├── get-movie-trailer.service.ts
        ├── get-movie-trailer.service.spec.ts
        └── get-movie-trailer.dto.ts
```

## Nouveaux composants frontend (Angular)

```
src/app/
├── cine-scroll/                           ← NOUVEAU — page principale
│   ├── cine-scroll.component.ts
│   ├── cine-scroll.component.html
│   ├── cine-scroll.component.css
│   └── components/
│       ├── mood-selector/                 ← sélection du mood au lancement
│       │   ├── mood-selector.component.ts
│       │   ├── mood-selector.component.html
│       │   └── mood-selector.component.css
│       └── film-slide/                    ← une slide = un film
│           ├── film-slide.component.ts
│           ├── film-slide.component.html
│           └── film-slide.component.css
└── services/
    └── cine-scroll-profile.service.ts     ← NOUVEAU — gestion affinement session
```

## Nouveaux endpoints backend

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/movies/cinescroll` | 20 films pour CineScroll |
| `GET` | `/movies/trailer/:id` | Clé YouTube du trailer d'un film |

### GET /movies/cinescroll

Paramètres :
| Param | Type | Description |
|---|---|---|
| genres | string | IDs TMDB séparés par virgule (optionnel) |
| excludeGenres | string | IDs à exclure séparés par virgule (optionnel) |
| page | number | Page TMDB (défaut : 1) |

Réponse :
```json
[
  {
    "id": 27205,
    "title": "Inception",
    "overview": "...",
    "releaseYear": "2010",
    "rating": "8.4",
    "poster": "https://image.tmdb.org/t/p/w500/...",
    "backdrop": "https://image.tmdb.org/t/p/w1280/...",
    "genreIds": [878, 28, 12]
  }
]
```

### GET /movies/trailer/:id

Réponse :
```json
{
  "youtubeKey": "dQw4w9WgXcQ",
  "language": "fr",
  "name": "Bande-annonce officielle VF"
}
```

Retourne `null` si aucun trailer trouvé.

## Service Angular — CineScrollProfileService

Gère l'affinement en mémoire de session. Réinitialisé à chaque nouveau lancement.

```typescript
interface SessionProfile {
  likedGenres: Record<number, number>;    // genreId → nombre de likes
  dislikedGenres: Record<number, number>; // genreId → nombre de dislikes
}
```

Méthodes :
- `like(genreIds: number[])` — incrémente les genres likés
- `dislike(genreIds: number[])` — incrémente les genres rejetés
- `getPreferredGenres(): number[]` — genres avec ≥ 2 likes
- `getExcludedGenres(): number[]` — genres avec ≥ 3 dislikes
- `reset()` — réinitialise tout le profil
