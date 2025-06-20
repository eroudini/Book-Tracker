import { Component } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { BookAddEditPage } from '../pages/book-add-edit/book-add-edit.page';
import { BookSearchPage } from '../pages/book-search/book-search.page';
import { Book, BookStatus } from '../models/book.model';
import { BookService } from '../services/book.service';
import { BarcodeService } from '../services/barcode.service';
import { map } from 'rxjs/operators';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonListHeader,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonItem,
  IonThumbnail,
  IonLabel,
  IonList,
  IonNote
} from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-library',
  templateUrl: 'library.page.html',
  styleUrls: ['library.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonListHeader,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonItem,
    IonThumbnail,
    IonLabel,
    IonList,
    IonNote,
    RouterModule
  ]
})
export class LibraryPage {

  booksEnCours$: Observable<Book[]>;
  booksTermine$: Observable<Book[]>;
  booksALire$: Observable<Book[]>;

  constructor(
    private readonly bookService: BookService,
    private readonly actionSheetCtrl: ActionSheetController,
    private readonly modalCtrl: ModalController,
    private readonly barcodeService: BarcodeService
  ) {
    this.booksEnCours$ = this.filterBooksByStatus('En cours');
    this.booksALire$ = this.filterBooksByStatus('A lire');
    this.booksTermine$ = this.filterBooksByStatus('Termine');
  }

  private filterBooksByStatus(status: BookStatus): Observable<Book[]> {
    return this.bookService.books$.pipe(
      map(books => books.filter(book => book.status === status))
    );
  }


async presentAddBookOptions() {
  const actionSheet = await this.actionSheetCtrl.create({
    header: 'Ajouter un livre',
    buttons: [
      {
        text: 'A partir du code barre',
        icon: 'barcode-outline',
        handler: () => {
          // --- Mouchard n°1 ---
          console.log('Bouton "Code barre" cliqué !'); 
          this.scanBarcodeAndAdd();
        }
      },
      {
        text: 'Chercher en ligne',
        icon: 'search-outline',
        handler: () => {
          // --- Mouchard n°2 ---
          console.log('Bouton "Chercher en ligne" cliqué !');
          this.openSearchModal();
        }
      },
      {
        text: 'Ajouter manuellement',
        icon: 'create-outline',
        handler: () => {
          // --- Mouchard n°3 ---
          console.log('Bouton "Ajouter manuellement" cliqué !');
          this.openBookAddEditModal();
        }
      },
      {
        text: 'Annuler',
        icon: 'close-outline',
        role: 'cancel',
      }
    ]
  });
  await actionSheet.present();
}

  // Pour compatibilité avec l'ancien bouton
  openAddBookModal() {
    this.presentAddBookOptions();
  }

  // 3. CRÉER une fonction de scan dédiée
async scanBarcodeAndAdd() {
  console.log('Lancement du service de scan de code-barres...');
  const bookData = await this.barcodeService.scanAndFetchBookData();
  
  if (bookData) {
    console.log('Code-barres scanné avec succès, ouverture de la modale avec ces données :', bookData);
    // Ouvre la modale pré-remplie avec les données du scan
    this.openBookAddEditModal(bookData); 
  } else {
    console.log('Scan annulé ou aucun livre trouvé.');
  }
}

  // 4. CRÉER une fonction réutilisable pour ouvrir la modale d'ajout/edition
  async openBookAddEditModal(bookData: Partial<Book> | null = null) {
    const modal = await this.modalCtrl.create({
      component: BookAddEditPage,
      // On passe les données du livre à la modale
      componentProps: {
        'bookData': bookData 
      }
    });
    return await modal.present();
  }

  async openSearchModal() {
  const searchModal = await this.modalCtrl.create({
    component: BookSearchPage, // Notre nouvelle page de recherche
  });
  await searchModal.present();

  // On attend que la modale se ferme
  const { data, role } = await searchModal.onWillDismiss();

  if (role === 'confirm') {
    // Si l'utilisateur a confirmé un choix, on ouvre la modale d'ajout pré-remplie
    this.openBookAddEditModal(data);
  }
}

}
