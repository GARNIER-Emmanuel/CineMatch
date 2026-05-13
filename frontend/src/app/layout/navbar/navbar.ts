import { Component, Output, EventEmitter, Input, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WatchedImportComponent } from '../../features/watched-import/watched-import.component';

@Component({
  selector: 'cm-navbar',
  standalone: true,
  imports: [CommonModule, WatchedImportComponent],
  template: `
    <nav class="navbar" [class.scrolled]="isScrolled">
      <div class="nav-left">
        <div class="logo" (click)="onHomeClick()">
          <h1 class="logo-text">Cine<span>Match</span></h1>
        </div>
        <ul class="nav-links">
          <li [class.active]="currentView === 'home'" (click)="onHomeClick()">Accueil</li>
          <li [class.active]="currentView === 'directors'" (click)="onDirectorsClick()">Réalisateurs</li>
          <li [class.active]="currentView === 'regefilms'" (click)="onRegeFilmsClick()">Regelegorila</li>
          <li class="cinescroll-link" [class.active]="currentView === 'cinescroll'" (click)="onCineScrollClick()">
            CineScroll
          </li>
          <li [class.active]="currentView === 'watchlist'" (click)="onWatchlistClick()">Ma Liste</li>
        </ul>
      </div>
      
      <div class="nav-right">
        <div class="search-bar">
          <span class="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Rechercher un film, un réalisateur..." 
            (input)="onSearchInput($event)"
            (keyup.enter)="onSearchEnter($event)"
            #searchInput>
        </div>
        <button class="filter-toggle" (click)="onToggleFilters()">
          <span class="icon">✨</span>
          <span>Filtres</span>
        </button>
        
        <!-- PROFIL & MENU DÉROULANT -->
        <div class="user-container" #userContainer>
          <div class="user-profile" (click)="toggleUserMenu()">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User Avatar">
            <span class="dropdown-arrow">▼</span>
          </div>

          <div class="user-dropdown" *ngIf="isUserMenuOpen">
            <div class="dropdown-header">
              <span class="user-name">Mon Compte</span>
            </div>
            <div class="dropdown-section">
              <span class="section-title">Import Letterboxd</span>
              <app-watched-import></app-watched-import>
            </div>
          </div>
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

    .search-bar {
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 6px 15px;
      border-radius: 20px;
      gap: 10px;
      width: 300px;
      transition: all 0.3s;
    }

    .search-bar:focus-within {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 180, 0, 0.5);
      width: 350px;
    }

    .search-bar input {
      background: transparent;
      border: none;
      color: white;
      font-size: 0.85rem;
      width: 100%;
      outline: none;
    }

    .search-bar input::placeholder {
      color: rgba(255, 255, 255, 0.3);
    }

    .search-icon { font-size: 0.9rem; opacity: 0.5; }

    .filter-toggle {
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
      padding: 8px 18px;
      border-radius: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      transition: all 0.3s ease;
    }

    .filter-toggle:hover {
      background: #ffb400;
      color: #05080f;
      box-shadow: 0 0 20px rgba(255, 180, 0, 0.4);
    }

    .user-container {
      position: relative;
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 30px;
      transition: background 0.3s;
    }

    .user-profile:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    .user-profile img {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 2px solid rgba(255, 180, 0, 0.2);
      transition: transform 0.3s;
    }

    .user-profile:hover img {
      transform: scale(1.05);
      border-color: #ffb400;
    }

    .dropdown-arrow {
      font-size: 0.6rem;
      color: rgba(255, 255, 255, 0.4);
      transition: transform 0.3s;
    }

    .user-dropdown {
      position: absolute;
      top: calc(100% + 15px);
      right: 0;
      width: 300px;
      background: rgba(10, 15, 25, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
      padding: 20px;
      animation: dropdownSlide 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 1001;
    }

    @keyframes dropdownSlide {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .dropdown-header {
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .user-name {
      font-weight: bold;
      color: white;
      font-size: 0.9rem;
    }

    .dropdown-section {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .section-title {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: rgba(255, 255, 255, 0.3);
      font-weight: bold;
    }
  `]
})
export class NavbarComponent {
  @Input() currentView: string = 'home';
  @Output() toggleFilters = new EventEmitter<void>();
  @Output() navigateHome = new EventEmitter<void>();
  @Output() navigateWatchlist = new EventEmitter<void>();
  @Output() navigateCineScroll = new EventEmitter<void>();
  @Output() navigateDirectors = new EventEmitter<void>();
  @Output() navigateRegeFilms = new EventEmitter<void>();
  @Output() search = new EventEmitter<{ query: string; immediate: boolean }>();

  @ViewChild('userContainer') userContainer!: ElementRef;

  isScrolled = false;
  isUserMenuOpen = false;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        this.isScrolled = window.scrollY > 0;
      });
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.isUserMenuOpen && !this.userContainer.nativeElement.contains(event.target)) {
      this.isUserMenuOpen = false;
    }
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
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

  onDirectorsClick() {
    this.navigateDirectors.emit();
  }

  onRegeFilmsClick() {
    this.navigateRegeFilms.emit();
  }

  onSearchInput(event: any) {
    const query = event.target.value;
    this.search.emit({ query, immediate: false });
  }

  onSearchEnter(event: any) {
    const query = event.target.value;
    this.search.emit({ query, immediate: true });
  }
}
