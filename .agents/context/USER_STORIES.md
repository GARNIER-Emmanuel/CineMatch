---
description: USER_STORIES
---

# User Stories — CineMatch MVP

## Ordre de développement TDD recommandé

1. US1 — Scénario 1.1 (cas nominal principal)
2. US1 — Scénario 1.2 (sans filtre de genre)
3. US1 — Scénario 1.3 (genre invalide → tableau vide)
4. US2 — Scénario 2.1 (filtre durée max)
5. US2 — Scénario 2.2 (durée absente → pas de filtre)
6. US3 — Scénario 3.1 (filtre note minimale)
7. US3 — Scénario 3.2 (note absente → défaut 6)
8. US4 — Scénario 4.1 (pagination page suivante)
9. US4 — Scénario 4.2 (page absente → défaut 1)
10. US5 — Scénario 5.1 (TMDB indisponible → 502)
11. US5 — Scénario 5.2 (clé API invalide → 401)

---

## US1 — Découvrir des films par genre

**En tant que** spectateur,
**Je veux** filtrer les films par genre,
**Afin de** trouver un film qui correspond à mon envie du moment.

### Scénario 1.1 — Résultats avec genre valide ⭐ (commencer ici)
```
Given  l'utilisateur envoie GET /movies/discover?genres=28
When   la requête est reçue par le backend
Then   le backend retourne un tableau de 6 films maximum
And    chaque film contient les champs : id, title, overview, releaseYear, rating, poster
And    le statut HTTP est 200
```

### Scénario 1.2 — Sans filtre de genre
```
Given  l'utilisateur envoie GET /movies/discover sans paramètre genres
When   la requête est reçue par le backend
Then   le backend retourne un tableau de films sans filtre de genre
And    les films sont triés par note décroissante
And    le statut HTTP est 200
```

### Scénario 1.3 — Genre invalide
```
Given  l'utilisateur envoie GET /movies/discover?genres=99999
When   TMDB retourne un tableau vide pour ce genre
Then   le backend retourne un tableau vide []
And    le statut HTTP est 200 (pas d'erreur 500)
```

---

## US2 — Filtrer par durée maximale

**En tant que** spectateur,
**Je veux** définir une durée maximale,
**Afin de** trouver un film qui rentre dans mon temps disponible.

### Scénario 2.1 — Filtre durée appliqué
```
Given  l'utilisateur envoie GET /movies/discover?maxDuration=90
When   la requête est reçue par le backend
Then   le service transmet le paramètre with_runtime.lte=90 à TMDB
And    retourne les résultats filtrés
```

### Scénario 2.2 — Durée absente
```
Given  l'utilisateur envoie GET /movies/discover sans maxDuration
When   la requête est reçue par le backend
Then   aucun filtre de durée n'est transmis à TMDB
```

---

## US3 — Filtrer par note minimale

**En tant que** spectateur,
**Je veux** définir une note minimale,
**Afin de** ne voir que des films bien notés.

### Scénario 3.1 — Note minimale appliquée
```
Given  l'utilisateur envoie GET /movies/discover?minRating=7
When   la requête est reçue par le backend
Then   le service transmet vote_average.gte=7 à TMDB
And    retourne uniquement des films avec rating >= 7
```

### Scénario 3.2 — Note absente → valeur par défaut
```
Given  l'utilisateur envoie GET /movies/discover sans minRating
When   la requête est reçue par le backend
Then   le service utilise vote_average.gte=6 par défaut
```

---

## US4 — Pagination

**En tant que** spectateur,
**Je veux** pouvoir demander d'autres suggestions,
**Afin de** ne pas rester bloqué sur les mêmes films.

### Scénario 4.1 — Page suivante
```
Given  l'utilisateur envoie GET /movies/discover?page=2
When   la requête est reçue par le backend
Then   le service transmet page=2 à TMDB
And    retourne une nouvelle liste de 6 films
```

### Scénario 4.2 — Page absente → défaut 1
```
Given  l'utilisateur envoie GET /movies/discover sans page
When   la requête est reçue par le backend
Then   le service utilise page=1 par défaut
```

---

## US5 — Gestion d'erreur TMDB

**En tant que** développeur,
**Je veux** que les erreurs TMDB soient gérées proprement,
**Afin de** ne pas exposer d'erreur 500 brute à l'utilisateur.

### Scénario 5.1 — TMDB indisponible
```
Given  l'API TMDB retourne une erreur réseau ou 5xx
When   le service tente l'appel
Then   le backend retourne une HttpException avec statut 502
And    le message est "TMDB API unavailable"
```

### Scénario 5.2 — Clé API invalide
```
Given  TMDB retourne une erreur 401
When   le service tente l'appel
Then   le backend retourne une HttpException avec statut 401
And    le message est "Invalid TMDB API key"
```
