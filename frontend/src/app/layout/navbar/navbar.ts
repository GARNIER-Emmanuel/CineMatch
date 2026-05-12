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
          <h1 class="logo-text">Cine<span>Match</span></h1>
        </div>
        <ul class="nav-links">
          <li [class.active]="currentView === 'home'" (click)="onHomeClick()">Accueil</li>
          <li class="cinescroll-link" [class.active]="currentView === 'cinescroll'" (click)="onCineScrollClick()">
            CineScroll
          </li>
          <li [class.active]="currentView === 'watchlist'" (click)="onWatchlistClick()">Ma Liste</li>
        </ul>
      </div>
      
      <div class="nav-right">
        <button class="filter-toggle" (click)="onToggleFilters()">
          <span class="icon">🔍</span>
          <span>Recherche VIP</span>
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
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 4%;
      background: linear-gradient(to bottom, rgba(5, 8, 15, 0.9) 0%, transparent 100%);
      z-index: 1000;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .navbar.scrolled {
      background: #05080f;
      border-bottom: 1px solid rgba(255, 180, 0, 0.1);
      height: 60px;
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
      color: white;
      font-family: 'Playfair Display', serif;
      font-size: 1.8rem;
      font-weight: 900;
      margin: 0;
      letter-spacing: -0.5px;
    }

    .logo-text span {
      color: #ffb400; /* Or Ambré */
    }

    .nav-links {
      display: flex;
      list-style: none;
      gap: 25px;
      margin: 0;
      padding: 0;
    }

    .nav-links li {
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s;
      position: relative;
    }

    .nav-links li:hover, .nav-links li.active {
      color: #ffb400;
    }

    .nav-links li.active::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
      width: 4px;
      height: 4px;
      background: #ffb400;
      border-radius: 50%;
      box-shadow: 0 0 10px #ffb400;
    }

    .nav-right {
      display: flex;
      align-items: center;
      gap: 30px;
    }

    .filter-toggle {
      background: rgba(255, 180, 0, 0.1);
      border: 1px solid rgba(255, 180, 0, 0.3);
      color: #ffb400;
      padding: 8px 20px;
      border-radius: 20px; /* Plus arrondi pour le look Cinema */
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      transition: all 0.3s ease;
    }

    .filter-toggle:hover {
      background: #ffb400;
      color: #05080f;
      box-shadow: 0 0 20px rgba(255, 180, 0, 0.4);
    }

    .user-profile img {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 2px solid rgba(255, 180, 0, 0.2);
      cursor: pointer;
      transition: transform 0.3s;
    }

    .user-profile img:hover {
      transform: scale(1.1);
      border-color: #ffb400;
    }
  `]
})
export class NavbarComponent {
  @Input() currentView: string = 'home';
  @Output() toggleFilters = new EventEmitter<void>();
  @Output() navigateHome = new EventEmitter<void>();
  @Output() navigateWatchlist = new EventEmitter<void>();
  @Output() navigateCineScroll = new EventEmitter<void>();

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

  onCineScrollClick() {
    this.navigateCineScroll.emit();
  }
}
