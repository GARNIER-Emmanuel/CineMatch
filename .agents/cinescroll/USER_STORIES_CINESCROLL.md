# User Stories — CineScroll

## Ordre de développement recommandé (TDD)

| Priorité | US | Scénario | Description |
|---|---|---|---|
| 1 | US6 | 6.1 | Mood sélectionné → films filtrés |
| 2 | US6 | 6.2 | Aucun mood → films aléatoires populaires |
| 3 | US7 | 7.1 | Affichage complet d'un film |
| 4 | US7 | 7.2 | Bande-annonce introuvable → diaporama |
| 5 | US7 | 7.3 | Scroll vers film suivant |
| 6 | US8 | 8.1 | Ajouter à Ma Liste |
| 7 | US8 | 8.2 | Pas intéressé |
| 8 | US9 | 9.1 | Affinement après interactions positives |
| 9 | US9 | 9.2 | Affinement après interactions négatives |
| 10 | US9 | 9.3 | Réinitialisation au nouveau lancement |

---

## US6 — Lancer CineScroll avec un mood

**En tant que** spectateur,
**Je veux** sélectionner un mood avant de lancer CineScroll,
**Afin de** voir des films adaptés à mon état d'esprit du moment.

### Scénario 6.1 — Mood sélectionné
```
Given  l'utilisateur ouvre la page CineScroll
When   il sélectionne un mood parmi les cartes proposées
Then   le système mappe ce mood sur une combinaison de genres TMDB
And    charge une liste de films correspondants depuis le backend
And    lance le scroll sur le premier film
```

### Scénario 6.2 — Aucun mood sélectionné
```
Given  l'utilisateur ouvre CineScroll sans sélectionner de mood
When   il clique sur "Lancer"
Then   le système charge des films populaires sans filtre de genre
And    lance le scroll sur le premier film
```

---

## US7 — Scroller film par film

**En tant que** spectateur,
**Je veux** faire défiler les films un par un du bas vers le haut,
**Afin de** découvrir chaque film de façon immersive.

### Scénario 7.1 — Affichage d'un film
```
Given  le scroll est lancé
When   un film est affiché
Then   la page montre en haut à gauche l'affiche du film
And    en bas à gauche : titre, synopsis, note, plateforme disponible
And    à droite : la bande-annonce YouTube VF (ou VO si VF absente)
And    la bande-annonce démarre automatiquement en sourdine
```

### Scénario 7.2 — Bande-annonce introuvable
```
Given  aucune bande-annonce n'est disponible sur TMDB pour ce film
When   le film est affiché
Then   afficher un diaporama des images du film (backdrops TMDB)
       à la place de la bande-annonce
```

### Scénario 7.3 — Scroll vers le film suivant
```
Given  un film est affiché
When   l'utilisateur scrolle vers le haut
Then   le film suivant apparaît avec sa bande-annonce
And    la bande-annonce du film précédent est stoppée
```

---

## US8 — Interagir avec un film

**En tant que** spectateur,
**Je veux** pouvoir sauvegarder ou ignorer un film pendant le scroll,
**Afin de** retrouver mes films favoris et affiner les suggestions suivantes.

### Scénario 8.1 — Ajouter à Ma Liste
```
Given  un film est affiché dans CineScroll
When   l'utilisateur clique sur "Ma Liste" (icône ✚)
Then   le film est ajouté à la liste en mémoire de session
And    un feedback visuel confirme l'ajout
And    le système note le genre de ce film pour affiner la suite
```

### Scénario 8.2 — Pas intéressé
```
Given  un film est affiché dans CineScroll
When   l'utilisateur clique sur "Pas intéressé" (icône ✕)
Then   le film est ignoré et n'apparaît plus dans cette session
And    le système note le genre à éviter pour la suite du scroll
```

---

## US9 — Affinement en session

**En tant que** spectateur,
**Je veux** que mes interactions influencent les films proposés,
**Afin de** voir des films de plus en plus proches de mes envies.

### Scénario 9.1 — Affinement après interactions positives
```
Given  l'utilisateur a ajouté 2 films du même genre à Ma Liste
When   le système charge les films suivants
Then   les films du genre favori sont priorisés dans la sélection
```

### Scénario 9.2 — Affinement après interactions négatives
```
Given  l'utilisateur a ignoré 3 films du même genre
When   le système charge les films suivants
Then   les films de ce genre sont déprioritisés dans la sélection
```

### Scénario 9.3 — Réinitialisation au nouveau lancement
```
Given  l'utilisateur relance CineScroll
When   la page de sélection du mood s'affiche
Then   le profil d'affinement de la session précédente est réinitialisé
And    l'utilisateur repart d'une sélection fraîche
```

---

## Mapping Mood → Genres TMDB

| Mood | Label | Genres TMDB | IDs |
|---|---|---|---|
| 😂 | Bonne humeur | Comédie, Animation | 35,16 |
| 😢 | Mélancolique | Drame, Romance | 18,10749 |
| 😱 | Frissons | Horreur, Thriller | 27,53 |
| 🤯 | Dépaysement | Science-Fiction, Aventure | 878,12 |
| ❤️ | Romantique | Romance, Drame | 10749,18 |
| 🧠 | Réflexion | Drame, Science-Fiction | 18,878 |
| 🎲 | Aléatoire | Aucun filtre | — |

---

## Seuils d'affinement

| Événement | Seuil | Action |
|---|---|---|
| Ajout à Ma Liste | 2 films du même genre | Prioriser ce genre dans les appels suivants |
| Pas intéressé | 3 films du même genre | Exclure ce genre des appels suivants |
| Nouveau lancement | — | Réinitialiser tout le profil de session |
