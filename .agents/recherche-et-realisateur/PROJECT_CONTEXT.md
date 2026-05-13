# Contexte du Projet — Evolution "Recherche & Réalisateurs"

## Objectif
Cette évolution vise à transformer CineMatch d'un simple outil de découverte en une véritable encyclopédie interactive du cinéma. L'accent est mis sur les créateurs (Réalisateurs) et la facilité d'accès au contenu via une recherche intelligente.

## Stack Technique (Inchangée)
- **Backend** : NestJS (Screaming Architecture, Vertical Slices)
- **Frontend** : Angular (Standalone components, Premium UI)
- **API** : TMDB API (Endpoints : `/search/multi`, `/person/{id}`, `/person/{id}/combined_credits`)

## Nouveaux Endpoints Backend requis
1. `GET /search?q=...` : Recherche multi-critères (films et personnes)
2. `GET /directors/popular` : Liste des réalisateurs célèbres (par époques)
3. `GET /directors/:id` : Détails d'un réalisateur
4. `GET /directors/:id/movies` : Filmographie d'un réalisateur

## Défis Techniques
- **Mapping des époques** : Définir des filtres TMDB ou une liste fixe de réalisateurs emblématiques par période historique.
- **Modale Polymorphe** : Réutiliser la structure de la modale film pour les réalisateurs tout en adaptant les champs de données.
- **Performance** : La recherche doit être réactive (debounce, chargement partiel).

## Design System (Extensions)
- Ajout d'un état "actif" dans la navbar pour le nouvel onglet.
- Cartes "Personne" (cercle ou format portrait spécifique) pour les réalisateurs.
- Layout de grille pour la page filmographie.
