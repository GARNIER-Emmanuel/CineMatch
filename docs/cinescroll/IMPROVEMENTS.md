# Améliorations : CineScroll

## 🔍 Audit de l'état actuel
L'écran affiche un seul film en plein écran (Card). L'utilisateur scroll verticalement pour passer au film suivant, alimentant ainsi l'algorithme par sa simple navigation ou ses interactions explicites.

## 🚀 Fonctionnalités à implémenter (Roadmap)

### 1. Immersion Totale & Feedback Algorithmique
- **Auto-play Intelligent** : Lancer le trailer dès qu'une carte est stabilisée au centre.
- **Micro-signaux** : Détecter le temps passé sur une carte (dwell time) pour influencer positivement le score du genre, même sans like explicite.
- **Transition Fluide** : Animation de "balayage" lors du scroll pour renforcer le côté ludique.

### 2. Vue Détail du Film (User Story 1.1)
- **Modal de détails** : Au clic sur une carte, ouvrir une vue complète contenant :
    - Synopsis complet.
    - Liste des acteurs et équipe technique.
    - Bouton "Voir la bande-annonce" (lien YouTube ou modal vidéo).
    - **Plateformes de streaming** : Afficher les logos cliquables pour ouvrir directement l'app (Netflix, etc.).

### 3. Intégration Letterboxd (User Story 1.2)
- **Badge "Vu"** : Ajouter un indicateur visuel discret sur les films qui sont dans la liste importée (si l'utilisateur choisit de les afficher plutôt que de les masquer).

## 🎨 UI/UX & Polissage

### 1. Feedback Visuel & Micro-interactions
- **Skeleton Screens** : Remplacer l'indicateur de chargement central par des squelettes de cartes qui s'animent pendant le fetch.
- **Shared Element Transition** : Utiliser `react-native-reanimated` pour que l'affiche du film s'agrandisse de manière fluide vers la vue détail.

### 2. Layout & Performance
- **Optimisation des images** : Utiliser `expo-image` pour une mise en cache performante et un flou de transition (blurhash) au chargement.
- **Empty States** : Créer un écran "Aucun film trouvé" plus illustré et engageant.
