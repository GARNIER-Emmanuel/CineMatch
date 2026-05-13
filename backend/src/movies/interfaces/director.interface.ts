export interface Director {
  id: number;
  name: string;
  biography: string;
  profilePath: string | null;
  birthday: string | null;
  placeOfBirth: string | null;
  knownFor: DirectorMovie[];
  stats?: DirectorStats;
}

export interface DirectorMovie {
  id: number;
  title: string;
  poster: string | null;
  releaseYear: string;
  rating: string;
  job: string; // 'Director', 'Producer', etc.
}

export interface DirectorStats {
  mainGenres: { name: string; count: number }[];
  totalMovies: number;
  averageRating: string;
}
