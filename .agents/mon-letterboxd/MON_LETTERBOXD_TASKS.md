# Tasks — Mon Letterboxd

Plan de développement de la feature d'importation et de filtrage.

## Phase 1 — Service de gestion des films vus
- [ ] **Task 1.1** : Création du service `WatchedFilmsService`
- [ ] **Task 1.2** : Implémentation du stockage `localStorage` (Load/Save)
- [ ] **Task 1.3** : Implémentation du parser CSV (split par ligne, extraction colonnes 1 et 2)
- [ ] **Task 1.4** : Logique de comparaison (Titre + Année, trim, lowercase)
- [ ] **Task 1.5** : Tests unitaires du service (mock localStorage + simulation CSV)

## Phase 2 — Interface d'importation
- [ ] **Task 2.1** : Création du composant `WatchedImportComponent`
- [ ] **Task 2.2** : Intégration du bouton "œil" dans la Navbar existante
- [ ] **Task 2.3** : Style CSS pour les 3 états (Neutre, Importé, Feedback suppression)
- [ ] **Task 2.4** : Gestion de l'input `type="file"` et lien avec le service

## Phase 3 — Intégration du filtrage (Vertical Slices)
- [ ] **Task 3.1** : Injection du service dans `DiscoverMovies` et application du filtre post-fetch
- [ ] **Task 3.2** : Injection dans `CineScroll` et application du filtre
- [ ] **Task 3.3** : Injection dans `RegeFilms` (Règle Gorilla) et application du filtre
- [ ] **Task 3.4** : Vérification de la réactivité (si je supprime la liste, les films reviennent-ils sans refresh ?)

## Phase 4 — Polissage et UX
- [ ] **Task 4.1** : Animation de feedback lors de la suppression (3 secondes)
- [ ] **Task 4.2** : Gestion des doublons lors de l'import (ne pas ajouter deux fois le même film)
- [ ] **Task 4.3** : Support du format CSV Letterboxd avec/sans guillemets (parsing robuste)
