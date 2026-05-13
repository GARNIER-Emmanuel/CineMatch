---
description: PROJECT_CONTEXT
---

# Contexte Projet — CineMatch

## Résumé

Application web de recommandation de films.  
L'utilisateur filtre par genre, durée, note et plateforme.  
Le backend NestJS interroge l'API TMDB et retourne jusqu'à 6 fiches films.

---

## Stack

| Couche | Technologie |
|---|---|
| Backend | NestJS + TypeScript |
| Tests | Jest + Supertest |
| API externe | TMDB API v3 (gratuite) |
| Config | @nestjs/config |
| Containerisation | Docker + Docker Compose |
| Agent IA IDE | Gemini Code Assist (Antigravity) |
| Frontend | Angular (développé séparément) |

---

## Variables d'environnement

```env
TMDB_API_KEY=<clé TMDB v3 auth>
```

---

## Endpoint MVP

```
GET /movies/discover
```

### Paramètres

| Paramètre | Type | Défaut | Description |
|---|---|---|---|
| genres | string | — | IDs genres séparés par virgule (`28,12`) |
| maxDuration | number | — | Durée max en minutes |
| minRating | number | 6 | Note minimale sur 10 |
| providers | string | — | IDs plateformes séparés par pipe (`8\|337`) |
| page | number | 1 | Page de résultats |

### Réponse attendue

```json
[
  {
    "id": 27205,
    "title": "Inception",
    "overview": "Un voleur qui s'infiltre dans les rêves...",
    "releaseYear": "2010",
    "rating": "8.4",
    "poster": "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg"
  }
]
```

---

## Contraintes produit

- Maximum 6 films retournés par requête
- Langue : `fr-FR` (titres et synopsis en français)
- Région plateformes : `FR`
- `vote_count.gte = 200` (films suffisamment connus)
- Tri par défaut : `vote_average.desc`
- Pas d'authentification dans le MVP
- Pas de base de données dans le MVP

---

## IDs TMDB utiles — Genres

| Genre | ID |
|---|---|
| Action | 28 |
| Aventure | 12 |
| Animation | 16 |
| Comédie | 35 |
| Crime | 80 |
| Documentaire | 99 |
| Drame | 18 |
| Fantastique | 14 |
| Horreur | 27 |
| Romance | 10749 |
| Science-Fiction | 878 |
| Thriller | 53 |

## IDs TMDB utiles — Plateformes (région FR)

| Plateforme | ID |
|---|---|
| Netflix | 8 |
| Amazon Prime | 119 |
| Disney+ | 337 |
| Apple TV+ | 350 |
| Canal+ | 381 |
| OCS | 56 |

---

## URL de base TMDB

```
https://api.themoviedb.org/3/discover/movie
https://image.tmdb.org/t/p/w500/<poster_path>
```
