# Architecture — Recherche & Réalisateurs

## Organisation des Slices

L'évolution sera découpée en deux nouveaux slices verticaux :

### 1. Slice `Search`
- **Frontend** : Composant de recherche dans la navbar + page de résultats.
- **Backend** : `search.controller.ts`, `search.service.ts` interrogeant `/search/multi` de TMDB.
- **DTO** : `SearchQueryDto`.

### 2. Slice `Directors`
- **Frontend** : 
  - `directors.page.ts` : Page principale avec les lignes par époques.
  - `director-card.ts` : Composant réutilisable pour l'affichage miniature.
  - `director-modal.ts` : Modale de détails.
  - `director-movies.page.ts` : Page de la filmographie.
- **Backend** : 
  - `directors.controller.ts`, `directors.service.ts`.
  - Intégration avec les méthodes existantes (réutilisation de la logique de mapping des films).

## Flux de Données

1. **Recherche** :
   - `Navbar` → `SearchService (FE)` → `API /search` → `SearchService (BE)` → `TMDB /search/multi`.
   - Les résultats sont typés (`MovieItem` ou `DirectorItem`).

2. **Détails Réalisateur** :
   - Clic sur `DirectorCard` → `DirectorModal` (Fetch asynchrone des détails TMDB).
   - Bouton "Voir ses films" → Navigation vers `/directors/:id/movies`.

3. **Filmographie** :
   - Fetch des crédits "Directing" via TMDB → Mapping vers le format `MovieItem[]` existant pour réutiliser les composants `MovieRow` ou `Grid`.

## Contraintes
- Respecter le TDD strict.
- Aucune logique métier dans les controllers.
- Typage strict pour les objets `Person` de TMDB.
