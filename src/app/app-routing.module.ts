import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'book-add-edit',
    loadChildren: () => import('./pages/book-add-edit/book-add-edit.module').then( m => m.BookAddEditPageModule)
  },
  {
    path: 'book-search',
    loadChildren: () => import('./pages/book-search/book-search.module').then( m => m.BookSearchPageModule)
  },
  {
    path: 'book-detail',
    loadChildren: () => import('./pages/book-detail/book-detail.module').then( m => m.BookDetailPageModule)
  },
  {
  path: 'book-detail/:id',
  loadChildren: () => import('./pages/book-detail/book-detail.module').then( m => m.BookDetailPageModule)
}
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
