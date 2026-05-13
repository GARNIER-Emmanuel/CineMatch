# Architecture — Mon Letterboxd (Import CSV)

Cette feature est exclusivement frontend. Elle permet à l'utilisateur de charger son historique Letterboxd pour filtrer les films déjà vus sur l'ensemble de l'application.

## Structure des fichiers (Frontend uniquement)

```
src/app/
├── services/
│   └── watched-films.service.ts       ← NOUVEAU : Logique de parsing, stockage et filtrage
└── features/
    └── watched-import/                ← NOUVEAU : Composant d'interface pour l'import/export
        ├── watched-import.component.ts
        ├── watched-import.component.html
        └── watched-import.component.css
```

## Interface de données

```typescript
export interface WatchedFilm {
  title: string;
  year: string;
}
```

## Service — WatchedFilmsService

Le service gère le cycle de vie des films vus, du parsing CSV au stockage local.

### Responsabilités :
- **Parsing** : Analyse du fichier `watched.csv` côté client.
- **Persistance** : Sauvegarde/Chargement dans le `localStorage`.
- **Filtrage** : Fournit une méthode pour vérifier si un film est déjà vu.

### Méthodes clés :
- `importFromCSV(file: File): Promise<number>` : Parse le fichier, met à jour la liste et retourne le compte.
- `isWatched(title: string, year: string): boolean` : Vérifie la présence d'un film (insensible à la casse/espaces).
- `getCount(): number` : Retourne le nombre total de films importés.
- `reset(): void` : Vide la liste et nettoie le `localStorage`.

## Intégration du filtrage

Le filtrage s'effectue systématiquement **après** la réception des données du backend dans les composants :

```typescript
// Exemple type d'intégration
this.moviesService.getMovies(...).subscribe(movies => {
  this.filteredMovies = movies.filter(m => 
    !this.watchedService.isWatched(m.title, m.releaseYear)
  );
});
```

## Stockage Local (LocalStorage)

- **Clé** : `cinematch_watched_films`
- **Format** : JSON stringified d'un tableau `WatchedFilm[]`.
- **Limite** : Supporte facilement plusieurs milliers de films (quelques Mo max).
