# Algorithme CineScroll - Spécifications Techniques

Le CineScroll est un moteur de recommandation éphémère (basé sur la session) qui affine ses résultats en temps réel selon les interactions de l'utilisateur.

---

## 1. Capture des Signaux (Profil de Session)

L'algorithme s'appuie sur le `CineScrollProfileService` qui enregistre trois types de données durant la session :
- **Genres Likés/Dislikés** : Chaque interaction sur un film impacte le poids de ses genres.
- **Personnes Favorites** : Le nom du réalisateur et des acteurs principaux des films "likés" sont mis en mémoire.

---

## 2. Cycle de Filtrage

### Phase A : Requête TMDB (Filtre Dur)
Le frontend appelle le backend avec :
- `with_genres` : Les genres du "Mood" initial.
- `without_genres` : Tous les genres ayant reçu **au moins 3 dislikes** durant la session.
- `page` : Incrémentée automatiquement quand l'utilisateur approche de la fin de la liste chargée.

### Phase B : Raffinement Client (Filtre Doux)
Avant affichage, le frontend applique des filtres supplémentaires :
- **Déjà vus (Session)** : Exclusion des films présentés depuis le début du lancement.
- **Déjà vus (Patrimoine)** : Exclusion des films présents dans le `watched.csv` de Letterboxd.

---

## 3. Système de Scoring Dynamique

Chaque film restant est scoré selon la formule suivante :

| Critère | Poids |
|---|---|
| Genre Liké | `+1` par occurrence |
| Genre Disliké | `-1` par occurrence |
| Réalisateur/Acteur favori | `+2` (Bonus fixe) |

**Le résultat est trié par score décroissant.** Ainsi, même au sein d'une page de 20 films TMDB, les films les plus affinitaires apparaissent en premier dans le scroll.

---

## 4. Conclusion Flash (Top 3)

À la fin d'une session minutée, un calcul de scoring "Boosté" est effectué sur l'ensemble des films chargés (non rejetés) :
- **Réalisateur favori** : `+5` points.
- **Acteurs favoris** : `+3` points.
- **Déjà en Watchlist** : `+10` points.

Les 3 meilleurs scores sont présentés comme la "Sélection Idéale" de la session.

---

## 5. Persistence
Le profil de session est stocké dans le `localStorage` sous la clé `cinematch_cinescroll_profile`. Il est **réinitialisé** à chaque clic sur "Changer de Mood" ou à la fin d'une session, garantissant une expérience repartant de zéro à chaque utilisation.
