import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cm-movie-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton-card">
      <div class="skeleton-image"></div>
      <div class="skeleton-info">
        <div class="skeleton-text title"></div>
        <div class="skeleton-text rating"></div>
      </div>
    </div>
  `,
  styles: [`
    .skeleton-card {
      flex: 0 0 auto;
      width: 200px;
      height: 300px;
      background: #1a1a1a;
      border-radius: 4px;
      overflow: hidden;
      position: relative;
    }

    .skeleton-image {
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%);
      background-size: 200% 100%;
      animation: pulse 1.5s infinite;
    }

    .skeleton-info {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 15px 10px;
      background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
    }

    .skeleton-text {
      background: #333;
      border-radius: 2px;
      margin-bottom: 8px;
      animation: pulse 1.5s infinite;
    }

    .skeleton-text.title {
      width: 80%;
      height: 12px;
    }

    .skeleton-text.rating {
      width: 40%;
      height: 10px;
    }

    @keyframes pulse {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    @media (max-width: 600px) {
      .skeleton-card {
        width: 150px;
        height: 225px;
      }
    }
  `]
})
export class MovieSkeletonComponent {}
