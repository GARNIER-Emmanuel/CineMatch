import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cm-movie-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="load-more-container">
      <button 
        class="load-more-btn" 
        (click)="onLoadMore()" 
        [disabled]="isLoading"
        [class.loading]="isLoading">
        <span *ngIf="!isLoading">Afficher plus</span>
        <span *ngIf="isLoading" class="loader"></span>
      </button>
    </div>
  `,
  styles: [`
    .load-more-container {
      display: flex;
      justify-content: center;
      margin: 40px 0 60px;
    }

    .load-more-btn {
      padding: 12px 40px;
      background: white;
      color: black;
      border: none;
      border-radius: 4px;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s ease;
      min-width: 180px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .load-more-btn:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.8);
      transform: scale(1.05);
    }

    .load-more-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .loader {
      width: 20px;
      height: 20px;
      border: 3px solid rgba(0, 0, 0, 0.1);
      border-top-color: black;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class MoviePaginationComponent {
  @Input() isLoading: boolean = false;
  @Output() loadMore = new EventEmitter<void>();

  onLoadMore(): void {
    this.loadMore.emit();
  }
}
