import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MoviePaginationComponent } from './movie-pagination';

describe('MoviePaginationComponent', () => {
  let component: MoviePaginationComponent;
  let fixture: ComponentFixture<MoviePaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoviePaginationComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MoviePaginationComponent);
    component = fixture.componentInstance;
    // On ne fait pas de detectChanges ici pour éviter ExpressionChanged
  });

  it('should emit loadMore event when button is clicked', () => {
    fixture.detectChanges();
    let emitted = false;
    component.loadMore.subscribe(() => emitted = true);
    
    const button = fixture.nativeElement.querySelector('.load-more-btn');
    button.click();
    
    expect(emitted).toBe(true);
  });

  it('should disable button and show loader when isLoading is true', () => {
    component.isLoading = true;
    fixture.detectChanges();
    
    const button = fixture.nativeElement.querySelector('.load-more-btn');
    const loader = fixture.nativeElement.querySelector('.loader');
    
    expect(button.disabled).toBe(true);
    expect(loader).toBeTruthy();
  });
});
