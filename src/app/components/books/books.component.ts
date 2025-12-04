import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BookService } from '../../services/book.service';
import { AuthService } from '../../services/auth.service';
import { Book } from '../../models/book.model';
import { NavbarComponent } from '../navbar/navbar.component';
import { AddBookModalComponent } from '../add-book-modal/add-book-modal.component';
import { EditBookModalComponent } from '../edit-book-modal/edit-book-modal.component';
import { signal } from '@angular/core';


 //  Main component for books (Home page)
 // Displays list of all books in Bootstrap cards
 // Contains navbar for navigation
 // CRUD functionality: add, edit, delete books
 // Responsive design with Bootstrap grid system
 
@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, NavbarComponent, AddBookModalComponent, EditBookModalComponent],
  template: `
    <!-- Navbar at top -->
    <app-navbar></app-navbar>

    <div class="container-fluid py-4">
      <!-- Page header with title and add button -->
      <div class="row mb-4">
        <div class="col">
          <div class="d-flex justify-content-between align-items-center">
            <h1 class="mb-0">
              <i class="fas fa-book me-2 text-primary"></i>
              Mina Böcker
            </h1>
            <button 
              class="btn btn-primary btn-lg"
              data-bs-toggle="modal"
              data-bs-target="#addBookModal"
            >
              <i class="fas fa-plus me-2"></i>
              Lägg till bok
            </button>
          </div>
        </div>
      </div>

      <!-- Loading spinner -->
      <div class="row" *ngIf="isLoading">
        <div class="col text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Laddar...</span>
          </div>
          <p class="mt-2">Laddar böcker...</p>
        </div>
      </div>

      <!-- List of books in cards -->
      <div class="row" *ngIf="books().length > 0">
        <div class="col-lg-4 col-md-6 mb-4" *ngFor="let book of books()">
          <!-- Bootstrap card for each book -->
          <div class="card h-100 shadow-sm book-card">
            <div class="card-header bg-light">
              <h5 class="card-title mb-0">
                <i class="fas fa-book-open me-2 text-primary"></i>
                {{ book.title }}
              </h5>
            </div>
            
            <div class="card-body">
              <!-- Author -->
              <p class="card-text">
                <strong>
                  <i class="fas fa-user-edit me-1 text-secondary"></i>
                  Författare:
                </strong>
                {{ book.author }}
              </p>
              
              <!-- ISBN (if available) -->
              <p class="card-text" *ngIf="book.isbn">
                <strong>
                  <i class="fas fa-barcode me-1 text-secondary"></i>
                  ISBN:
                </strong>
                {{ book.isbn }}
              </p>
              
              <!-- Published year (if available) -->
              <p class="card-text" *ngIf="book.publishedYear">
                <strong>
                  <i class="fas fa-calendar me-1 text-secondary"></i>
                  År:
                </strong>
                {{ book.publishedYear }}
              </p>
              
              <!-- Genre (if available) -->
              <p class="card-text" *ngIf="book.genre">
                <span class="badge bg-info">
                  <i class="fas fa-tag me-1"></i>
                  {{ translateGenre(book.genre) }}
                </span>
              </p>
            </div>
            
            <!-- Action buttons -->
            <div class="card-footer bg-transparent">
              <div class="btn-group w-100" role="group">
                <button 
                  class="btn btn-outline-warning"
                  (click)="editBook(book)"
                  title="Redigera bok"
                >
                  <i class="fas fa-edit"></i>
                  Redigera
                </button>
                <button 
                  class="btn btn-outline-danger"
                  (click)="confirmDeleteBook(book)"
                  title="Ta bort bok"
                >
                  <i class="fas fa-trash"></i>
                  Ta bort
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Message when no books exist -->
      <div class="row" *ngIf="books().length === 0">
        <div class="col text-center py-5">
          <div class="empty-state">
            <i class="fas fa-book fa-3x text-muted mb-3"></i>
            <h3 class="text-muted">Inga böcker än</h3>
            <p class="text-muted mb-4">Kom igång genom att lägga till din första bok!</p>
            <button 
              class="btn btn-primary btn-lg"
              data-bs-toggle="modal"
              data-bs-target="#addBookModal"
            >
              <i class="fas fa-plus me-2"></i>
              Lägg till första boken
            </button>
          </div>
        </div>
      </div>

      <!-- Error message -->
      <div class="row" *ngIf="errorMessage">
        <div class="col">
          <div class="alert alert-danger" role="alert">
            <i class="fas fa-exclamation-triangle me-2"></i>
            {{ errorMessage }}
            <button class="btn btn-sm btn-outline-danger ms-2" (click)="loadBooks()">
              <i class="fas fa-redo me-1"></i>
              Försök igen
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals for adding and editing books -->
    <app-add-book-modal (bookAdded)="onBookAdded()"></app-add-book-modal>
    <app-edit-book-modal #editModal (bookUpdated)="onBookUpdated()"></app-edit-book-modal>
  `,
  styles: [`
    .book-card {
      transition: transform 0.2s ease-in-out;
      border: 1px solid #dee2e6;
    }

    .book-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
    }

    .card-title {
      font-size: 1.1rem;
      font-weight: 600;
    }

    .empty-state {
      padding: 3rem;
    }

    .btn-group .btn {
      font-size: 0.875rem;
    }

    .card-footer {
      background-color: #f8f9fa !important;
    }

    .badge {
      font-size: 0.75rem;
    }
  `]
})
export class BooksComponent implements OnInit {
  private bookService = inject(BookService);
  authService = inject(AuthService);
  private router = inject(Router);

