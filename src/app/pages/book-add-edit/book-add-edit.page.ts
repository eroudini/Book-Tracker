// src/app/pages/book-add-edit/book-add-edit.page.ts

import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { BookService } from '../../services/book.service';
import { Book, BookStatus } from '../../models/book.model'; // J'ai ajouté l'import de Book
import { BarcodeService } from '../../services/barcode.service';

import {
  IonInput,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonIcon
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-add-edit',
  templateUrl: './book-add-edit.page.html',
  styleUrls: ['./book-add-edit.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonInput,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonIcon
  ]
})
export class BookAddEditPage implements OnInit {
  @Input() bookData: Partial<Book> | null = null;
  
  bookForm!: FormGroup;
  statuses: BookStatus[] = ['A lire', 'En cours', 'Termine'];

  constructor(
    private readonly fb: FormBuilder,
    private readonly bookService: BookService,
    private readonly modalCtrl: ModalController,
    private readonly barcodeService: BarcodeService,
    private readonly toastCtrl: ToastController
  ) {}

  ngOnInit() {
    // 1. On initialise le formulaire (comme vous l'aviez fait)
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      status: ['A lire', Validators.required],
      cover: [''],
      pages: [null],
      notes: ['']
    });

    // 2. PUIS, on vérifie si des données ont été passées pour le pré-remplir
    if (this.bookData) {
      console.log('Données reçues pour pré-remplissage :', this.bookData);
      this.bookForm.patchValue(this.bookData);
    }
  }

  // Méthode pour appeler le service de scan
  async scanBarcode() {
    const bookData = await this.barcodeService.scanAndFetchBookData();
    if (bookData) {
      // On remplit le formulaire avec les données reçues
      this.bookForm.patchValue(bookData);
      this.presentToast('Livre trouvé et formulaire pré-rempli !', 'success');
    } else {
      this.presentToast('Aucun livre trouvé pour ce code-barres.', 'warning');
    }
  }

  // Méthode pour sauvegarder le livre
  async saveBook() {
    if (this.bookForm.invalid) {
      return;
    }
    // On s'assure de ne pas envoyer un formulaire à moitié vide
    const bookToSave = { ...this.bookData, ...this.bookForm.value };
    await this.bookService.addBook(bookToSave);
    this.modalCtrl.dismiss(bookToSave, 'confirm');
  }

  // Méthode pour fermer la modale
  dismiss() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  // Méthode utilitaire pour afficher les messages
  async presentToast(message: string, color: 'success' | 'warning' | 'danger') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'top',
      color,
    });
    toast.present();
  }
}