import { Component, inject, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookService } from '../../services/book.service';
import { Book, UpdateBookRequest } from '../../models/book.model';

//
 // Modal component for editing existing books
  // Bootstrap modal with pre-filled form
 // Receives book as input to populate the form
 // Emits event when book is updated

@Component({
  selector: 'app-edit-book-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <!-- Bootstrap Modal for editing -->
    <div class="modal fade" id="editBookModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <!-- Modal header -->
          <div class="modal-header bg-warning text-dark">
            <h5 class="modal-title">
              <i class="fas fa-edit me-2"></i>
              Redigera bok
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <!-- Modal body with pre-filled form -->
          <div class="modal-body">
            <form [formGroup]="bookForm" (ngSubmit)="onSubmit()">
              <!-- Title field -->
              <div class="mb-3">
                <label for="editTitle" class="form-label">
                  <i class="fas fa-heading me-1"></i>
                  Titel *
                </label>
                <input 
                  id="editTitle"
                  type="text" 
                  class="form-control"
                  formControlName="title"
                  [class.is-invalid]="bookForm.get('title')?.invalid && bookForm.get('title')?.touched"
                />
                <div class="invalid-feedback" *ngIf="bookForm.get('title')?.invalid && bookForm.get('title')?.touched">
                  Titel är obligatorisk
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
                  [class.is-invalid]="bookForm.get('author')?.invalid && bookForm.get('author')?.touched"
                />
                <div class="invalid-feedback" *ngIf="bookForm.get('author')?.invalid && bookForm.get('author')?.touched">
                  Författare är obligatorisk
                </div>
              </div>

              <!-- ISBN field -->
              <div class="mb-3">
                <label for="editIsbn" class="form-label">
                  <i class="fas fa-barcode me-1"></i>
                  ISBN
                </label>
                <input 
                  id="editIsbn"
                  type="text" 
                  class="form-control"
                  formControlName="isbn"
                />
              </div>

              <!-- Year field -->
              <div class="mb-3">
                <label for="editPublishedYear" class="form-label">
                  <i class="fas fa-calendar me-1"></i>
                  Utgivningsår
                </label>
                <input 
                  id="editPublishedYear"
                  type="number" 
                  class="form-control"
                  formControlName="publishedYear"
                  min="1000"
                  max="2030"
                />
              </div>

              <!-- Genre field -->
              <div class="mb-3">
                <label for="editGenre" class="form-label">
                  <i class="fas fa-tags me-1"></i>
                  Genre
                </label>
                <select id="editGenre" class="form-select" formControlName="genre">
                  <option value="">Välj genre</option>
                  <option value="Fiction">Skönlitteratur</option>
                  <option value="Non-Fiction">Facklitteratur</option>
                  <option value="Mystery">Deckare</option>
                  <option value="Romance">Romantik</option>
                  <option value="Science Fiction">Science Fiction</option>
                  <option value="Fantasy">Fantasy</option>
                  <option value="Biography">Biografi</option>
                  <option value="History">Historia</option>
                </select>
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
              [disabled]="bookForm.invalid || isLoading"
              (click)="onSubmit()"
            >
              <i class="fas fa-spinner fa-spin me-1" *ngIf="isLoading"></i>
              <i class="fas fa-save me-1" *ngIf="!isLoading"></i>
              {{ isLoading ? 'Sparar...' : 'Uppdatera bok' }}
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
  `]
})
export class EditBookModalComponent {
  private fb = inject(FormBuilder);
  private bookService = inject(BookService);
  
  @Output() bookUpdated = new EventEmitter<void>();
  
  bookForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  currentBook?: Book;

  constructor() {
    // Form for editing
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required], 
      isbn: [''],
      publishedYear: [''],
      genre: ['']
    });
  }

  
   // Opens modal and populates form with book data
  
  openModal(book: Book): void {
    this.currentBook = book;
    
    // Populate form with existing data
    this.bookForm.patchValue({
      title: book.title,
      author: book.author,
      isbn: book.isbn || '',
      publishedYear: book.publishedYear || '',
      genre: book.genre || ''
    });

    // Open modal
    const modal = new (window as any).bootstrap.Modal(document.getElementById('editBookModal'));
    modal.show();
  }

  // Submits the form and updates the book
 
  onSubmit(): void {
    if (this.bookForm.valid && this.currentBook) {
      this.isLoading = true;
      this.errorMessage = '';

      const updateData: UpdateBookRequest = this.bookForm.value;

      this.bookService.updateBook(this.currentBook.id, updateData).subscribe({
        next: () => {
          this.isLoading = false;
          this.bookUpdated.emit(); 
          // Signal that book was updated
          
          // Close modal
          const modal = document.getElementById('editBookModal');
          const bsModal = (window as any).bootstrap.Modal.getInstance(modal);
          bsModal?.hide();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Kunde inte uppdatera bok. Försök igen.';
        }
      });
    }
  }
}