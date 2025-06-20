// src/app/services/barcode.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { firstValueFrom } from 'rxjs';
import { Book } from '../models/book.model';

// Interface pour la réponse de Google Books
interface GoogleBooksResponse {
  items: {
    volumeInfo: {
      title: string;
      authors: string[];
      imageLinks?: { thumbnail: string; };
      pageCount?: number;
      description?: string;
    };
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class BarcodeService {

  constructor(private http: HttpClient) { }

  public async scanAndFetchBookData(): Promise<Partial<Book> | null> {
    try {
      // 1. Demander la permission
      await BarcodeScanner.checkPermission({ force: true });

      // 2. Cacher l'arrière-plan de l'app et démarrer le scan
      await BarcodeScanner.hideBackground();
      document.body.classList.add('scanner-active');

      const result = await BarcodeScanner.startScan(); 

      // 3. Restaurer l'affichage une fois le scan terminé
      await BarcodeScanner.showBackground();
      document.body.classList.remove('scanner-active');

      // 4. Traiter le résultat
      if (result.hasContent) {
        console.log('ISBN Scanné :', result.content);
        // On appelle l'API Google Books avec le code trouvé
        return this.fetchDataFromGoogleBooks(result.content);
      }
      
      return null;
    } catch (err) {
      console.error('Erreur du scanner :', err);
      // S'assurer de toujours restaurer l'affichage en cas d'erreur
      await BarcodeScanner.showBackground();
      document.body.classList.remove('scanner-active');
      return null;
    }
  }
  
 private async fetchDataFromGoogleBooks(isbn: string): Promise<Partial<Book> | null> {
    const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
    
    try {
      const response = await firstValueFrom(this.http.get<GoogleBooksResponse>(url));
      
      if (response && response.items && response.items.length > 0) {
        const bookInfo = response.items[0].volumeInfo;
        const bookData: Partial<Book> = {
          title: bookInfo.title,
          author: bookInfo.authors ? bookInfo.authors.join(', ') : 'Inconnu',
          cover: bookInfo.imageLinks?.thumbnail,
          pages: bookInfo.pageCount,
          notes: bookInfo.description // Maintenant, cette ligne est valide !
        };
        return bookData;
      }
      return null;
    } catch (error) {
      console.error('Erreur API Google Books:', error);
      return null;
    }
  }
}