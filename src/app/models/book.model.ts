// src/app/models/book.model.ts
export interface ReadingSession {
  date: string; 
  durationMinutes: number; 
}

export type BookStatus = 'A lire' | 'En cours' | 'Termine';

export interface Book {
  id: string; // ID unique, ex: timestamp + titre
  title: string;
  author: string;
  cover?: string; // URL de l'image de couverture
  status: BookStatus;
  rating?: number; // Note de 0 à 5
  startDate?: string; // Format ISO 8601
  endDate?: string; // Format ISO 8601
  pages?: number; // Nombre total de pages
  pagesRead?: number; // Pages lues (pour la progression)
  notes?: string; // Notes personnelles
  // Pour les statistiques de temps
  readingSessions?: ReadingSession[];
}