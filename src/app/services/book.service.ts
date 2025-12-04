import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book, CreateBookRequest, UpdateBookRequest } from '../models/book.model';


 // Service for managing book operations
 // Handles all CRUD operations for books via REST API

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5057/api/books'; 
  
  
   // Retrieves all books from the API
    // @returns Observable of Book array
   
  getAllBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

 
   // Retrieves a specific book by ID
   // @param id - The book ID
   // @returns Observable of Book
   
  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }

  
   // Creates a new book
   // @param book - Book data to create
   // @returns Observable of created Book
   
  createBook(book: CreateBookRequest): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book);
  }

  
   // Updates an existing book
   // @param id - The book ID to update
   // @param book - Updated book data
   // @returns Observable of updated Book
  
  updateBook(id: number, book: UpdateBookRequest): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/${id}`, book);
  }

  

   // Deletes a book
   // @param id - The book ID to delete
   // @returns Observable of void
 
  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
