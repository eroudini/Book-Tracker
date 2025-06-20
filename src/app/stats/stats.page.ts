import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BookService } from '../services/book.service';
import { Book, ReadingSession } from '../models/book.model';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonList,
  IonItemGroup,
  IonItemDivider,
  IonToggle,
  IonNote,
  IonItem,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonProgressBar,
  IonGrid,
  IonRow,
  IonCol, IonLabel } from "@ionic/angular/standalone";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-stats',
  templateUrl: 'stats.page.html',
  styleUrls: ['stats.page.scss'],
  standalone: true,
  imports: [IonLabel, 
    FormsModule,
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonList,
    IonItemGroup,
    IonItemDivider,
    IonToggle,
    IonNote,
    IonItem,
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonProgressBar,
    IonGrid,
    IonRow,
    IonCol
  ],
})
export class StatsPage implements OnInit {
  isDarkMode = false;
  weeklyGoalHours = 5;
  weeklyGoalMinutes: number = 0;

  weeklyProgress$!: Observable<number>;
  statsThisYear: any[] = [];
  calendarDays: { dayName: string; dayNumber: number; dateString: string }[] = [];
  readingSessionMap: Map<string, number> = new Map();

  constructor(private readonly bookService: BookService) {}

  ngOnInit(): void {
    this.setupCalendar();
    this.calculateAllStats();
  }

  toggleChange(event: any): void {
    this.isDarkMode = event.detail.checked;
  }

  changeGoal(): void {
    alert('Changer l\'objectif (implémentation à faire)');
  }

  confirmDeleteAllData(): void {
    alert('Réinitialiser l\'application (implémentation à faire)');
  }

  private calculateAllStats(): void {
    const currentYear: string = new Date().getFullYear().toString();
    this.weeklyProgress$ = this.bookService.books$.pipe(
      map((books: Book[]): number => {
        const allSessions: ReadingSession[] = ([] as ReadingSession[]).concat(...books.map((b: Book) => b.readingSessions ?? []));
        const today: Date = new Date();
        const startOfWeek: Date = this.getStartOfWeek(today);
        const timeThisWeek: number = allSessions
          .filter((s: ReadingSession) => new Date(s.date) >= startOfWeek)
          .reduce((acc: number, s: ReadingSession) => acc + s.durationMinutes, 0);
        const progress: number = timeThisWeek / (this.weeklyGoalHours * 60);
        return progress > 1 ? 1 : progress;
      })
    );
    
    const booksReadThisYear$ = this.bookService.books$.pipe(map((books: Book[]) => books.filter((b: Book) => b.status === 'Termine' && b.endDate?.startsWith(currentYear)).length));
    const pagesReadThisYear$ = this.bookService.books$.pipe(map((books: Book[]) => books.filter((b: Book) => b.status === 'Termine' && b.endDate?.startsWith(currentYear)).reduce((sum: number, book: Book) => sum + (book.pages || 0), 0)));
    
    this.bookService.books$.subscribe((books: Book[]) => {
      const allSessions: ReadingSession[] = ([] as ReadingSession[]).concat(...books.map((b: Book) => b.readingSessions || []));
      const sessionsThisYear: ReadingSession[] = allSessions.filter((s: ReadingSession) => s.date.startsWith(currentYear));
      this.readingSessionMap.clear();
      allSessions.forEach((session: ReadingSession) => { this.readingSessionMap.set(session.date, (this.readingSessionMap.get(session.date) || 0) + session.durationMinutes); });
      const totalTime: number = sessionsThisYear.reduce((sum: number, s: ReadingSession) => sum + s.durationMinutes, 0);
      const formattedTime: string = `${Math.floor(totalTime / 60)}h ${String(totalTime % 60).padStart(2, '0')}`;
      const totalDays: number = new Set(sessionsThisYear.map((s: ReadingSession) => s.date)).size;
      this.statsThisYear = [
        { icon: 'book-outline', label: 'Livres', value: booksReadThisYear$ },
        { icon: 'reader-outline', label: 'Pages lues', value: pagesReadThisYear$ },
        { icon: 'time-outline', label: 'Temps', value: new Observable(sub => sub.next(formattedTime)) },
        { icon: 'calendar-outline', label: 'Journées', value: new Observable(sub => sub.next(totalDays)) },
      ];
      this.weeklyGoalMinutes = this.weeklyGoalHours * 60;
    });
  }

  private setupCalendar(): void {
    const today: Date = new Date();
    const date: Date = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const day: number = date.getDay();
    const diff: number = date.getDate() - day + (day === 0 ? -6 : 1); 
    const startOfWeek: Date = new Date(date.setDate(diff));
    const dayNames: string[] = ['lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.', 'dim.'];
    this.calendarDays = [];
    for (let i = 0; i < 7; i++) {
      const currentDay: Date = new Date(startOfWeek);
      currentDay.setDate(currentDay.getDate() + i);
      this.calendarDays.push({
        dayName: dayNames[i],
        dayNumber: currentDay.getDate(),
        dateString: currentDay.toISOString().split('T')[0]
      });
    }
  }

  private getStartOfWeek(date: Date): Date {
    const d: Date = new Date(date);
    const day: number = d.getDay();
    const diff: number = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }
}