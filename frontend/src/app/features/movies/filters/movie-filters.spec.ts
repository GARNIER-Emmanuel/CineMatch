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
    
    component.selectedGenreId = genreId;
    fixture.detectChanges();
    
    const actionBtn = fixture.nativeElement.querySelector('[data-test="genre-28"]');
    actionBtn.click();
    fixture.detectChanges();

    expect(selectedGenreId).toBeNull();
    expect(component.selectedGenreId).toBeNull();
  });

  it('should update value on input but emit only on change (Duration)', () => {
    fixture.detectChanges();
    const duration = 120;
    let emittedDuration: number | undefined;

    component.durationChange.subscribe((val: number) => emittedDuration = val);
    
    const slider = fixture.nativeElement.querySelector('[data-test="duration-slider"]');
    slider.value = duration.toString();
    
    // Test input : la valeur change mais n'émet pas encore
    slider.dispatchEvent(new Event('input'));
    expect(component.maxDuration).toBe(duration);
    expect(emittedDuration).toBeUndefined();

    // Test change : l'événement est émis
    slider.dispatchEvent(new Event('change'));
    expect(emittedDuration).toBe(duration);
  });

  it('should update value on input but emit only on change (Rating)', () => {
    fixture.detectChanges();
    const rating = 7;
    let emittedRating: number | undefined;

    component.ratingChange.subscribe((val: number) => emittedRating = val);
    
    const ratingInput = fixture.nativeElement.querySelector('[data-test="rating-input"]');
    ratingInput.value = rating.toString();
    
    // Test input : la valeur change mais n'émet pas encore
    ratingInput.dispatchEvent(new Event('input'));
    expect(component.minRating).toBe(rating);
    expect(emittedRating).toBeUndefined();

    // Test change : l'événement est émis
    ratingInput.dispatchEvent(new Event('change'));
    expect(emittedRating).toBe(rating);
  });

  it('should reset all filters to default values', () => {
    component.selectedGenreId = '28';
    component.maxDuration = 90;
    component.minRating = 8;
    
    component.resetFilters();
    
    expect(component.selectedGenreId).toBeNull();
    expect(component.maxDuration).toBe(240);
    expect(component.minRating).toBe(6);
  });
});
