import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BookService } from '../../services/book.service';
import { AuthService } from '../../services/auth.service';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="books-container">
      <header class="header">
        <h1>Mina Böcker</h1>
        <div class="user-info">
          <span>Välkommen, {{ authService.currentUser()?.username }}</span>
          <button (click)="logout()" class="btn-logout">Logga ut</button>
        </div>
      </header>

      <div class="content">
        <div class="actions">
          <button class="btn-primary">+ Lägg till bok</button>
        </div>

        <div class="books-grid" *ngIf="books.length > 0; else noBooks">
          <div class="book-card" *ngFor="let book of books">
            <h3>{{ book.title }}</h3>
            <p class="author">av {{ book.author }}</p>
            <p class="details" *ngIf="book.publishedYear">Utgiven: {{ book.publishedYear }}</p>
            <p class="details" *ngIf="book.genre">Genre: {{ book.genre }}</p>
            <div class="card-actions">
              <button class="btn-edit">Redigera</button>
              <button class="btn-delete">Ta bort</button>
            </div>
          </div>
        </div>

        <ng-template #noBooks>
          <div class="empty-state">
            <p>Inga böcker än. Lägg till din första bok!</p>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .books-container {
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
      max-width: 1200px;
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

    .books-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .book-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .book-card h3 {
      margin: 0 0 10px 0;
      color: #333;
    }

    .author {
      color: #666;
      font-style: italic;
      margin: 0 0 10px 0;
    }

    .details {
      color: #888;
      font-size: 14px;
      margin: 5px 0;
    }

    .card-actions {
      margin-top: 15px;
      display: flex;
      gap: 10px;
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
export class BooksComponent implements OnInit {
  private bookService = inject(BookService);
  authService = inject(AuthService);
  private router = inject(Router);

  books: Book[] = [];

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.bookService.getAllBooks().subscribe({
      next: (books) => {
        this.books = books;
      },
      error: (error) => {
        console.error('Kunde inte ladda böcker:', error);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
