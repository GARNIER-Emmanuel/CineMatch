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

  it('devrait retourner true si un film a été marqué comme vu', async () => {
    const csvContent = 'Date,Name,Year,URI,Rating\n2024-11-10,Inception,2010,url,4.5';
    const file = new File([csvContent], 'watched.csv', { type: 'text/csv' });
    await service.importFromCSV(file);
    
    expect(service.isWatched('Inception', '2010')).toBe(true);
  });

  it('devrait être insensible à la casse et aux espaces', async () => {
    const csvContent = 'Date,Name,Year,URI,Rating\n2024-11-10,Inception,2010,url,4.5';
    const file = new File([csvContent], 'watched.csv', { type: 'text/csv' });
    await service.importFromCSV(file);
    
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

  it('devrait sauvegarder et charger les films depuis le localStorage', async () => {
    const csvContent = 'Date,Name,Year,URI,Rating\n2024-11-10,Inception,2010,url,4.5';
    const file = new File([csvContent], 'watched.csv', { type: 'text/csv' });
    await service.importFromCSV(file);
    
    // On crée une nouvelle instance pour simuler un rechargement
    const newService = new WatchedFilmsService();
    
    expect(newService.isWatched('Inception', '2010')).toBe(true);
  });

  it('devrait vider la liste et le localStorage lors du reset', async () => {
    const csvContent = 'Date,Name,Year,URI,Rating\n2024-11-10,Inception,2010,url,4.5';
    const file = new File([csvContent], 'watched.csv', { type: 'text/csv' });
    await service.importFromCSV(file);
    
    service.reset();
    
    expect(service.getCount()).toBe(0);
    expect(localStorage.getItem('cinematch_watched_films')).toBeNull();
  });
});
