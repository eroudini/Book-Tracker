import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { BookAddEditPageRoutingModule } from './book-add-edit-routing.module';

import { BookAddEditPage } from './book-add-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BookAddEditPageRoutingModule,
    BookAddEditPage
  ]
})
export class BookAddEditPageModule {}
