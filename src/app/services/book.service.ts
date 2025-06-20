import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Book } from '../models/book.model';
import { StorageService } from './storage.service';

// C'est le nom du "fichier" dans lequel on sauvegarde notre liste de livres
const BOOKS_STORAGE_KEY = 'my-books';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private booksSubject = new BehaviorSubject<Book[]>([]);
  books$: Observable<Book[]> = this.booksSubject.asObservable();

  constructor(private storageService: StorageService) {
    // POINT CLÉ N°1 : On charge les données dès la création du service
    this.loadInitialData();
  }

  private async loadInitialData() {
    console.log('BookService: Tentative de chargement des données depuis le stockage...');
    const books = await this.storageService.get(BOOKS_STORAGE_KEY);
    
    if (books && books.length > 0) {
      this.booksSubject.next(books);
      console.log('Données chargées !', books);
    } else {
      console.log('Aucune donnée trouvée dans le stockage.');
      this.booksSubject.next([]); // On s'assure que la liste est vide si rien n'est trouvé
    }
  }
  
  // Méthode privée pour centraliser la logique de sauvegarde
  private async saveBooksToStorage() {
    const currentBooks = this.booksSubject.getValue();
    console.log('BookService: Sauvegarde des livres dans le stockage...', currentBooks);
    await this.storageService.set(BOOKS_STORAGE_KEY, currentBooks);
    console.log('Sauvegarde terminée !');
  }

  async addBook(bookData: Omit<Book, 'id'>) {
    const currentBooks = this.booksSubject.getValue();
    const newBook: Book = {
      ...bookData,
      id: `${new Date().getTime()}-${bookData.title.replace(/\s/g, '')}`
    };
    const updatedBooks = [...currentBooks, newBook];
    
    // 1. Mettre à jour la mémoire vive
    this.booksSubject.next(updatedBooks);
    
    // POINT CLÉ N°2 : Sauvegarder dans le stockage après la modification
    await this.saveBooksToStorage();
  }

  async updateBook(updatedBook: Book) {
    const currentBooks = this.booksSubject.getValue();
    const bookIndex = currentBooks.findIndex(b => b.id === updatedBook.id);

    if (bookIndex > -1) {
      currentBooks[bookIndex] = updatedBook;
      this.booksSubject.next([...currentBooks]);
      // On sauvegarde aussi après une mise à jour
      await this.saveBooksToStorage();
    }
  }

  async deleteBook(bookId: string) {
    const currentBooks = this.booksSubject.getValue();
    const updatedBooks = currentBooks.filter(b => b.id !== bookId);
    this.booksSubject.next(updatedBooks);
    // Et on sauvegarde aussi après une suppression
    await this.saveBooksToStorage();
  }

  getBookById(bookId: string): Book | undefined {
    return this.booksSubject.getValue().find(b => b.id === bookId);
  }


    async clearAllBooks() {
    // Vide la mémoire vive
    this.booksSubject.next([]);
    // Vide la mémoire de stockage
    await this.storageService.set('my-books', []);
    console.log('Toutes les données ont été effacées.');
  }
}