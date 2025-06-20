import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BookAddEditPage } from './book-add-edit.page';

const routes: Routes = [
  {
    path: '',
    component: BookAddEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookAddEditPageRoutingModule {}
