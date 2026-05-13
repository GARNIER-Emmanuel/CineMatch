# CineMatch - User Stories

Ce document regroupe l'intégralité des récits utilisateurs du projet CineMatch, classés par domaine fonctionnel.

---

## 📽️ Core - Découverte & Exploration

### US 1 - Découverte Rapide
**En tant que** cinéphile pressé,
**Je veux** voir une sélection de 6 films sur la page Discover,
**Afin de** choisir rapidement un film à regarder sans être submergé par le choix.

- **Scenario 1.1** - Retourner 6 films avec genre valide
- **Scenario 1.2** - Retourner 6 films sans filtre de genre
- **Scenario 1.3** - Genre invalide → tableau vide

### US 2 - Filtres de Recherche
**En tant que** utilisateur,
**Je veux** filtrer les films par durée et note minimale,
**Afin d'** affiner ma recherche selon mes critères actuels.

- **Scenario 2.1** - Filtre durée max
- **Scenario 2.2** - Filtre note minimale (défaut 6)

### US 3 - Recherche Globale
**En tant que** cinéphile,
**Je veux** rechercher un film ou un réalisateur depuis la navbar,
**Afin de** trouver rapidement un contenu spécifique.

- **Scenario 3.1** - Recherche par titre
- **Scenario 3.2** - Recherche par réalisateur

---

## 🎞️ CineScroll - Expérience Mobile Swipe

**En tant que** utilisateur mobile,
**Je veux** parcourir les films avec un geste de swipe guidé par l'algorithme,
**Afin de** trouver mon bonheur cinématographique sans avoir à chercher ou filtrer manuellement.

### US 4 - Interaction & Découverte Algorithmique
- **Scenario 4.1** - Swipe à droite → COOL (Influence positive sur l'algo)
- **Scenario 4.2** - Swipe à gauche → BOF (Influence négative sur l'algo)
- **Scenario 4.3** - Dwell Time : Le temps passé sur une carte renforce l'affinité avec le genre.

### US 5 - Détails & Vidéos
- **Scenario 5.1** - Lecture automatique du trailer en plein écran
- **Scenario 5.2** - Affichage des métadonnées essentielles en surimpression (Titre, Réal, Note)

---

## 🎬 Réalisateurs & Patrimoine

**En tant que** cinéphile curieux,
**Je veux** parcourir une liste de réalisateurs classés par époques,
**Afin de** découvrir les grands noms du cinéma selon leur contexte historique.

### US 11 - Navigation & Époques
- **Scenario 11.1** - Navigation vers l'onglet Réalisateurs
- **Scenario 11.2** - Organisation en sections (Âge d'or, Nouvel Hollywood, etc.)

### US 12 - Modale Détails Réalisateur
- **Scenario 12.1** - Ouverture de la modale avec biographie complète
- **Scenario 12.2** - Bouton "Voir ses films" pour explorer sa filmographie

---

## 📥 Mon Letterboxd (Filtres de visionnage)

**En tant qu'** utilisateur de Letterboxd,
**Je veux** importer mon fichier `watched.csv`,
**Afin de** masquer les films que j'ai déjà vus sur CineMatch.

### US 20 - Import & Filtrage
- **Scenario 20.1** - Upload du fichier CSV et parsing client
- **Scenario 20.2** - Persistance dans le `localStorage`
- **Scenario 20.3** - Masquage automatique des films vus dans Discover et CineScroll

---

## 🦍 RegeFilms (Le flux Règle Gorilla)

**En tant que** fan de Règle Gorilla,
**Je veux** voir ses derniers films notés sur Letterboxd,
**Afin de** bénéficier de ses recommandations.

### US 30 - Synchronisation RSS
- **Scenario 30.1** - Parsing du flux RSS Letterboxd
- **Scenario 30.2** - Enrichissement avec les données TMDB (Posters, Plateformes)

### US 31 - Interface RegeFilms
- **Scenario 31.1** - Section "Coups de cœur" (Note >= 4)
- **Scenario 31.2** - Section "À éviter" (Note <= 2)

---

## ⭐️ Ma Liste (Watchlist) & Historique

**En tant que** cinéphile organisé,
**Je veux** sauvegarder des films pour plus tard et retrouver ce que j'ai consulté,
**Afin de** ne pas perdre le fil de mes découvertes.

### US 40 - Gestion de la Watchlist
- **Scenario 40.1** - Ajout d'un film depuis une carte ou une modale.
- **Scenario 40.2** - Retrait d'un film.
- **Scenario 40.3** - Persistance après fermeture du navigateur.

### US 41 - Historique de Consultation
- **Scenario 41.1** - Enregistrement automatique lors de l'ouverture d'une modale.
- **Scenario 41.2** - Limitation aux 10 derniers films pour rester pertinent.
- **Scenario 41.3** - Possibilité de vider l'historique complet.
