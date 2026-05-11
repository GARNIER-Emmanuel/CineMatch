---
description: ARCHITECTURE
---

# Architecture Backend — CineMatch

## Philosophie

Deux principes guident toute l'architecture :
- **Screaming Architecture** : l'arborescence exprime le domaine métier
- **Vertical Slices** : chaque fonctionnalité est un dossier autonome

---

## Screaming Architecture

### ✅ Correct — on voit le métier
```
src/
├── movies/        ← domaine "films"
│   ├── ...
└── health/        ← domaine "healthcheck"
```

### ❌ Incorrect — on voit la technique
```
src/
├── controllers/
├── services/
└── dtos/
```

---

## Vertical Slices

Chaque slice contient **tout** ce dont il a besoin pour fonctionner :

```
src/
└── movies/
    ├── movies.module.ts          ← déclare et exporte le slice
    ├── movies.controller.ts      ← routes HTTP, aucune logique
    ├── movies.controller.spec.ts ← tests du controller
    ├── movies.service.ts         ← logique métier + appels TMDB
    ├── movies.service.spec.ts    ← tests unitaires du service
    └── dto/
        └── discover-movies.dto.ts ← forme des données entrantes
```d

---

## Règles Controller

```typescript
// ✅ Controller correct : reçoit → délègue → retourne
@Get('discover')
discover(@Query() filters: DiscoverMoviesDto): Promise<Movie[]> {
  return this.moviesService.discover(filters);
}

// ❌ Controller incorrect : contient de la logique
@Get('discover')
async discover(@Query() filters: DiscoverMoviesDto) {
  const params = this.buildParams(filters); // ← logique ici = interdit
  const data = await axios.get(...);        // ← appel HTTP ici = interdit
  return data.results.slice(0, 6);
}
```

---

## Règles Service

```typescript
// ✅ Service correct
@Injectable()
export class MoviesService {
  constructor(
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async discover(filters: DiscoverMoviesDto): Promise<Movie[]> {
    // Toute la logique est ici
  }
}
```

---

## Gestion des erreurs

```typescript
// Toujours HttpException NestJS, jamais throw Error natif
import { HttpException, HttpStatus } from '@nestjs/common';

throw new HttpException('TMDB API unavailable', HttpStatus.BAD_GATEWAY);
throw new HttpException('Invalid TMDB API key', HttpStatus.UNAUTHORIZED);
```

---

## DTOs

- Nommage : `<action>-<domaine>.dto.ts` → `discover-movies.dto.ts`
- Un DTO par action, pas de DTO générique partagé
- Tous les champs sont optionnels dans le DTO de discover (filtres)

```typescript
export class DiscoverMoviesDto {
  genres?: string;
  maxDuration?: number;
  minRating?: number;
  providers?: string;
  page?: number;
}
```

---

## Interface de réponse

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

---

## Variables d'environnement

```typescript
// ✅ Correct
constructor(private config: ConfigService) {}
const key = this.config.get<string>('TMDB_API_KEY');

// ❌ Incorrect
const key = process.env.TMDB_API_KEY;
```

---

## AppModule

```typescript
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MoviesModule,
  ],
})
export class AppModule {}
```
