# Impact Mapping : CineMatch

## Présentation du projet

**CineMatch** est une application web qui permet à un utilisateur de trouver un film à regarder le soir en quelques secondes, en filtrant par genre, durée, humeur et plateforme de streaming disponible. Le backend NestJS interroge l'API TMDB pour retourner des recommandations pertinentes avec posters, synopsis et notes.

---

## 1. Objectifs métier

### Objectif principal

> **Réduire le temps de décision lors du choix d'un film** en passant d'une navigation aléatoire sur plusieurs plateformes (15 à 20 minutes en moyenne) à une recommandation ciblée en moins de 30 secondes.

### Métriques de succès (SMART)

| Métrique | Cible |
|---|---|
| Temps moyen pour obtenir une recommandation | < 30 secondes |
| Taux de satisfaction (vote 👍 sur la recommandation) | ≥ 60% des sessions |
| Nombre de sessions par utilisateur par semaine | ≥ 2 |

### Problème adressé

Les plateformes de streaming (Netflix, Disney+, Canal+) proposent des catalogues trop larges, sans filtre contextuel lié à l'humeur ou à la durée souhaitée. L'utilisateur perd du temps à scroller et finit souvent par ne rien choisir ou revisionner un film déjà vu.

---

## 2. Utilisateurs (Acteurs)

### Acteur principal — Le spectateur casual

**Profil :** adulte de 18 à 35 ans, abonné à une ou plusieurs plateformes de streaming, qui regarde des films en soirée seul ou en couple.

**Caractéristiques :**
- Dispose d'un temps limité (1h30 à 2h) pour regarder un film
- Ne veut pas passer plus de 5 minutes à choisir
- A des préférences variables selon son humeur du moment
- Ne maîtrise pas les catalogues exhaustifs des plateformes

### Acteur secondaire (hors MVP) — Le cinéphile

**Profil :** utilisateur plus avancé, qui souhaite découvrir des films moins connus ou explorer des genres précis (néo-noir, cinéma japonais, etc.).

---

## 3. Objectifs utilisateurs

### Pour le spectateur casual

| Action utilisateur | Contribution à l'objectif métier |
|---|---|
| Il renseigne ses filtres (genre, durée, plateforme) | Fournit les données nécessaires pour une recommandation pertinente |
| Il vote 👍/👎 sur les suggestions reçues | Valide la qualité du moteur de recommandation |
| Il revient régulièrement sur l'app | Génère de la rétention, prouve l'utilité du produit |
| Il partage une recommandation | Élargit la base d'utilisateurs sans coût d'acquisition |

### Objectif utilisateur synthétisé

> L'utilisateur veut **trouver un film adapté à son soir en moins de 30 secondes**, sans avoir à naviguer sur plusieurs plateformes ni lire des dizaines de fiches.

---

## 4. Fonctionnalités minimales (MVP)

### Critère de sélection

Une fonctionnalité entre dans le MVP si et seulement si son absence empêche l'utilisateur d'obtenir une recommandation de film.

### Tableau des fonctionnalités

| # | Fonctionnalité | Justification MVP | Priorité |
|---|---|---|---|
| F1 | Formulaire de filtres : genre(s), durée max, note minimale, plateforme(s) | Point d'entrée obligatoire — sans filtres, pas de recommandation ciblée | Must have |
| F2 | Appel TMDB Discover API côté backend (NestJS) | Cœur du système — fournit les films filtrés | Must have |
| F3 | Affichage des fiches film : poster, titre, année, durée, synopsis, note | L'utilisateur doit pouvoir évaluer chaque recommandation | Must have |
| F4 | Bouton "Autre sélection" (pagination TMDB) | Permet de relancer si aucun film ne convient | Must have |
| F5 | Vote 👍/👎 sur une recommandation | Valide l'utilité du filtre — feedback immédiat pour l'utilisateur | Should have |
| F6 | Historique des films vus (en mémoire) | Évite de revoir une suggestion déjà refusée | Should have |
| F7 | Export ou partage d'une fiche film | Utile en contexte "soirée à plusieurs" | Could have |

### Fonctionnalités exclues du MVP

Les éléments suivants ont été volontairement exclus du périmètre initial :

- **Système de compte utilisateur / authentification** : ajoute de la friction sans valeur pour un MVP
- **Recommandations basées sur l'historique** : nécessite une base de données et un algorithme de personnalisation
- **Intégration IA (Gemini)** : exclue pour des raisons de quota API — le moteur de règles TMDB suffit pour le MVP
- **Application mobile** : hors scope, le MVP cible uniquement le web desktop/responsive

---

## 5. Synthèse — Arbre d'impact mapping

```
OBJECTIF MÉTIER
└── Réduire le temps de choix d'un film à < 30 secondes

    ACTEUR
    └── Spectateur casual (18-35 ans, abonné streaming)

        OBJECTIF UTILISATEUR
        └── Trouver un film adapté à son soir sans scroller

            FONCTIONNALITÉS (MVP)
            ├── F1 — Formulaire de filtres (genre, durée, plateforme)
            ├── F2 — Moteur de recommandation via TMDB API (NestJS)
            ├── F3 — Affichage fiche film (poster, synopsis, note)
            └── F4 — Bouton "Autre sélection" (pagination)
```
