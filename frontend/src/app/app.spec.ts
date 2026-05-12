import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MoviesService } from './core/services/movies';
import { of } from 'rxjs';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, HttpClientTestingModule],
      providers: [
        {
          provide: MoviesService,
          useValue: {
            getMovies: () => of([])
          }
        }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
