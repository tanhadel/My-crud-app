import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { QuoteService } from '../../services/quote.service';
import { AuthService } from '../../services/auth.service';
import { Quote } from '../../models/quote.model';
import { NavbarComponent } from '../navbar/navbar.component';
import { AddQuoteModalComponent } from '../add-quote-modal/add-quote-modal.component';
import { EditQuoteModalComponent } from '../edit-quote-modal/edit-quote-modal.component';
import { FormsModule } from '@angular/forms';

 //Quotes component that displays all quotes with CRUD functionality
 // Uses same navbar as books component
 // Bootstrap styling for consistent appearance
 // Add Quote modal for adding new quotes

@Component({
  selector: 'app-quotes',
  standalone: true,
  imports: [CommonModule, NavbarComponent, AddQuoteModalComponent, EditQuoteModalComponent, FormsModule],
  template: `
    <!-- Navbar överst -->
    <app-navbar></app-navbar>

    <div class="container-fluid py-4">
      <div class="row mb-4">
        <div class="col">
          <div class="d-flex justify-content-between align-items-center">
            <h1 class="mb-0">
              <i class="fas fa-quote-left me-2 text-primary"></i>
              Mina Citat
            </h1>
            <button 
              class="btn btn-primary btn-lg"
              data-bs-toggle="modal"
              data-bs-target="#addQuoteModal"
            >
              <i class="fas fa-plus me-2"></i>
              Lägg till citat
            </button>
          </div>
        </div>
      </div>

      <div class="row" *ngIf="quotes().length > 0; else noQuotes">
        <div class="col-lg-6 mb-4" *ngFor="let quote of quotes()">
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <blockquote class="blockquote mb-0">
                <p class="quote-text">
                  <i class="fas fa-quote-left text-muted me-2"></i>
                  {{ quote.text }}
                  <i class="fas fa-quote-right text-muted ms-2"></i>
                </p>
                <footer class="blockquote-footer mt-3">
                  <i class="fas fa-user me-1"></i>
                  {{ quote.author }}
                  <span *ngIf="quote.pageNumber" class="ms-2">
                    <i class="fas fa-bookmark me-1"></i>
                    Sida {{ quote.pageNumber }}
                  </span>
                </footer>
              </blockquote>
            </div>
            <div class="card-footer bg-transparent">
              <div class="btn-group w-100">
                <button class="btn btn-outline-warning" (click)="openEditModal(quote)">
                  <i class="fas fa-edit"></i>
                  Redigera
                </button>
                <button class="btn btn-outline-danger" (click)="deleteQuote(quote.id)">
                  <i class="fas fa-trash"></i>
                  Ta bort
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ng-template #noQuotes>
        <div class="row">
          <div class="col text-center py-5">
            <div class="empty-state">
              <i class="fas fa-quote-left fa-3x text-muted mb-3"></i>
              <h3 class="text-muted">Inga citat än</h3>
              <p class="text-muted mb-4">Spara dina favoritcitat här!</p>
              <button 
                class="btn btn-primary btn-lg"
                data-bs-toggle="modal"
                data-bs-target="#addQuoteModal"
              >
                <i class="fas fa-plus me-2"></i>
                Lägg till första citatet
              </button>
            </div>
          </div>
        </div>
      </ng-template>
    </div>

    <!-- Modal for adding quotes -->
    <app-add-quote-modal (quoteAdded)="onQuoteAdded()"></app-add-quote-modal>
    
    <!-- Modal for editing quotes -->
    <app-edit-quote-modal (quoteUpdated)="onQuoteUpdated()"></app-edit-quote-modal>
  `,
  styles: [`
    .quote-text {
      font-size: 1.1rem;
      line-height: 1.6;
      font-style: italic;
    }

    .empty-state {
      padding: 3rem;
    }

    .card:hover {
      transform: translateY(-2px);
      transition: transform 0.2s ease-in-out;
    }
  `]
})
export class QuotesComponent implements OnInit {
  private quoteService = inject(QuoteService);
  authService = inject(AuthService);
  private router = inject(Router);

  quotes = signal<Quote[]>([]);
  isLoading = false;
  errorMessage = '';

  @ViewChild(EditQuoteModalComponent) editModal!: EditQuoteModalComponent;

  ngOnInit(): void {
    this.loadQuotes();
  }

   // Loads all quotes from backend

  loadQuotes(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.quoteService.getAllQuotes().subscribe({
      next: (quotes: Quote[]) => {
        this.quotes.set(quotes);
        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = 'Kunde inte ladda citat. Kontrollera din internetanslutning.';
        console.error('Error loading quotes:', error);
      }
    });
  }

   // Event handler when a new quote is added
  
  onQuoteAdded(): void {
    this.loadQuotes(); 
    // Reload the list
  }
    // Opens edit modal for selected quote
  openEditModal(quote: Quote): void {
    this.editModal.openModal(quote);
  }

 

   // Event handler when a quote is updated
   
  onQuoteUpdated(): void {
    this.loadQuotes();
     // Reload the list
  }

  // Deletes a quote
  deleteQuote(quoteId: number): void {
    if (confirm('Är du säker på att du vill ta bort detta citat?')) {
      this.quoteService.deleteQuote(quoteId).subscribe({
        next: () => {
          this.loadQuotes();
        },
        error: (error) => {
          this.errorMessage = 'Kunde inte ta bort citat. Försök igen.';
          console.error('Error deleting quote:', error);
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}