import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cm-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav [class.scrolled]="isScrolled" class="navbar">
      <div class="navbar-container">
        <div class="navbar-left">
          <span class="logo">CINEMATCH</span>
          <ul class="nav-links">
            <li class="active">Accueil</li>
            <li>Séries</li>
            <li>Films</li>
            <li>Nouveautés les plus regardées</li>
            <li>Ma liste</li>
          </ul>
        </div>
        <div class="navbar-right">
          <button class="icon-btn" aria-label="Rechercher">
            <svg viewBox="0 0 24 24" fill="white" width="24" height="24">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </button>
          <div class="user-avatar">
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" alt="Profil">
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
      height: var(--nav-height);
      z-index: 1000;
      transition: background-color 0.4s ease;
      background: linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%);
      padding: 0 var(--container-padding);
    }

    .navbar.scrolled {
      background-color: var(--bg-color);
    }

    .navbar-container {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .navbar-left {
      display: flex;
      align-items: center;
      gap: 40px;
    }

    .logo {
      color: var(--primary-color);
      font-size: 25px;
      letter-spacing: -1px;
      cursor: pointer;
    }

    .nav-links {
      display: flex;
      list-style: none;
      gap: 20px;
    }

    .nav-links li {
      color: #e5e5e5;
      font-size: 0.85rem;
      cursor: pointer;
      transition: color 0.3s;
    }

    .nav-links li:hover {
      color: #b3b3b3;
    }

    .nav-links li.active {
      color: #fff;
      font-weight: 700;
    }

    .navbar-right {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .icon-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 5px;
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 4px;
      overflow: hidden;
      cursor: pointer;
    }

    .user-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    @media (max-width: 950px) {
      .nav-links {
        display: none;
      }
    }
  `]
})
export class NavbarComponent {
  isScrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 0;
  }
}
