import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MoviePaginationComponent } from './movie-pagination';
import { describe, it, expect, beforeEach } from 'vitest';

describe('MoviePaginationComponent', () => {
  let component: MoviePaginationComponent;
  let fixture: ComponentFixture<MoviePaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoviePaginationComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MoviePaginationComponent);
    component = fixture.componentInstance;
  });

  it('should emit page 2 when next is clicked and current is 1', () => {
    component.currentPage = 1;
    fixture.detectChanges();
    
    let emittedPage: number | undefined;
    component.pageChange.subscribe((page: number) => emittedPage = page);

    const nextBtn = fixture.nativeElement.querySelector('[data-test="next-page"]');
    if (!nextBtn) throw new Error('Next button not found');
    
    nextBtn.click();

    expect(emittedPage).toBe(2);
  });

  it('should emit page 1 when prev is clicked and current is 2', () => {
    component.currentPage = 2;
    fixture.detectChanges();
    
    let emittedPage: number | undefined;
    component.pageChange.subscribe((page: number) => emittedPage = page);

    const prevBtn = fixture.nativeElement.querySelector('[data-test="prev-page"]');
    if (!prevBtn) throw new Error('Prev button not found');
    
    prevBtn.click();

    expect(emittedPage).toBe(1);
  });

  it('should disable prev button when current page is 1', () => {
    component.currentPage = 1;
    fixture.detectChanges();
    
    const prevBtn = fixture.nativeElement.querySelector('[data-test="prev-page"]');
    expect(prevBtn.disabled).toBe(true);
  });
});
