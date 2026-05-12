import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cm-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="navbar">
      <div class="nav-left">
        <h1 class="logo">Cine<span>Match</span></h1>
        <div class="nav-links">
          <a href="#" class="active">Accueil</a>
          <a href="#">Films</a>
          <a href="#">Séries</a>
          <a href="#">Ma Liste</a>
        </div>
      </div>
      
      <div class="nav-right">
        <button class="filter-toggle-btn" (click)="onToggleFilters()">
          <span class="icon">🔍</span>
          <span class="text">Recherche & Filtres</span>
        </button>
        <div class="user-profile">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile">
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      height: 68px;
      padding: 0 var(--container-padding);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%);
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      transition: background 0.3s ease;
    }

    .nav-left {
      display: flex;
      align-items: center;
      gap: 40px;
    }

    .logo {
      color: var(--primary-color);
      font-size: 1.8rem;
      font-weight: 800;
      letter-spacing: -1px;
      margin: 0;
      cursor: pointer;
    }

    .logo span {
      color: white;
    }

    .nav-links {
      display: flex;
      gap: 20px;
    }

    .nav-links a {
      color: #e5e5e5;
      text-decoration: none;
      font-size: 0.85rem;
      transition: color 0.3s;
    }

    .nav-links a:hover, .nav-links a.active {
      color: white;
    }

    .nav-right {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .filter-toggle-btn {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      backdrop-filter: blur(5px);
    }

    .filter-toggle-btn:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .filter-toggle-btn:active {
      transform: translateY(0);
    }

    .filter-toggle-btn .icon {
      font-size: 1rem;
    }

    .user-profile img {
      width: 32px;
      height: 32px;
      border-radius: 4px;
      cursor: pointer;
    }

    @media (max-width: 768px) {
      .nav-links, .filter-toggle-btn .text {
        display: none;
      }
      
      .filter-toggle-btn {
        padding: 8px;
        border-radius: 50%;
      }
    }
  `]
})
export class NavbarComponent {
  @Output() toggleFilters = new EventEmitter<void>();

  onToggleFilters(): void {
    this.toggleFilters.emit();
  }
}
