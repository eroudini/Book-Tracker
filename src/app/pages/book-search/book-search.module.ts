import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookSearchPageRoutingModule } from './book-search-routing.module';

import { BookSearchPage } from './book-search.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BookSearchPageRoutingModule,
    BookSearchPage // Import du composant standalone
  ]
  // Retirer BookSearchPage des declarations
})
export class BookSearchPageModule {}
