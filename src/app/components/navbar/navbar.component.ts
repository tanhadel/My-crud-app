import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';


// Navbar component displayed at the top of all pages
// - Contains navigation to Books and My Quotes
// - Shows logged in user and logout button
// - Dark mode toggle button
// - Uses Bootstrap classes for styling

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Bootstrap navbar with dark theme -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <!-- Brand/Logo -->
        <a class="navbar-brand" routerLink="/books">
          <i class="fas fa-book me-2"></i>
          BookStore
        </a>

        <!-- Hamburger menu for mobile -->
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Navigation links -->
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/books" routerLinkActive="active">
                <i class="fas fa-book me-1"></i>
                Böcker
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/quotes" routerLinkActive="active">
                <i class="fas fa-quote-left me-1"></i>
                Mina citat
              </a>
            </li>
          </ul>
          <div class="navbar-nav align-items-center">
            <!-- Dark mode toggle button -->
            <button 
              class="btn btn-outline-light btn-sm me-3" 
              (click)="toggleTheme()"
              title="check mode"
            >
              <i class="fas" [class.fa-moon]="!themeService.isDarkMode()" [class.fa-sun]="themeService.isDarkMode()"></i>
            </button>
            
            <span class="navbar-text me-3">
              <i class="fas fa-user me-1"></i>
              Välkommen, {{ authService.currentUser()?.username }}
            </span>
            <button class="btn btn-outline-light btn-sm" (click)="logout()">
              <i class="fas fa-sign-out-alt me-1"></i>
              Logga ut
            </button>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar-brand {
      font-weight: bold;
    }
    
    .nav-link.active {
      font-weight: bold;
      color: #fff !important;
    }
    
    .navbar-text {
      color: #ccc !important;
    }
  `]
})
export class NavbarComponent {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  private router = inject(Router);

  /**
   * Toggles between light and dark theme
   */
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  /**
   * Logs out the user and navigates to the login page
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}