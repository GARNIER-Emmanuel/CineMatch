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

  it('should emit certification for "family" mode by default when Romance is selected', () => {
    fixture.detectChanges();
    let emittedCert: any;
    component.certificationChange.subscribe(val => emittedCert = val);
    
    const romanceBtn = fixture.nativeElement.querySelector('[data-test="genre-10749"]');
    romanceBtn.click();

    expect(emittedCert).toEqual({ country: 'FR', lte: '12' });
  });

  it('should emit null certification when romance mode is "all"', () => {
    fixture.detectChanges();
    
    const romanceBtn = fixture.nativeElement.querySelector('[data-test="genre-10749"]');
    romanceBtn.click();
    fixture.detectChanges();
    
    let emittedCert: any;
    component.certificationChange.subscribe(val => emittedCert = val);
    
    // On clique sur le deuxième bouton (Tout accepter)
    const toggleButtons = fixture.nativeElement.querySelectorAll('.toggle-btn');
    toggleButtons[1].click();
    fixture.detectChanges();
    
    expect(emittedCert).toBeNull();
  });

  it('should reset romance mode when Romance genre is deselected', () => {
    fixture.detectChanges();
    const romanceBtn = fixture.nativeElement.querySelector('[data-test="genre-10749"]');
    
    // Sélection
    romanceBtn.click();
    fixture.detectChanges();
    
    // On passe en mode "all"
    const toggleButtons = fixture.nativeElement.querySelectorAll('.toggle-btn');
    toggleButtons[1].click();
    fixture.detectChanges();
    
    expect(component.romanceMode).toBe('all');
    
    // Désélection du genre Romance
    romanceBtn.click();
    fixture.detectChanges();
    
    expect(component.romanceMode).toBe('family');
    expect(component.selectedGenreIds.length).toBe(0);
  });
});
