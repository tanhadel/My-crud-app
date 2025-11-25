export interface Quote {
  id: number;
  text: string;
  author: string;
  pageNumber?: number;
  bookId: number;
  createdAt?: Date;
}

export interface CreateQuoteRequest {
  text: string;
  author: string;
  pageNumber?: number;
  bookId: number;
}

export interface UpdateQuoteRequest {
  text?: string;
  author?: string;
  bookId?: number;
}
