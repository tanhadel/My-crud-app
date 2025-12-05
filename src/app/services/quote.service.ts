import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Quote, CreateQuoteRequest, UpdateQuoteRequest } from '../models/quote.model';


 //  Service for managing quote operations
 // Handles all CRUD operations for quotes via REST API

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  private http = inject(HttpClient);
  private apiUrl = 'https://my-crud-app-backend-production.up.railway.app/api/quotes'; 
  
  
   // Retrieves all quotes from the API
   // @returns Observable of Quote array
  
  getAllQuotes(): Observable<Quote[]> {
    return this.http.get<Quote[]>(this.apiUrl);
  }


  // Retrieves a specific quote by ID
   // @param id - The quote ID
   // @returns Observable of Quote

  getQuoteById(id: number): Observable<Quote> {
    return this.http.get<Quote>(`${this.apiUrl}/${id}`);
  }


   // Retrieves all quotes for a specific book
   // @param bookId - The book ID to filter quotes
   // @returns Observable of Quote array
   
  getQuotesByBook(bookId: number): Observable<Quote[]> {
    return this.http.get<Quote[]>(`${this.apiUrl}/book/${bookId}`);
  }

  
   // Creates a new quote
   // @param quote - Quote data to create
   // @returns Observable of created Quote
   
  createQuote(quote: CreateQuoteRequest): Observable<Quote> {
    return this.http.post<Quote>(this.apiUrl, quote);
  }

  
   // Updates an existing quote
   // @param id - The quote ID to update
   // @param quote - Updated quote data
   // @returns Observable of updated Quote
  
  updateQuote(id: number, quote: UpdateQuoteRequest): Observable<Quote> {
    return this.http.put<Quote>(`${this.apiUrl}/${id}`, quote);
  }

  
   // Deletes a quote
   // @param id - The quote ID to delete
   // @returns Observable of void
   
  deleteQuote(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
