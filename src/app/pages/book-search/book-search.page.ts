import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Book } from '../../models/book.model';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonSearchbar,
  IonSpinner,
  IonList,
  IonItem,
  IonThumbnail,
  IonLabel
} from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-search',
  templateUrl: './book-search.page.html',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonSearchbar,
    IonSpinner,
    IonList,
    IonItem,
    IonThumbnail,
    IonLabel
  ]
})
export class BookSearchPage {
  searchResults: any[] = [];
  isLoading = false;

  constructor(private http: HttpClient, private modalCtrl: ModalController) {}

  onSearchChange(event: any) {
    const query = event.target.value;
    if (query && query.trim() !== '') {
      this.isLoading = true;
      this.http.get(`https://openlibrary.org/search.json?q=${query}`)
        .subscribe((res: any) => {
          this.searchResults = res.docs;
          this.isLoading = false;
        });
    }
  }

  selectBook(book: any) {
    // On formate les données pour qu'elles correspondent à notre modèle `Book`
    const formattedBookData: Partial<Book> = {
      title: book.title,
      author: book.author_name?.join(', '),
      cover: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` : undefined,
      pages: book.number_of_pages_median,
    };
    // On ferme la modale et on renvoie le livre sélectionné
    this.modalCtrl.dismiss(formattedBookData, 'confirm');
  }

  dismiss() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}