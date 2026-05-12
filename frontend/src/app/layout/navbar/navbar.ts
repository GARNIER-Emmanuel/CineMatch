import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cm-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="navbar" [class.scrolled]="isScrolled">
      <div class="nav-left">
        <div class="logo" (click)="onHomeClick()">
          <h1 class="logo-text">CineMatch</h1>
        </div>
        <ul class="nav-links">
          <li [class.active]="currentView === 'home'" (click)="onHomeClick()">Accueil</li>
          <li>Séries</li>
          <li>Films</li>
          <li [class.active]="currentView === 'watchlist'" (click)="onWatchlistClick()">Ma Liste</li>
        </ul>
      </div>
      
      <div class="nav-right">
        <button class="filter-toggle" (click)="onToggleFilters()">
          <span class="icon">🔍</span>
          <span>Recherche & Filtres</span>
        </button>
        <div class="user-profile">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User Avatar">
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 0;
      width: 100%;
      height: 68px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 4%;
      background: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%);
      z-index: 1000;
      transition: background 0.3s ease;
    }

    .navbar.scrolled {
      background: #141414;
    }

    .nav-left {
      display: flex;
      align-items: center;
      gap: 50px;
    }

    .logo {
      cursor: pointer;
    }

    .logo-text {
      color: #E50914;
      font-size: 1.6rem;
      font-weight: 800;
      margin: 0;
      letter-spacing: -1px;
    }

    .nav-links {
      display: flex;
      list-style: none;
      gap: 20px;
      margin: 0;
      padding: 0;
    }

    .nav-links li {
      color: #e5e5e5;
      font-size: 0.85rem;
      cursor: pointer;
      transition: color 0.3s;
      position: relative;
    }

    .nav-links li:hover, .nav-links li.active {
      color: white;
    }

    .nav-links li.active::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 100%;
      height: 2px;
      background: #E50914;
    }

    .nav-right {
      display: flex;
      align-items: center;
      gap: 25px;
    }

    .filter-toggle {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
      padding: 8px 18px;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.85rem;
      font-weight: 600;
      transition: all 0.2s ease;
    }

    .filter-toggle:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.4);
    }

    .user-profile img {
      width: 34px;
      height: 34px;
      border-radius: 4px;
      cursor: pointer;
      box-shadow: 0 0 10px rgba(0,0,0,0.5);
    }
  `]
})
export class NavbarComponent {
  @Input() currentView: string = 'home';
  @Output() toggleFilters = new EventEmitter<void>();
  @Output() navigateHome = new EventEmitter<void>();
  @Output() navigateWatchlist = new EventEmitter<void>();

  isScrolled = false;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        this.isScrolled = window.scrollY > 0;
      });
    }
  }

  onToggleFilters() {
    this.toggleFilters.emit();
  }

  onHomeClick() {
    this.navigateHome.emit();
  }

  onWatchlistClick() {
    this.navigateWatchlist.emit();
  }
}
