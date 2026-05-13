/**
 * Interface représentant la structure d'un film dans notre application.
 * C'est le contrat de données que le frontend recevra.
 */
export interface Movie {
  id: number; // Identifiant unique du film (ex: 550)
  title: string; // Titre original ou traduit (ex: "Fight Club")
  originalTitle?: string; // Titre original non localisé
  overview: string; // Résumé du film
  releaseYear: string; // Année de sortie uniquement (ex: "1999")
  rating: string; // Note moyenne formatée en texte (ex: "8.4")
  poster: string | null; // URL complète de l'affiche ou null si inexistante
  backdrop: string | null; // URL de l'image de fond grand format
  genreIds?: number[];
}
