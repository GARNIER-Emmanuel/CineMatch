import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovieFiltersComponent } from './movie-filters';

describe('MovieFiltersComponent', () => {
  let component: MovieFiltersComponent;
  let fixture: ComponentFixture<MovieFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieFiltersComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MovieFiltersComponent);
    component = fixture.componentInstance;
  });

  it('should emit genre id when a genre is selected', () => {
    fixture.detectChanges();
    const genreId = '28'; // Action
    let selectedGenreId: string | null | undefined;

    component.genreChange.subscribe((id: string | null) => selectedGenreId = id);
    
    const actionBtn = fixture.nativeElement.querySelector('[data-test="genre-28"]');
    if (!actionBtn) {
      throw new Error('Action button not found');
    }
    actionBtn.click();

    expect(selectedGenreId).toBe(genreId);
  });

  it('should deselect genre when clicking the same genre again', async () => {
    const genreId = '28';
    let selectedGenreId: string | null | undefined = genreId;

    component.genreChange.subscribe((id: string | null) => selectedGenreId = id);
    
    // On simule une sélection initiale avant toute détection
    component.selectedGenreId = genreId;
    fixture.detectChanges();
    
    const actionBtn = fixture.nativeElement.querySelector('[data-test="genre-28"]');
    actionBtn.click();
    fixture.detectChanges();

    expect(selectedGenreId).toBeNull();
    expect(component.selectedGenreId).toBeNull();
  });

  it('should emit max duration when slider changes', () => {
    fixture.detectChanges();
    const duration = 120;
    let emittedDuration: number | undefined;

    component.durationChange.subscribe((val: number) => emittedDuration = val);
    
    const slider = fixture.nativeElement.querySelector('[data-test="duration-slider"]');
    if (!slider) {
      throw new Error('Duration slider not found');
    }
    slider.value = duration.toString();
    slider.dispatchEvent(new Event('input'));

    expect(emittedDuration).toBe(duration);
  });

  it('should emit min rating when rating selector changes', () => {
    fixture.detectChanges();
    const rating = 7;
    let emittedRating: number | undefined;

    component.ratingChange.subscribe((val: number) => emittedRating = val);
    
    const ratingInput = fixture.nativeElement.querySelector('[data-test="rating-input"]');
    if (!ratingInput) {
      throw new Error('Rating input not found');
    }
    ratingInput.value = rating.toString();
    ratingInput.dispatchEvent(new Event('input'));

    expect(emittedRating).toBe(rating);
  });
});
