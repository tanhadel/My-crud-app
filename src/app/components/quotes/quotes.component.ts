import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { QuoteService } from '../../services/quote.service';
import { AuthService } from '../../services/auth.service';
import { Quote } from '../../models/quote.model';

@Component({
  selector: 'app-quotes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="quotes-container">
      <header class="header">
        <h1>Citat</h1>
        <div class="user-info">
          <span>Välkommen, {{ authService.currentUser()?.username }}</span>
          <button (click)="logout()" class="btn-logout">Logga ut</button>
        </div>
      </header>

      <div class="content">
        <div class="actions">
          <button class="btn-primary">+ Lägg till citat</button>
        </div>

        <div class="quotes-list" *ngIf="quotes.length > 0; else noQuotes">
          <div class="quote-card" *ngFor="let quote of quotes">
            <p class="quote-text">"{{ quote.text }}"</p>
            <p class="quote-author">— {{ quote.author }}</p>
            <div class="card-actions">
              <button class="btn-edit">Redigera</button>
              <button class="btn-delete">Ta bort</button>
            </div>
          </div>
        </div>

        <ng-template #noQuotes>
          <div class="empty-state">
            <p>Inga citat än. Lägg till ditt första citat!</p>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .quotes-container {
      min-height: 100vh;
      background-color: #f5f5f5;
    }

    .header {
      background: white;
      padding: 20px 40px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    h1 {
      margin: 0;
      color: #333;
    }

    .user-info {
      display: flex;
      gap: 15px;
      align-items: center;
    }

    .btn-logout {
      padding: 8px 16px;
      background-color: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .btn-logout:hover {
      background-color: #c82333;
    }

    .content {
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }

    .actions {
      margin-bottom: 30px;
    }

    .btn-primary {
      padding: 12px 24px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
    }

    .btn-primary:hover {
      background-color: #0056b3;
    }

    .quotes-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .quote-card {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .quote-text {
      font-size: 18px;
      color: #333;
      margin: 0 0 15px 0;
      line-height: 1.6;
      font-style: italic;
    }

    .quote-author {
      color: #666;
      margin: 0 0 15px 0;
      text-align: right;
    }

    .card-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }

    .btn-edit, .btn-delete {
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }

    .btn-edit {
      background-color: #28a745;
      color: white;
    }

    .btn-edit:hover {
      background-color: #218838;
    }

    .btn-delete {
      background-color: #dc3545;
      color: white;
    }

    .btn-delete:hover {
      background-color: #c82333;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #666;
      font-size: 18px;
    }
  `]
})
export class QuotesComponent implements OnInit {
  private quoteService = inject(QuoteService);
  authService = inject(AuthService);
  private router = inject(Router);

  quotes: Quote[] = [];

  ngOnInit(): void {
    this.loadQuotes();
  }

  loadQuotes(): void {
    this.quoteService.getAllQuotes().subscribe({
      next: (quotes) => {
        this.quotes = quotes;
      },
      error: (error) => {
        console.error('Kunde inte ladda citat:', error);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
