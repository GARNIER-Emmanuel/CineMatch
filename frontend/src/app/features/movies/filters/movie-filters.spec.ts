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

  it('should accumulate genre ids when multiple genres are selected', () => {
    fixture.detectChanges();
    let emittedGenres: string | null | undefined;

    component.genreChange.subscribe((val: string | null) => emittedGenres = val);
    
    const actionBtn = fixture.nativeElement.querySelector('[data-test="genre-28"]');
    const adventureBtn = fixture.nativeElement.querySelector('[data-test="genre-12"]');
    
    actionBtn.click();
    adventureBtn.click();

    expect(emittedGenres).toBe('28,12');
    expect(component.selectedGenreIds).toEqual(['28', '12']);
  });

  it('should remove genre id when clicking a selected genre', () => {
    fixture.detectChanges();
    let emittedGenres: string | null | undefined;
    component.selectedGenreIds = ['28', '12'];
    
    component.genreChange.subscribe((val: string | null) => emittedGenres = val);
    
    const actionBtn = fixture.nativeElement.querySelector('[data-test="genre-28"]');
    actionBtn.click();

    expect(emittedGenres).toBe('12');
    expect(component.selectedGenreIds).toEqual(['12']);
  });

  it('should update value on input but emit only on change (Duration)', () => {
    fixture.detectChanges();
    const duration = 120;
    let emittedDuration: number | undefined;

    component.durationChange.subscribe((val: number) => emittedDuration = val);
    
    const slider = fixture.nativeElement.querySelector('[data-test="duration-slider"]');
    slider.value = duration.toString();
    
    slider.dispatchEvent(new Event('input'));
    slider.dispatchEvent(new Event('change'));
    
    expect(component.maxDuration).toBe(duration);
    expect(emittedDuration).toBe(duration);
  });

  it('should reset all filters', () => {
    component.selectedGenreIds = ['28', '12'];
    component.maxDuration = 90;
    
    component.resetFilters();
    
    expect(component.selectedGenreIds.length).toBe(0);
    expect(component.maxDuration).toBe(240);
  });
});
