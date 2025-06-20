// src/app/pages/settings/settings.page.ts

import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { StorageService } from '@app/services/storage.service';
import { BookService } from '@app/services/book.service';
import { Share } from '@capacitor/share'; // --- AJOUT : Outil de partage natif

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItemGroup,
  IonItemDivider,
  IonLabel,
  IonIcon,
  IonToggle,
  IonNote,
  IonItem,
  IonButton // --- AJOUT : Pour le bandeau "Pro"
} from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Clés pour le stockage local des préférences
const THEME_KEY = 'theme-preference';
const GOAL_KEY = 'weekly-goal-hours';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItemGroup,
    IonItemDivider,
    IonLabel,
    IonIcon,
    IonToggle,
    IonNote,
    IonItem,
    IonButton // --- AJOUT : Le bouton est maintenant utilisé dans le HTML
  ]
})
export class SettingsPage implements OnInit {
  isDarkMode = false;
  weeklyGoalHours = 5; // Valeur par défaut

  constructor(
    private storageService: StorageService,
    private alertCtrl: AlertController,
    private bookService: BookService
  ) {}

  // --- LES FONCTIONS EXISTANTES SONT CONSERVÉES ---

  async ngOnInit() {
    await this.loadTheme();
    await this.loadGoal();
  }

  async loadTheme() {
    const savedTheme = await this.storageService.get(THEME_KEY);
    this.isDarkMode = savedTheme === null ? window.matchMedia('(prefers-color-scheme: dark)').matches : savedTheme;
    this.updateBodyTheme();
  }

  async loadGoal() {
    const savedGoal = await this.storageService.get(GOAL_KEY);
    if (savedGoal) { this.weeklyGoalHours = savedGoal; }
  }

  toggleChange(event: any) {
    this.isDarkMode = event.detail.checked;
    this.storageService.set(THEME_KEY, this.isDarkMode);
    this.updateBodyTheme();
  }

  updateBodyTheme() {
    document.body.classList.toggle('dark', this.isDarkMode);
  }

  async changeGoal() {
    const alert = await this.alertCtrl.create({
      header: 'Objectif hebdomadaire',
      message: 'Combien d\'heures de lecture visez-vous par semaine ?',
      inputs: [{ name: 'goal', type: 'number', value: this.weeklyGoalHours, min: 1 }],
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        {
          text: 'Enregistrer',
          handler: (data) => {
            const newGoal = parseInt(data.goal, 10);
            if (newGoal > 0) {
              this.weeklyGoalHours = newGoal;
              this.storageService.set(GOAL_KEY, newGoal);
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async confirmDeleteAllData() {
    const alert = await this.alertCtrl.create({
      header: 'Êtes-vous sûr ?',
      message: 'Toutes vos données de lecture seront définitivement effacées.',
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        { text: 'Tout effacer', role: 'destructive', handler: () => { this.bookService.clearAllBooks(); }},
      ],
    });
    await alert.present();
  }

  // --- AJOUT DES NOUVELLES FONCTIONS ---

  unlockPro() {
    console.log('Bouton Unlock Pro cliqué. Logique d\'achat à implémenter.');
    // Vous pouvez afficher une alerte ou ouvrir une page expliquant les fonctionnalités Pro
  }

  rateApp() {
    console.log('Bouton Noter cliqué. Logique pour ouvrir l\'App Store / Play Store à implémenter.');
    // Pour cela, on utilise généralement un plugin comme App Rate ou un lien direct vers le store.
  }
  
  async shareApp() {
    try {
      await Share.share({
        title: 'Découvrez Book Tracker',
        text: 'Je suis en train de suivre mes lectures avec cette superbe application !',
        url: 'https://votre-site-ou-app-store.com', // Remplacez par votre URL
        dialogTitle: 'Partager avec des amis',
      });
    } catch (error) {
      console.error('Erreur lors du partage natif', error);
      // Fallback si le partage natif échoue (rare)
      this.alertCtrl.create({
        header: 'Partagez cette app !',
        message: 'Parlez de Book Tracker à vos amis !',
        buttons: ['OK']
      }).then(alert => alert.present());
    }
  }

  contactUs() {
    // Ouvre le client mail par défaut de l'utilisateur
    window.location.href = 'mailto:support@votreapp.com?subject=Contact depuis Book Tracker';
  }
}