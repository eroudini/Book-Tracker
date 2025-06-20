import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    // C'est la route "parente" qui contient les onglets
    path: 'tabs',
    component: TabsPage,
    // Ce sont les routes "enfants", une pour chaque onglet
    children: [
      {
        path: 'library', 
        loadChildren: () => import('../library/library.module').then(m => m.LibraryPageModule)
      },
      {
        path: 'stats',   
        loadChildren: () => import('../stats/stats.module').then(m => m.StatsPageModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('../settings/settings.module').then(m => m.SettingsPageModule)
      },
      {
        // Ceci est la redirection par défaut. Quand on arrive sur /tabs, on est envoyé vers /tabs/library
        path: '',
        redirectTo: '/tabs/library',
        pathMatch: 'full'
      }
    ]
  },
  {
    // Redirection globale pour que l'application s'ouvre directement sur les onglets
    path: '',
    redirectTo: '/tabs/library',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}