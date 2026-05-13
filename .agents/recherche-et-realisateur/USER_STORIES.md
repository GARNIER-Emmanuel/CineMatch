# User Stories — Recherche et Réalisateurs

## Ordre de développement recommandé (TDD)

| Priorité | US | Scénario | Description |
|---|---|---|---|
| 1 | US10 | 10.1 | Recherche globale par titre |
| 2 | US10 | 10.2 | Recherche par nom de réalisateur |
| 3 | US10 | 10.3 | Résultats mixtes (Films & Personnes) |
| 4 | US11 | 11.1 | Accès à la page Réalisateurs |
| 5 | US11 | 11.2 | Slices par époques (Âge d'or, Nouvel Hollywood, etc.) |
| 6 | US12 | 12.1 | Ouverture de la modale Réalisateur |
| 7 | US12 | 12.2 | Détails complets (Bio, Dates, Carrière) |
| 8 | US13 | 13.1 | Bouton "Voir ses films" |
| 9 | US13 | 13.2 | Page dédiée à la filmographie |

---

## US10 — Recherche Intelligente

**En tant que** cinéphile,
**Je veux** rechercher un film ou un auteur depuis la navbar,
**Afin de** trouver rapidement un contenu spécifique ou explorer l'œuvre d'un artiste.

### Scénario 10.1 — Recherche par titre
```
Given  l'utilisateur est sur n'importe quelle page
When   il saisit un titre de film dans la barre de recherche
Then   le système affiche une liste de films correspondants
And    la navigation vers le détail du film est possible
```

### Scénario 10.2 — Recherche par réalisateur
```
Given  l'utilisateur saisit un nom de réalisateur (ex: "Christopher Nolan")
When   il valide la recherche
Then   le système identifie la personne via TMDB
And    affiche le profil du réalisateur en priorité
```

---

## US11 — Page Réalisateurs

**En tant que** cinéphile curieux,
**Je veux** parcourir une liste de réalisateurs classés par époques,
**Afin de** découvrir les grands noms du cinéma selon leur contexte historique.

### Scénario 11.1 — Navigation
```
Given  l'utilisateur est sur l'accueil
When   il clique sur l'onglet "Réalisateurs" dans la navbar
Then   il est redirigé vers `/directors`
And    l'onglet est mis en surbrillance
```

### Scénario 11.2 — Organisation par époques
```
Given  la page Réalisateurs est chargée
When   l'utilisateur scrolle
Then   il voit des sections horizontales (slices) par époque :
       - "Âge d'Or d'Hollywood"
       - "Nouvelle Vague & Cinéma Européen"
       - "Blockbusters & Nouvel Hollywood"
       - "Cinéma Contemporain"
```

---

## US12 — Modale Détails Réalisateur

**En tant que** cinéphile,
**Je veux** consulter la biographie et les infos d'un réalisateur,
**Afin d'** enrichir ma culture cinématographique.

### Scénario 12.1 — Ouverture
```
Given  l'utilisateur voit une carte réalisateur
When   il clique dessus
Then   une modale s'ouvre (style identique à celle des films)
And    affiche l'image de profil et le nom
```

### Scénario 12.2 — Informations détaillées
```
Given  la modale réalisateur est ouverte
Then   afficher les données récupérées de TMDB :
       - Date de naissance / décès
       - Lieu de naissance
       - Biographie complète
       - Nombre de films réalisés (ou films notables)
```

---

## US13 — Explorer la filmographie

**En tant que** fan d'un réalisateur,
**Je veux** voir tous les films qu'il a réalisés,
**Afin de** ne rien manquer de son œuvre.

### Scénario 13.1 — Action de découverte
```
Given  la modale réalisateur est ouverte
When   l'utilisateur clique sur le bouton "Voir ses films" en bas à droite
Then   la modale se ferme
And    l'utilisateur est redirigé vers une page dédiée `/directors/:id/movies`
```

### Scénario 13.2 — Page Filmographie
```
Given  la page filmographie est chargée
Then   afficher une grille de tous les films du réalisateur
And    chaque film peut être ouvert dans la modale de détails standard
```
