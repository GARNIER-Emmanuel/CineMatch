/**
 * DTO (Data Transfer Object) utilisé pour valider et typer les filtres 
 * envoyés par l'utilisateur lors de la recherche de films.
 */
export class DiscoverMoviesDto {
  genres?: string; // Liste d'identifiants de genres (ex: "28,12")
  maxDuration?: number; // Durée maximale en minutes
  minRating?: number; // Note minimale souhaitée
  page?: number; // Numéro de la page de résultats
  certificationCountry?: string; // Code pays pour la certification (ex: "FR")
  certificationLte?: string; // Certification maximale (ex: "12")
  providers?: string; // Liste d'identifiants de plateformes (ex: "8|337")
}
