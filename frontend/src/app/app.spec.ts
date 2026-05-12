import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MoviesService } from './core/services/movies';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockMoviesService: any;

  beforeEach(async () => {
    mockMoviesService = {
      getMovies: vi.fn().mockReturnValue(of([]))
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent, HttpClientTestingModule],
      providers: [
        { provide: MoviesService, useValue: mockMoviesService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should display "Le service TMDB est temporairement indisponible." on 502 error', () => {
    mockMoviesService.getMovies.mockReturnValue(throwError(() => ({ status: 502 })));
    
    component.loadAllMovies();
    fixture.detectChanges();

    const errorContainer = fixture.nativeElement.querySelector('.error-container');
    expect(errorContainer).toBeTruthy();
    expect(errorContainer.textContent).toContain('Le service TMDB est temporairement indisponible.');
  });

  it('should display "Erreur de configuration serveur (Clé API)." on 401 error', () => {
    mockMoviesService.getMovies.mockReturnValue(throwError(() => ({ status: 401 })));
    
    component.loadAllMovies();
    fixture.detectChanges();

    const errorContainer = fixture.nativeElement.querySelector('.error-container');
    expect(errorContainer).toBeTruthy();
    expect(errorContainer.textContent).toContain('Erreur de configuration serveur (Clé API).');
  });
});
