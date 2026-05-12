import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoviesService, Movie } from '../../core/services/movies';

@Component({
  selector: 'cm-directors',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="directors-page">
      <header class="page-header">
        <h1>Les Grands Réalisateurs</h1>
        <p>Explorez les génies derrière la caméra, classés par époques marquantes.</p>
      </header>

       <div class="loader-container" *ngIf="loading">
         <div class="cinema-loader"></div>
       </div>

       <div class="epochs-list" *ngIf="!loading">
         @for (epoch of epochs; track epoch.title) {
           <section class="epoch-section">
             <h2 class="epoch-title">{{ epoch.title }}</h2>
             <div class="directors-grid">
               @for (director of epoch.directors; track director.id) {
                 <div class="director-card" (click)="onDirectorClick(director)">
                   <div class="card-image">
                     <img [src]="director.image || 'https://api.dicebear.com/7.x/initials/svg?seed=' + director.name" alt="{{ director.name }}">
                     <div class="hover-overlay">
                       <span>Voir la bio</span>
                     </div>
                   </div>
                   <div class="card-info">
                     <h3>{{ director.name }}</h3>
                   </div>
                 </div>
               }
             </div>
           </section>
         }
       </div>
     </div>
   `,
   styles: [`
      .directors-page {
        padding: 20px 4% 40px;
        min-height: 100vh;
        background: #05080f;
      }

      .page-header {
        margin-bottom: 50px;
        max-width: 800px;
      }

      .page-header h1 {
        font-size: 3rem;
        font-family: 'Playfair Display', serif;
        margin-bottom: 10px;
        background: linear-gradient(to right, #fff, #ffb400);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .page-header p {
        color: rgba(255, 255, 255, 0.6);
        font-size: 1.1rem;
      }

      .epoch-section {
        margin-bottom: 60px;
      }

      .epoch-title {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 25px;
        padding-left: 10px;
        border-left: 3px solid #ffb400;
        color: white;
      }

      .directors-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 30px;
      }

      .director-card {
        cursor: pointer;
        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .director-card:hover {
        transform: translateY(-10px);
      }

      .card-image {
        position: relative;
        aspect-ratio: 1/1;
        border-radius: 50%;
        overflow: hidden;
        margin-bottom: 15px;
        border: 2px solid rgba(255, 180, 0, 0.1);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        transition: all 0.4s;
      }

      .director-card:hover .card-image {
        border-color: #ffb400;
        box-shadow: 0 15px 40px rgba(255, 180, 0, 0.2);
      }

      .card-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .director-card:hover img {
        transform: scale(1.1);
      }

      .hover-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(5, 8, 15, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s;
      }

      .director-card:hover .hover-overlay {
        opacity: 1;
      }

      .hover-overlay span {
        background: #ffb400;
        color: #05080f;
        padding: 6px 15px;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        transform: translateY(10px);
        transition: transform 0.3s;
      }

      .director-card:hover .hover-overlay span {
        transform: translateY(0);
      }

      .card-info h3 {
        font-size: 1rem;
        text-align: center;
        margin: 0;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.9);
        transition: color 0.3s;
      }

      .director-card:hover .card-info h3 {
        color: #ffb400;
      }

      .loader-container {
        display: flex;
        justify-content: center;
        padding: 100px 0;
      }

      @media (max-width: 768px) {
        .directors-grid {
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 20px;
        }
        .page-header h1 {
          font-size: 2.2rem;
        }
      }
    `]
})
export class DirectorsComponent implements OnInit {
  @Output() directorClick = new EventEmitter<any>();
  
  epochs: any[] = [];
  loading = true;

  constructor(
    private moviesService: MoviesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.moviesService.getPopularDirectors().subscribe({
      next: (data: any[]) => {
        this.epochs = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onDirectorClick(director: any) {
    this.directorClick.emit(director);
  }
}
