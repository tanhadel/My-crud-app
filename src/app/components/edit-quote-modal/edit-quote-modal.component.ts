import { Component, inject, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuoteService } from '../../services/quote.service';
import { BookService } from '../../services/book.service';
import { Quote, UpdateQuoteRequest } from '../../models/quote.model';
import { Book } from '../../models/book.model';


 // Modal component for editing existing quotes
  // Bootstrap modal with pre-filled form
  // Dropdown to change which book the quote belongs to
  // All fields can be edited
 
@Component({
  selector: 'app-edit-quote-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <!-- Bootstrap Modal for editing quotes -->
    <div class="modal fade" id="editQuoteModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <!-- Modal header -->
          <div class="modal-header bg-warning text-dark">
            <h5 class="modal-title">
              <i class="fas fa-edit me-2"></i>
              Redigera citat
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <!--- Modal body with pre-filled form -->
          <div class="modal-body">
            <form [formGroup]="quoteForm" (ngSubmit)="onSubmit()">
              <!-- Quote text field -->   
              <div class="mb-3">
                <label for="editText" class="form-label">
                  <i class="fas fa-quote-left me-1"></i>
                  Citat-text *
                </label>
                <textarea 
                  id="editText"
                  class="form-control"
                  formControlName="text"
                  rows="4"
                  [class.is-invalid]="quoteForm.get('text')?.invalid && quoteForm.get('text')?.touched"
                ></textarea>
                <div class="invalid-feedback" *ngIf="quoteForm.get('text')?.invalid && quoteForm.get('text')?.touched">
                  Citat-text är obligatorisk
                </div>
              </div>

              <!-- Author field -->
              <div class="mb-3">
                <label for="editAuthor" class="form-label">
                  <i class="fas fa-user-edit me-1"></i>
                  Författare *
                </label>
                <input 
                  id="editAuthor"
                  type="text" 
                  class="form-control"
                  formControlName="author"
                  [class.is-invalid]="quoteForm.get('author')?.invalid && quoteForm.get('author')?.touched"
                />
                <div class="invalid-feedback" *ngIf="quoteForm.get('author')?.invalid && quoteForm.get('author')?.touched">
                  Författare är obligatorisk
                </div>
              </div>

              <!-- Book selection field -->
              <div class="mb-3">
                <label for="editBookId" class="form-label">
                  <i class="fas fa-book me-1"></i>
                  Välj bok *
                </label>
                <select 
                  id="editBookId" 
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
                  Vänligen välj en bok
                </div>
              </div>

              <!-- Page number field -->
              <div class="mb-3">
                <label for="editPageNumber" class="form-label">
                  <i class="fas fa-bookmark me-1"></i>
                  Sidnummer (valfritt)
                </label>
                <input 
                  id="editPageNumber"
                  type="number" 
                  class="form-control"
                  formControlName="pageNumber"
                  min="1"
                />
              </div>

              <!-- Error message -->
              <div class="alert alert-danger" *ngIf="errorMessage">
                <i class="fas fa-exclamation-triangle me-2"></i>
                {{ errorMessage }}
              </div>
            </form>
          </div>

          <!-- Modal footer -->
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              <i class="fas fa-times me-1"></i>
              Avbryt
            </button>
            <button 
              type="button" 
              class="btn btn-warning"
              [disabled]="quoteForm.invalid || isLoading"
              (click)="onSubmit()"
            >
              <i class="fas fa-spinner fa-spin me-1" *ngIf="isLoading"></i>
              <i class="fas fa-save me-1" *ngIf="!isLoading"></i>
              {{ isLoading ? 'Sparar...' : 'Uppdatera citat' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .form-label {
      font-weight: 500;
    }

    textarea {
      resize: vertical;
      min-height: 100px;
    }
  `]
})
export class EditQuoteModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private quoteService = inject(QuoteService);
  private bookService = inject(BookService);
  
  @Output() quoteUpdated = new EventEmitter<void>();
  
  quoteForm: FormGroup;
  books: Book[] = [];
  isLoading = false;
  errorMessage = '';
  currentQuote?: Quote;

  constructor() {
    // Form for editing
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
      }
    });
  }

   // Opens modal and populates form with quote data
   
  openModal(quote: Quote): void {
    this.currentQuote = quote;
  
    // Populate form with existing data
    // Use empty string as default if author is missing from backend
    this.quoteForm.patchValue({
      text: quote.text || '',
      author: quote.author || '',
      bookId: quote.bookId || '',
      pageNumber: quote.pageNumber || ''
    });
    
    // Open modal
    const modal = new (window as any).bootstrap.Modal(document.getElementById('editQuoteModal'));
    modal.show();
  }

 
   // Submits the form and updates the quote

  onSubmit(): void {
    if (this.quoteForm.valid && this.currentQuote) {
      this.isLoading = true;
      this.errorMessage = '';

      const updateData: UpdateQuoteRequest = {
        text: this.quoteForm.value.text,
        author: this.quoteForm.value.author,
        bookId: parseInt(this.quoteForm.value.bookId),
        pageNumber: this.quoteForm.value.pageNumber ? parseInt(this.quoteForm.value.pageNumber) : undefined
      };

      console.log('📝 Updating quote with data:', updateData);
      console.log('👤 Author value:', this.quoteForm.value.author);

      this.quoteService.updateQuote(this.currentQuote.id, updateData).subscribe({
        next: () => {
          this.isLoading = false;
          this.quoteUpdated.emit(); 
          // Signal that quote was updated
          
          // Close modal
          const modal = document.getElementById('editQuoteModal');
          const bsModal = (window as any).bootstrap.Modal.getInstance(modal);
          bsModal?.hide();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Kunde inte uppdatera citat. Försök igen.';
        }
      });
    }
  }
}