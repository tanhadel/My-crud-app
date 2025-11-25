export interface Book {
  id: number;
  title: string;
  author: string;
  isbn?: string;
  publishedYear?: number;
  genre?: string;
}

export interface CreateBookRequest {
  title: string;
  author: string;
  isbn?: string;
  publishedYear?: number;
  genre?: string;
}

export interface UpdateBookRequest {
  title?: string;
  author?: string;
  isbn?: string;
  publishedYear?: number;
  genre?: string;
}
