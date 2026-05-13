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

  it('devrait parser un contenu CSV complexe (guillemets, virgules, espaces) et importer les films', async () => {
    const csvContent = 'Date,Name,Year,URI,Rating\n2024-11-10,"Batman, The Movie",1966,url,4.5\n2025-08-31,28 Weeks Later,2007,https://boxd.it/28Bi';
    
    const file = new File([csvContent], 'watched.csv', { type: 'text/csv' });
    const count = await service.importFromCSV(file);
    
    expect(count).toBe(2);
    expect(service.isWatched('Batman, The Movie', '1966')).toBe(true);
    expect(service.isWatched('28 Weeks Later', '2007')).toBe(true);
  });

  it('devrait trouver les colonnes Name et Year indépendamment de l\'ordre', async () => {
    const csvContent = 'Year,URI,Name,Date\n2022,url,Lightyear,2025-08-31';
    
    const file = new File([csvContent], 'watched.csv', { type: 'text/csv' });
    await service.importFromCSV(file);
    
    expect(service.isWatched('Lightyear', '2022')).toBe(true);
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
