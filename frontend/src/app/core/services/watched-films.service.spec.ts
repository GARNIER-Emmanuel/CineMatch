// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { WatchedFilmsService } from './watched-films.service';

describe('WatchedFilmsService', () => {
  let service: WatchedFilmsService;

  beforeEach(() => {
    localStorage.clear();
    service = new WatchedFilmsService();
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  it('devrait retourner true si un film a été marqué comme vu', () => {
    // Simuler l'ajout d'un film (méthode à implémenter)
    // Pour l'instant, on teste le comportement attendu de isWatched
    const film = { title: 'Inception', year: '2010' };
    
    // On simule une importation manuelle pour tester le check
    (service as any).addFilmManually(film.title, film.year);
    
    expect(service.isWatched('Inception', '2010')).toBe(true);
  });

  it('devrait être insensible à la casse et aux espaces', () => {
    (service as any).addFilmManually('Inception', '2010');
    
    expect(service.isWatched(' inception ', '2010')).toBe(true);
  });
});
