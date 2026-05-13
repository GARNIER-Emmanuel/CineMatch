# User Stories — Mon Letterboxd

L'objectif est de garantir que l'utilisateur ne se voit jamais proposer un film qu'il a déjà marqué comme "vu" dans Letterboxd.

---

## US 1 — Importation de l'historique
**En tant qu'** utilisateur Cinéphile
**Je veux** importer mon fichier `watched.csv` de Letterboxd
**Afin que** l'application connaisse mon historique de visionnage sans que j'aie à tout ressaisir.

### Scénario 1.1 — Importation réussie
- **Given** J'ai un fichier `watched.csv` valide exporté de Letterboxd
- **When** Je sélectionne ce fichier via le bouton d'import
- **Then** Le système extrait les titres et les années
- **And** Il stocke les données dans le `localStorage`
- **And** Il affiche un message de succès avec le nombre de films importés.

- **Given** Je sélectionne un fichier qui n'est pas un `.csv`
- **When** Je tente de l'importer
- **Then** Le système affiche un message d'erreur : "Format de fichier invalide. Veuillez utiliser un .csv".

---

## US 2 — Filtrage automatique
**En tant qu'** utilisateur en quête de nouveautés
**Je veux** que les films de ma liste d'import soient masqués partout
**Afin de** ne découvrir que des films que je n'ai jamais vus.

### Scénario 2.1 — Filtrage sur la page Discover
- **Given** J'ai importé "Inception (2010)" dans ma liste
- **When** Je navigue sur la page Discover
- **Then** Le film "Inception" n'apparaît dans aucune liste de résultats.

### Scénario 2.2 — Filtrage sur CineScroll
- **Given** J'ai importé "The Dark Knight (2008)"
- **When** Je lance une session CineScroll
- **Then** Le film n'est jamais présenté dans le défilement des slides.

---

## US 3 — Gestion de la liste importée
**En tant qu'** utilisateur
**Je veux** pouvoir voir l'état de ma liste et la supprimer si besoin
**Afin de** garder le contrôle sur mes données de filtrage.

### Scénario 3.1 — Affichage de l'état
- **Given** J'ai importé 482 films
- **When** Je regarde la navbar
- **Then** Je vois l'indicateur "👁 482 films importés".

### Scénario 3.2 — Suppression de la liste
- **Given** Une liste de films est active
- **When** Je clique sur le bouton "🗑 Supprimer ma liste"
- **Then** Le `localStorage` est vidé immédiatement
- **And** Les films précédemment masqués redeviennent visibles sur l'application
- **And** Un message de confirmation temporaire s'affiche.
