# Algorithme CineScroll : Affinage & Évolutions

Ce document définit la logique actuelle et les évolutions prévues pour l'algorithme de recommandation en temps réel de CineScroll.

## 1. État Actuel
Actuellement, CineScroll utilise une approche hybride :
- **Mood initial** : L'utilisateur choisit un mood qui définit des genres TMDB cibles.
- **Profil de session** : Enregistre les likes/dislikes sur les genres lors du défilement.
- **Requête TMDB** : Combine les genres du mood et les genres préférés via un "ET" (virgule), ce qui peut devenir trop restrictif.

## 2. Améliorations de l'Algorithme (Session en cours)

### A. Passage au Scoring Local (Match Score)
Au lieu de laisser TMDB filtrer de manière binaire, nous allons passer à un système de scoring dynamique :
- **Requête Large** : On interroge TMDB principalement sur le Mood et les exclusions (genres détestés).
- **Calcul d'Affinité** : Pour chaque nouveau bloc de films reçus, on calcule un score :
  - `+1` par like sur un genre du film.
  - `-1` par dislike sur un genre du film.
  - `Bonus` si le réalisateur ou un acteur principal a été liké précédemment.
- **Tri en Temps Réel** : Les films du bloc sont triés par score avant d'être injectés dans le scroll, garantissant que les 5 prochains films sont toujours les plus pertinents.

### B. Gestion de la Pagination et des Doublons
- Si les préférences changent radicalement, l'algorithme peut décider de repasser à la `page 1` de TMDB avec de nouveaux paramètres.
- Un système de "vu" (basé sur les IDs) empêchera de remontrer un film déjà croisé durant la même session.

---

## 3. Évolutions de l'Interface & Data (Roadmap)

### A. Nouveaux Boutons d'Action
Pour affiner encore plus l'algorithme, nous allons enrichir les interactions sur chaque slide :
1. **Ajouter à ma liste (♥)** : Intérêt confirmé, poids fort dans l'algorithme.
2. **Pas intéressé (✕)** : Cache le film et applique un malus aux genres associés.
3. **Baromètre d'Envie (★☆☆)** : Un nouveau bouton "Il me donne envie" avec 3 niveaux d'étoiles :
   - **1 étoile** : Curiosité faible.
   - **2 étoiles** : Intérêt marqué.
   - **3 étoiles** : Priorité absolue.
   *Ce baromètre servira de multiplicateur pour le score d'affinité des genres.*

### B. Mode "Trouver en moins de X minutes"
Évolution du sélecteur de mood pour les utilisateurs pressés :
- **Concept** : L'utilisateur définit un temps limite (ex: 3 minutes).
- **Fonctionnement** : CineScroll lance la session normalement, mais suit le temps.
- **Conclusion Flash** : À la fin du temps imparti, l'algorithme propose le **Top 3 des films** scrollés qui ont reçu le meilleur score d'envie, permettant une décision rapide.

---

## 4. Futur : Intelligence Acteurs/Réalisateurs
L'algorithme devra à terme extraire les noms des réalisateurs et acteurs des films likés pour les ajouter comme poids positifs dans les futures requêtes TMDB (`with_people`, `with_crew`).
