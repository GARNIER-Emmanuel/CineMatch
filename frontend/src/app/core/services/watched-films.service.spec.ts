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

  it('devrait parser un contenu CSV et importer les films', async () => {
    const csvContent = 'Date,Name,Year,URI,Rating\n2024-11-10,Inception,2010,url,4.5\n2024-09-03,The Dark Knight,2008,url,5.0';
    
    // On simule un fichier File
    const file = new File([csvContent], 'watched.csv', { type: 'text/csv' });
    
    const count = await service.importFromCSV(file);
    
    expect(count).toBe(2);
    expect(service.getCount()).toBe(2);
    expect(service.isWatched('Inception', '2010')).toBe(true);
    expect(service.isWatched('The Dark Knight', '2008')).toBe(true);
  });

  it('devrait sauvegarder et charger les films depuis le localStorage', () => {
    (service as any).addFilmManually('Inception', '2010');
    (service as any).saveToStorage();
    
    // On crée une nouvelle instance pour simuler un rechargement
    const newService = new WatchedFilmsService();
    // Normalement loadFromStorage est appelé dans le constructor
    
    expect(newService.isWatched('Inception', '2010')).toBe(true);
  });
});
