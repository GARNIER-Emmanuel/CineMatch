import { Component } from '@angular/core';
import { NavbarComponent } from './layout/navbar/navbar';
import { HeroComponent } from './features/home/hero/hero';
import { MovieRowComponent, MovieItem } from './features/home/movie-row/movie-row';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, HeroComponent, MovieRowComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class AppComponent {
  title = 'CineMatch';

  // Données de test pour valider le design
  popularMovies: MovieItem[] = [
    { id: 1, title: 'Inception', poster: 'https://image.tmdb.org/t/p/w500/9gk7Fn9sVAsS9696G1oV00_8p3y.jpg', rating: '8.4' },
    { id: 2, title: 'Interstellar', poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6EwuGvOTj9bq6Jv7vYd.jpg', rating: '8.6' },
    { id: 3, title: 'The Dark Knight', poster: 'https://image.tmdb.org/t/p/w500/1hPl97URIQCp7Ah847G6T_G2H2B.jpg', rating: '9.0' },
    { id: 4, title: 'Memento', poster: 'https://image.tmdb.org/t/p/w500/f9M79vYXf2u2T5a5p_QvYI_O2X1.jpg', rating: '8.4' },
    { id: 5, title: 'Tenet', poster: 'https://image.tmdb.org/t/p/w500/k68nPLb_O7y_O6X8XW9_O6X8XW9.jpg', rating: '7.4' },
    { id: 6, title: 'Dunkirk', poster: 'https://image.tmdb.org/t/p/w500/eb_O7y_O6X8XW9_O6X8XW9.jpg', rating: '7.8' },
  ];

  actionMovies: MovieItem[] = [
    { id: 10, title: 'John Wick', poster: 'https://image.tmdb.org/t/p/w500/zi_O7y_O6X8XW9_O6X8XW9.jpg', rating: '7.4' },
    { id: 11, title: 'Mad Max: Fury Road', poster: 'https://image.tmdb.org/t/p/w500/8t_O7y_O6X8XW9_O6X8XW9.jpg', rating: '8.1' },
    { id: 12, title: 'The Matrix', poster: 'https://image.tmdb.org/t/p/w500/f8_O7y_O6X8XW9_O6X8XW9.jpg', rating: '8.7' },
  ];
}
