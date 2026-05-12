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

  it('should show romance subfilter only when Romance is selected', () => {
    fixture.detectChanges();
    const romanceBtn = fixture.nativeElement.querySelector('[data-test="genre-10749"]');
    
    expect(fixture.nativeElement.querySelector('.romance-subfilter')).toBeFalsy();
    
    romanceBtn.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.romance-subfilter')).toBeTruthy();
  });

  it('should accumulate provider ids with | separator', () => {
    fixture.detectChanges();
    let emittedProviders: string | null | undefined;
    component.providerChange.subscribe(val => emittedProviders = val);
    
    const netflixBtn = fixture.nativeElement.querySelector('[data-test="provider-8"]');
    const disneyBtn = fixture.nativeElement.querySelector('[data-test="provider-337"]');
    
    netflixBtn.click();
    disneyBtn.click();
    fixture.detectChanges();

    expect(emittedProviders).toBe('8|337');
    expect(component.selectedProviderIds).toEqual(['8', '337']);
  });

  it('should reset all filters including providers', () => {
    fixture.detectChanges();
    component.selectedProviderIds = ['8'];
    component.selectedGenreIds = ['28'];
    
    component.resetFilters();
    fixture.detectChanges();
    
    expect(component.selectedProviderIds.length).toBe(0);
    expect(component.selectedGenreIds.length).toBe(0);
  });

  it('should reset romance mode when Romance genre is deselected', () => {
    fixture.detectChanges();
    const romanceBtn = fixture.nativeElement.querySelector('[data-test="genre-10749"]');
    
    romanceBtn.click();
    fixture.detectChanges();
    
    const toggleButtons = fixture.nativeElement.querySelectorAll('.toggle-btn');
    toggleButtons[1].click();
    fixture.detectChanges();
    
    expect(component.romanceMode).toBe('all');
    
    romanceBtn.click();
    fixture.detectChanges();
    
    expect(component.romanceMode).toBe('family');
  });
});
