# Améliorations : Page Explorer

## 🔍 Audit de l'état actuel
L'organisation en onglets supérieurs (Top Tabs) est efficace. La recherche et les listes horizontales (Réalisateurs/RegeFilms) fonctionnent mais les interactions sont limitées.

## 🚀 Fonctionnalités à implémenter (Roadmap)

### 1. Recherche Intelligente (User Story 1.1)
- **Catégorisation des résultats** : Séparer clairement les "Films" des "Réalisateurs/Acteurs" avec des en-têtes de section.
- **Historique de recherche** : Stockage local (AsyncStorage) des dernières recherches.
- **Auto-complétion** : Suggestions au fur et à mesure de la frappe.

### 2. Le Panthéon des Réalisateurs (User Story 2.1 & 2.2)
- **Fiche Réalisateur complète** : Au clic, ouvrir un écran dédié :
    - Photo grand format.
    - Courte biographie/style.
    - **Filmographie interactive** : Grille de ses films avec état "Vu/À voir" (via Letterboxd).
    - Statistiques (ex: "Vous avez vu 4/15 films de Scorsese").

### 3. RegeFilms (Curation)
- **Contextualisation** : Ajouter le texte de la critique/recommandation pour chaque film curaté.
- **Lien Letterboxd** : Bouton pour ouvrir la critique complète sur le site Letterboxd.

## 🎨 UI/UX & Polissage

### 1. Navigation Fluide
- **Snap Scrolling** : Pour les listes de réalisateurs, s'assurer que la carte s'aligne parfaitement sur le bord gauche.
- **Transitions d'onglets** : S'assurer que le passage entre Recherche et Réalisateurs est instantané sans rechargement de données inutile (caching Query).

### 2. Typographie & Contrastes
- Accentuer les titres des époques (Âge d'or, etc.) avec une typographie plus typée (Serif ou Italique Premium).
