import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cm-movie-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pagination-container">
      <button 
        class="pagination-btn glass" 
        [disabled]="currentPage === 1"
        (click)="prevPage()"
        data-test="prev-page">
        Précédent
      </button>
      
      <span class="page-indicator">Page {{ currentPage }}</span>

      <button 
        class="pagination-btn glass" 
        (click)="nextPage()"
        data-test="next-page">
        Suivant
      </button>
    </div>
  `,
  styles: [`
    .pagination-container {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 20px;
      margin: 30px 0;
    }

    .pagination-btn {
      padding: 10px 20px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      background: rgba(255, 255, 255, 0.05);
      color: white;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .pagination-btn:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.1);
      border-color: var(--primary-color);
    }

    .pagination-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .page-indicator {
      font-size: 1rem;
      color: var(--text-secondary);
      font-weight: 600;
    }
  `]
})
export class MoviePaginationComponent {
  @Input() currentPage: number = 1;
  @Output() pageChange = new EventEmitter<number>();

  nextPage(): void {
    this.pageChange.emit(this.currentPage + 1);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }
}