  books = signal<Book[]>([]);
  isLoading = false;
  errorMessage = '';

  @ViewChild('editModal') editModal!: EditBookModalComponent;

  ngOnInit(): void {
    this.loadBooks();
  }

  // Translates genre from English to Swedish

  translateGenre(genre: string | undefined): string {
    if (!genre) return '';
    const translations: { [key: string]: string } = {
      'Fantasy': 'Fantasy',
      'Science Fiction': 'Science Fiction',
      'Mystery': 'Mysterium',
      'Thriller': 'Thriller',
      'Romance': 'Romantik',
      'Horror': 'Skräck',
      'Historical Fiction': 'Historisk fiktion',
      'Biography': 'Biografi',
      'Self-Help': 'Självhjälp',
      'Fiction': 'Skrönlitteratur',
      'Non-Fiction': 'Facklitteratur'
    };
    return translations[genre] || genre;
  }


   // Loads all books from backend

  loadBooks(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.bookService.getAllBooks().subscribe({
      next: (books: Book[]) => {
        this.books.set(books);
        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = 'Kunde inte ladda böcker. Kontrollera din internetanslutning.';
      }
    });
  }
  
  // Event handler when a new book is added
  
  onBookAdded(): void {
    this.loadBooks(); 
    // Reload the list
  }
  // Event handler when a book is updated
  onBookUpdated(): void {
    this.loadBooks(); 
    
  }

  
   // Opens edit modal for specific book
   
  editBook(book: Book): void {
    this.editModal.openModal(book);
  }

   // Confirms and deletes book
  confirmDeleteBook(book: Book): void {
    const confirmMessage = `Är du säker på att du vill ta bort "${book.title}" av ${book.author}?`;
    
    if (confirm(confirmMessage)) {
      this.deleteBook(book.id);
    }
  }

   // Deletes book from backend
  private deleteBook(id: number): void {
    this.bookService.deleteBook(id).subscribe({
      next: () => {
        this.loadBooks(); 
      },
      error: (error: any) => {
        this.errorMessage = 'Kunde inte ta bort bok. Försök igen.';
        console.error('Error deleting book:', error);
      }
    });
  }
}