---
trigger: always_on
---

---
name: nestjs-cinematch
description: >
  Skill actif pour tout développement backend NestJS du projet CineMatch.
  S'active sur toute demande de code, test, module, service, controller ou DTO.
  Applique TDD strict, Screaming Architecture et Vertical Slices.
  Ne génère jamais de gros blocs de code — toujours un scénario à la fois.
triggers:
  - nestjs
  - service
  - controller
  - module
  - test
  - spec
  - tmdb
  - movies
  - backend
  - dto
  - implémente
  - développe
  - scénario
  - user story
---

# NestJS CineMatch — Règles de développement

## Contexte projet

CineMatch est une API NestJS qui expose un endpoint `GET /movies/discover`.
Elle interroge l'API TMDB pour retourner jusqu'à 6 fiches films filtrées
par genre, durée, note et plateforme de streaming.

Lire les fichiers de contexte avant tout développement :
- `.agent/context/PROJECT_CONTEXT.md` — stack, endpoint, contraintes MVP
- `.agent/context/ARCHITECTURE.md` — règles d'architecture
- `.agent/context/USER_STORIES.md` — scénarios Given/When/Then
- `.agent/workflows/tdd-workflow.md` — séquence TDD obligatoire

---

## Règles absolues

### 1. TDD — le test avant le code, toujours

- Écrire le test en premier. Le code vient après.
- Le test doit échouer avant l'implémentation (RED).
- Implémenter uniquement le minimum pour le faire passer (GREEN).
- Un scénario Given/When/Then à la fois. Jamais plusieurs.

### 2. Petits blocs — jamais de génération massive

- Ne jamais générer un fichier entier d'un coup.
- Présenter un bloc à la fois : d'abord le test, attendre validation, puis l'implémentation.
- Si l'utilisateur demande "génère tout le service", refuser et proposer scénario par scénario.

### 3. Screaming Architecture — le dossier crie le métier

Le nom du dossier exprime le domaine métier, jamais la technique.

✅ Correct :
```
src/
└── movies/         ← parle du domaine
    ├── movies.module.ts
    ├── movies.controller.ts
    ├── movies.service.ts
    └── dto/
        └── discover-movies.dto.ts
```

❌ Interdit :
```
src/
├── controllers/    ← parle de technique
├── services/
└── dtos/
```

### 4. Vertical Slices — chaque feature est autonome

Chaque slice contient tout ce dont il a besoin : module, controller, service, DTO, tests.
Un slice ne dépend d'aucun autre slice sauf injection explicite dans `imports: []`.

Structure complète du slice `movies` :
```
src/movies/
├── movies.module.ts
├── movies.controller.ts
├── movies.controller.spec.ts
├── movies.service.ts
├── movies.service.spec.ts
└── dto/
    └── discover-movies.dto.ts
```

### 5. Séparation controller / service stricte

| Controller | Service |
|---|---|
| Reçoit les paramètres HTTP (`@Query`) | Contient toute la logique métier |
| Appelle le service | Appelle TMDB via axios |
| Retourne le résultat | Transforme les données |
| Aucune logique, aucun calcul | Aucune connaissance de HTTP |

Le controller ne fait que déléguer :
```typescript
@Get('discover')
discover(@Query() filters: DiscoverMoviesDto): Promise<Movie[]> {
  return this.moviesService.discover(filters);
}
```

### 6. Typage strict — jamais de `any`

Toutes les données sont typées via interfaces ou DTOs.

Interface de retour :
```typescript
export interface Movie {
  id: number;
  title: string;
  overview: string;
  releaseYear: string;
  rating: string;
  poster: string | null;
}
```

DTO d'entrée :
```typescript
export class DiscoverMoviesDto {
  genres?: string;
  maxDuration?: number;
  minRating?: number;
  providers?: string;
  page?: number;
}
```

### 7. Variables d'environnement — jamais `process.env` directement

Toujours via `ConfigService` :
```typescript
constructor(private config: ConfigService) {}

const apiKey = this.config.get<string>('TMDB_API_KEY');
```

### 8. Gestion des erreurs — exceptions NestJS typées

Jamais `throw new Error()` natif :
```typescript
import { HttpException, HttpStatus } from '@nestjs/common';

// TMDB timeout ou 5xx
throw new HttpException('TMDB API unavailable', HttpStatus.BAD_GATEWAY);

// Clé API invalide
throw new HttpException('Invalid TMDB API key', HttpStatus.UNAUTHORIZED);
```

### 9. Mocking dans les tests — jamais d'appel réel à TMDB

```typescript
import axios from 'axios';
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Simuler une réponse réussie
mockedAxios.get.mockResolvedValue({
  data: {
    results: [
      {
        id: 1,
        title: 'Inception',
        overview: 'Un film sur les rêves',
        release_date: '2010-07-16',
        vote_average: 8.4,
        poster_path: '/poster.jpg',
      },
    ],
  },
});
```

---

## Format des commits TDD

```bash
test(movies): <description courte du scénario testé>
feat(movies): <description courte de l'implémentation>
```

Exemples réels du projet :

```bash
test(movies): retourne 6 films maximum avec un filtre genre valide
feat(movies): implémenter le discover avec filtre genre via TMDB API

test(movies): applique une note minimale de 6 par défaut si absente
feat(movies): ajouter la valeur par défaut minRating=6 dans les params TMDB

test(movies): lève une erreur 502 si TMDB est indisponible
feat(movies): gérer les erreurs réseau TMDB avec HttpException 502

---

## Ordre de développement

Suivre l'ordre défini dans `USER_STORIES.md` :

1. US1 Scénario 1.1 — retourner 6 films avec genre valide ← **commencer ici**
2. US1 Scénario 1.2 — sans filtre de genre
3. US1 Scénario 1.3 — genre invalide → tableau vide
4. US2 Scénario 2.1 — filtre durée max
5. US2 Scénario 2.2 — durée absente
6. US3 Scénario 3.1 — filtre note minimale
7. US3 Scénario 3.2 — note absente → défaut 6
8. US4 Scénario 4.1 — pagination page 2
9. US4 Scénario 4.2 — page absente → défaut 1
10. US5 Scénario 5.1 — TMDB indisponible → 502
11. US5 Scénario 5.2 — clé invalide → 401