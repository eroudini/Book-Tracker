import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Book, BookStatus } from '../../models/book.model';
import { BookService } from '../../services/book.service';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonList,
  IonRadioGroup,
  IonRadio,
  IonItem,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardContent,
  IonFooter
} from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.page.html',
  styleUrls: ['./book-detail.page.scss'],
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
    IonList,
    IonRadioGroup,
    IonRadio,
    IonItem,
    IonLabel,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardContent,
    IonFooter
  ]
})
export class BookDetailPage implements OnInit, OnDestroy {
  book: Book | null = null;
  private bookSubscription: Subscription | undefined;

  // Propriétés pour le chronomètre
  isTimerRunning = false;
  timer: string = '00:00:00';
  private timerInterval: any;
  private sessionStartTime: number | undefined;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    const bookId = this.route.snapshot.paramMap.get('id');
    if (bookId) {
      // On s'abonne aux changements pour que la page soit toujours à jour
      this.bookSubscription = this.bookService.books$.subscribe(books => {
        const foundBook = books.find(b => b.id === bookId);
        if (foundBook) {
          this.book = { ...foundBook }; // On travaille sur une copie pour éviter les mutations directes
        }
      });
    }
  }

  // Se désabonner pour éviter les fuites de mémoire en quittant la page
  ngOnDestroy() {
    if (this.bookSubscription) {
      this.bookSubscription.unsubscribe();
    }
    clearInterval(this.timerInterval); // Arrête le timer si on quitte la page
  }

  async saveChanges() {
    if (this.book) {
      await this.bookService.updateBook(this.book);
    }
  }

  // --- Fonctions d'interaction ---

  goBack() {
    this.router.navigate(['/tabs/library']);
  }

  setRating(rating: number) {
    if (this.book) {
      this.book.rating = rating;
      this.saveChanges();
    }
  }

  statusChanged(event: any) {
    if (this.book) {
      const newStatus = event.detail.value as BookStatus;
      this.book.status = newStatus;
      if (newStatus === 'Termine' && !this.book.endDate) {
        this.book.endDate = new Date().toISOString().split('T')[0]; // Ajoute la date de fin
      }
      this.saveChanges();
    }
  }

  changePageCount(amount: number) {
    if (this.book && this.book.pagesRead !== undefined) {
      this.book.pagesRead += amount;
      if (this.book.pagesRead < 0) this.book.pagesRead = 0;
      if (this.book.pages && this.book.pagesRead > this.book.pages) this.book.pagesRead = this.book.pages;
      this.saveChanges();
    }
  }

  toggleTimer() {
    if (this.isTimerRunning) {
      // --- Arrêter le timer ---
      clearInterval(this.timerInterval);
      if (this.sessionStartTime !== undefined) {
        const durationSeconds = Math.floor((Date.now() - this.sessionStartTime) / 1000);
        const durationMinutes = Math.ceil(durationSeconds / 60);

        if (this.book && durationMinutes > 0) {
          const newSession = {
            date: new Date().toISOString().split('T')[0],
            durationMinutes: durationMinutes
          };
          this.book.readingSessions = [...(this.book.readingSessions || []), newSession];
          this.saveChanges();
        }
      }
      this.isTimerRunning = false;
    } else {
      // --- Démarrer le timer ---
      this.sessionStartTime = Date.now();
      this.isTimerRunning = true;
      this.timerInterval = setInterval(() => {
        if (this.sessionStartTime !== undefined) {
          const elapsedSeconds = Math.floor((Date.now() - this.sessionStartTime) / 1000);
          const h = Math.floor(elapsedSeconds / 3600).toString().padStart(2, '0');
          const m = Math.floor((elapsedSeconds % 3600) / 60).toString().padStart(2, '0');
          const s = (elapsedSeconds % 60).toString().padStart(2, '0');
          this.timer = `${h}:${m}:${s}`;
        }
      }, 1000);
    }
  }
  
  async confirmDelete() {
    const alert = await this.alertCtrl.create({
      header: 'Supprimer le livre',
      message: 'Êtes-vous sûr de vouloir supprimer ce livre de votre bibliothèque ?',
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        { text: 'Supprimer', role: 'destructive', handler: () => this.deleteBook() }
      ]
    });
    await alert.present();
  }

  async deleteBook() {
    if (this.book) {
      await this.bookService.deleteBook(this.book.id);
      this.router.navigate(['/tabs/library']);
    }
  }
}