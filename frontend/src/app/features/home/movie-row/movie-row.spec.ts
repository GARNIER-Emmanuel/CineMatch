import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovieRowComponent } from './movie-row';
import { MovieSkeletonComponent } from '../movie-skeleton/movie-skeleton';

describe('MovieRowComponent', () => {
  let component: MovieRowComponent;
  let fixture: ComponentFixture<MovieRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieRowComponent, MovieSkeletonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MovieRowComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display skeletons when loading is true', () => {
    component.loading = true;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('cm-movie-skeleton').length).toBeGreaterThan(0);
  });

  it('should display movies when loading is false and movies are provided', () => {
    component.loading = false;
    component.movies = [{ id: 1, title: 'Test', poster: '', rating: '8', overview: 'Test', backdrop: '', releaseYear: '2020' }];
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.movie-card').length).toBe(1);
    expect(compiled.querySelectorAll('cm-movie-skeleton').length).toBe(0);
  });
});
