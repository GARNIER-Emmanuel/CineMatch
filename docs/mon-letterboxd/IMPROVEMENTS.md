# Améliorations : Page Profil

## 🔍 Audit de l'état actuel
L'importation CSV est fonctionnelle et le filtrage global est actif. C'est une base solide, mais l'aspect "Tableau de bord personnel" est absent.

## 🚀 Fonctionnalités à implémenter (Roadmap)

### 1. Dashboard de Statistiques
- **Visualisation des données** :
    - Nombre total de films vus.
    - Top 3 des genres les plus visionnés.
    - Réalisateur le plus présent dans la liste.
    - Graphique de répartition des notes.

### 2. Gestion de la Liste "À Voir" (Watchlist)
- **Synchronisation** : Pouvoir importer aussi sa Watchlist Letterboxd (en plus de l'Historique).
- **Favoris CineMatch** : Liste des films "Likés" dans CineScroll.

### 3. Paramètres & Thème
- **Sélecteur de Thème** : Mode Sombre (Deep Navy), Mode Noir (OLED), ou Mode Clair.
- **Réglages de l'API** : Possibilité de changer l'IP du backend sans modifier le code.

## 🎨 UI/UX & Polissage

### 1. Expérience d'importation
- **Feedback visuel riche** : Animation de chargement pendant le parsing du CSV (ex: une bobine de film qui tourne).
- **Résumé après import** : "845 films importés avec succès !".

### 2. Gamification & Badges
- **Niveaux de cinéphilie** : Attribuer un rang selon le nombre de films vus (ex: "Apprenti", "Cinéphile", "Maître du 7ème Art").
