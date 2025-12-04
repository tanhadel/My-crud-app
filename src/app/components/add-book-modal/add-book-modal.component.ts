import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookService } from '../../services/book.service';
import { CreateBookRequest } from '../../models/book.model';


 // Modal component for adding new books
 // Bootstrap modal with form
 // Validation of all fields
  // Emits event when book is created to update the list

@Component({
  selector: 'app-add-book-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <!-- Bootstrap Modal -->
    <div class="modal fade" id="addBookModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <!-- Modal header with title and close button -->
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-plus me-2"></i>
              Lägg till ny bok
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <!-- Modal body with form -->
          <div class="modal-body">
            <form [formGroup]="bookForm" (ngSubmit)="onSubmit()">
              <!-- Title field -->
              <div class="mb-3">
                <label for="title" class="form-label">
                  <i class="fas fa-heading me-1"></i>
                  Titel *
                </label>
                <input 
                  id="title"
                  type="text" 
                  class="form-control"
                  formControlName="title"
                  [class.is-invalid]="bookForm.get('title')?.invalid && bookForm.get('title')?.touched"
                  placeholder="Bokens titel"
                />
                <div class="invalid-feedback" *ngIf="bookForm.get('title')?.invalid && bookForm.get('title')?.touched">
                  Titel är obligatorisk
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
                  [class.is-invalid]="bookForm.get('author')?.invalid && bookForm.get('author')?.touched"
                  placeholder="Författarens namn"
                />
                <div class="invalid-feedback" *ngIf="bookForm.get('author')?.invalid && bookForm.get('author')?.touched">
                  Författare är obligatorisk
                </div>
              </div>

              <!-- ISBN field (optional) -->
              <div class="mb-3">
                <label for="isbn" class="form-label">
                  <i class="fas fa-barcode me-1"></i>
                  ISBN
                </label>
                <input 
                  id="isbn"
                  type="text" 
                  class="form-control"
                  formControlName="isbn"
                  placeholder="978-0-123456-78-9"
                />
              </div>

              <!-- Year field (optional) -->
              <div class="mb-3">
                <label for="publishedYear" class="form-label">
                  <i class="fas fa-calendar me-1"></i>
                  Utgivningsår
                </label>
                <input 
                  id="publishedYear"
                  type="number" 
                  class="form-control"
                  formControlName="publishedYear"
                  min="1000"
                  max="2030"
                  placeholder="2023"
                />
              </div>

              <!-- Genre field (optional) -->
              <div class="mb-3">
                <label for="genre" class="form-label">
                  <i class="fas fa-tags me-1"></i>
                  Genre
                </label>
                <select id="genre" class="form-select" formControlName="genre">
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

          <!-- Modal footer with buttons -->
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              <i class="fas fa-times me-1"></i>
              Avbryt
            </button>
            <button 
              type="button" 
              class="btn btn-primary"
              [disabled]="bookForm.invalid || isLoading"
              (click)="onSubmit()"
            >
              <i class="fas fa-spinner fa-spin me-1" *ngIf="isLoading"></i>
              <i class="fas fa-save me-1" *ngIf="!isLoading"></i>
              {{ isLoading ? 'Sparar...' : 'Spara bok' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-header {
      background-color: #007bff;
      color: white;
    }
    
    .form-label {
      font-weight: 500;
    }
    
    .btn-close {
      filter: invert(1);
    }
  `]
})
export class AddBookModalComponent {
  private fb = inject(FormBuilder);
  private bookService = inject(BookService);
  
  @Output() bookAdded = new EventEmitter<void>();
  
  bookForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor() {
    // Form with validation
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required], 
      isbn: [''],
      publishedYear: [''],
      genre: ['']
    });
  }

  
   // Submits the form and creates new book
 
  onSubmit(): void {
    if (this.bookForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const bookData: CreateBookRequest = this.bookForm.value;

      this.bookService.createBook(bookData).subscribe({
        next: () => {
          this.isLoading = false;
          this.bookForm.reset();
          this.bookAdded.emit(); 
          // Signal that book was created
          
          // Close modal programmatically
          const modal = document.getElementById('addBookModal');
          const bsModal = (window as any).bootstrap.Modal.getInstance(modal);
          bsModal?.hide();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Kunde inte skapa bok. Försök igen.';
        }
      });
    }
  }
}