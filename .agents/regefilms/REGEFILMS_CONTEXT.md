# Contexte — RegeFilms (Règle Gorilla)

## Concept
Ajouter une page dédiée dans CineMatch qui affiche les recommandations du YouTubeur cinéma français **Règle Gorilla**, basées sur ses notes Letterboxd.

## Flux de données
1. **Source** : Flux RSS public `https://letterboxd.com/reglegorilla/rss/`.
2. **Parsing** : Extraction du titre, de la note (étoiles Letterboxd) et de la date.
3. **Matching TMDB** : Utilisation de `GET /search/movie` pour récupérer les métadonnées (poster, synopsis, note TMDB, année).
4. **Streaming** : Utilisation de `GET /movie/{id}/watch/providers` pour identifier la plateforme disponible en France.
5. **Caching** : TTL de 1 heure sur le backend pour limiter les requêtes RSS et TMDB.

## Règles de notation
- ⭐ **Coup de cœur** : Note Letterboxd ≥ 4/5.
- 👎 **À éviter** : Note Letterboxd ≤ 2/5.

## Contraintes
- Utiliser `rss-parser` pour le RSS.
- Ne pas re-télécharger le RSS si le cache est valide.
- Ignorer les films non trouvés sur TMDB.
- Afficher un lien direct vers son profil Letterboxd.
