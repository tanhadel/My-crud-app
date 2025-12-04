import { Component, inject, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuoteService } from '../../services/quote.service';
import { BookService } from '../../services/book.service';
import { CreateQuoteRequest } from '../../models/quote.model';
import { Book } from '../../models/book.model';


 // Modal component for adding new quotes
 // Bootstrap modal with form
 // Dropdown to select which book the quote comes from
 // Validation of all required fields

@Component({
  selector: 'app-add-quote-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <!-- Bootstrap Modal -->
    <div class="modal fade" id="addQuoteModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <!-- Modal header -->
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-quote-left me-2"></i>
              Lägg till nytt citat
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <!-- Modal body with form -->
          <div class="modal-body">
            <form [formGroup]="quoteForm" (ngSubmit)="onSubmit()">
              <!-- Quote text field -->
              <div class="mb-3">
                <label for="text" class="form-label">
                  <i class="fas fa-quote-left me-1"></i>
                  Citat-text *
                </label>
                <textarea 
                  id="text"
                  class="form-control"
                  formControlName="text"
                  rows="4"
                  [class.is-invalid]="quoteForm.get('text')?.invalid && quoteForm.get('text')?.touched"
                  placeholder="Skriv citatet här..."
                ></textarea>
                <div class="invalid-feedback" *ngIf="quoteForm.get('text')?.invalid && quoteForm.get('text')?.touched">
                  Citat-text är obligatorisk
                </div>
              </div>

              <!-- Author field -->
              <div class="mb-3">
                <label for="author" class="form-label">
                  <i class="fas fa-user-edit me-1"></i>
                  Författare *
                </label>
                <input 
                  id="author"
                  type="text" 
                  class="form-control"
                  formControlName="author"
                  [class.is-invalid]="quoteForm.get('author')?.invalid && quoteForm.get('author')?.touched"
                  placeholder="Vem sa detta?"
                />
                <div class="invalid-feedback" *ngIf="quoteForm.get('author')?.invalid && quoteForm.get('author')?.touched">
                  Författare är obligatorisk
                </div>
              </div>

              <!-- Book selection field -->
              <div class="mb-3">
                <label for="bookId" class="form-label">
                  <i class="fas fa-book me-1"></i>
                  Välj bok *
                </label>
                <select 
                  id="bookId" 
                  class="form-select"
                  formControlName="bookId"
                  [class.is-invalid]="quoteForm.get('bookId')?.invalid && quoteForm.get('bookId')?.touched"
                >
                  <option value="">Välj vilken bok citatet kommer från</option>
                  <option *ngFor="let book of books" [value]="book.id">
                    {{ book.title }}
                  </option>
                </select>
                <div class="invalid-feedback" *ngIf="quoteForm.get('bookId')?.invalid && quoteForm.get('bookId')?.touched">
                  Du måste välja en bok
                </div>
              </div>

              <!-- Page number field (optional) -->
              <div class="mb-3">
                <label for="pageNumber" class="form-label">
                  <i class="fas fa-bookmark me-1"></i>
                  Sidnummer (valfritt)
                </label>
                <input 
                  id="pageNumber"
                  type="number" 
                  class="form-control"
                  formControlName="pageNumber"
                  min="1"
                  placeholder="På vilken sida finns citatet?"
                />
              </div>

              <!-- Error message -->
              <div class="alert alert-danger" *ngIf="errorMessage">
                <i class="fas fa-exclamation-triangle me-2"></i>
                {{ errorMessage }}
              </div>

              <!-- Warning about no books -->
              <div class="alert alert-warning" *ngIf="books.length === 0">
                <i class="fas fa-info-circle me-2"></i>
                Du måste först skapa minst en bok för att kunna lägga till citat.
                <a href="/books" class="alert-link ms-1">Gå till Böcker</a>
              </div>
            </form>
          </div>

          <!-- Modal footer with buttons -->
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              <i class="fas fa-times me-1"></i>
              Avbryt
            </button>
            <button 
              type="button" 
              class="btn btn-primary"
              [disabled]="quoteForm.invalid || isLoading || books.length === 0"
              (click)="onSubmit()"
            >
              <i class="fas fa-spinner fa-spin me-1" *ngIf="isLoading"></i>
              <i class="fas fa-save me-1" *ngIf="!isLoading"></i>
              {{ isLoading ? 'Sparar...' : 'Spara citat' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-header {
      background-color: #17a2b8;
      color: white;
    }
    
    .form-label {
      font-weight: 500;
    }
    
    .btn-close {
      filter: invert(1);
    }

    textarea {
      resize: vertical;
      min-height: 100px;
    }
  `]
})
export class AddQuoteModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private quoteService = inject(QuoteService);
  private bookService = inject(BookService);
  
  @Output() quoteAdded = new EventEmitter<void>();
  
  quoteForm: FormGroup;
  books: Book[] = [];
  isLoading = false;
  errorMessage = '';

  constructor() {
    // Form with validation
    this.quoteForm = this.fb.group({
      text: ['', Validators.required],
      author: ['', Validators.required], 
      bookId: ['', Validators.required],
      pageNumber: ['']
    });
  }

  ngOnInit(): void {
    this.loadBooks();
  }

  

   // Loads all available books for dropdown

  loadBooks(): void {
    this.bookService.getAllBooks().subscribe({
      next: (books) => {
        this.books = books;
      },
      error: (error) => {
        console.error('Kunde inte ladda böcker:', error);
        this.errorMessage = 'Kunde inte ladda böcker. Kontrollera din anslutning.';
      }
    });
  }

   // Submits the form and creates new quote
 
  onSubmit(): void {
    if (this.quoteForm.valid && this.books.length > 0) {
      this.isLoading = true;
      this.errorMessage = '';

      const quoteData: CreateQuoteRequest = {
        text: this.quoteForm.value.text,
        author: this.quoteForm.value.author,
        bookId: parseInt(this.quoteForm.value.bookId),
        pageNumber: this.quoteForm.value.pageNumber ? parseInt(this.quoteForm.value.pageNumber) : undefined
      };

      this.quoteService.createQuote(quoteData).subscribe({
        next: () => {
          this.isLoading = false;
          this.quoteForm.reset();
          this.quoteAdded.emit(); 
          // Signal that quote was created
          
          // Close modal programmatically
          const modal = document.getElementById('addQuoteModal');
          const bsModal = (window as any).bootstrap.Modal.getInstance(modal);
          bsModal?.hide();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Kunde inte skapa citat. Försök igen.';
        }
      });
    }
  }
}