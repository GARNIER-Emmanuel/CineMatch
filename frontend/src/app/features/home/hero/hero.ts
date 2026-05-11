import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cm-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="hero">
      <div class="hero-background">
        <img src="https://images.alphacoders.com/513/513684.jpg" alt="Inception Banner">
        <div class="hero-vignette"></div>
      </div>
      
      <div class="hero-content">
        <h1 class="hero-title">INCEPTION</h1>
        <p class="hero-description">
          Dom Cobb est un voleur expérimenté, le meilleur dans l'art périlleux de l'extraction : sa spécialité consiste à s'approprier les secrets les plus précieux d'un individu...
        </p>
        <div class="hero-buttons">
          <button class="btn btn-play">
            <svg viewBox="0 0 24 24" fill="black" width="24" height="24">
              <path d="M8 5.14v14l11-7-11-7z"/>
            </svg>
            Lecture
          </button>
          <button class="btn btn-info glass">
            <svg viewBox="0 0 24 24" fill="white" width="24" height="24">
              <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            </svg>
            Plus d'infos
          </button>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      position: relative;
      height: 80vh;
      width: 100%;
      display: flex;
      align-items: center;
      padding-left: var(--container-padding);
    }

    .hero-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
    }

    .hero-background img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .hero-vignette {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(77deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 85%),
                  linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 25%);
    }

    .hero-content {
      max-width: 600px;
      z-index: 10;
    }

    .hero-title {
      font-size: clamp(2rem, 8vw, 5rem);
      margin-bottom: 20px;
      text-transform: uppercase;
      letter-spacing: 2px;
    }

    .hero-description {
      font-size: 1.1rem;
      line-height: 1.4;
      color: #fff;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.45);
      margin-bottom: 25px;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .hero-buttons {
      display: flex;
      gap: 15px;
    }

    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 10px 25px;
      font-size: 1.1rem;
      font-weight: 700;
      border-radius: 4px;
      border: none;
      cursor: pointer;
      transition: opacity 0.2s;
    }

    .btn:hover {
      opacity: 0.8;
    }

    .btn-play {
      background-color: white;
      color: black;
    }

    .btn-info {
      color: white;
    }

    @media (max-width: 768px) {
      .hero {
        height: 60vh;
      }
      .hero-description {
        font-size: 0.9rem;
        -webkit-line-clamp: 2;
      }
    }
  `]
})
export class HeroComponent {}
