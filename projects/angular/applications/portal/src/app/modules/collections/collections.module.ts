import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';

import { CriterionFieldComponent, PropertyFieldComponent, RoleFieldComponent } from './components';
import { CollectionsFormPageComponent, CollectionsListPageComponent } from './pages';

export const ROUTES: Routes = [
  { path: '', component: CollectionsListPageComponent },
  {
    path: ':collectionName/records',
    loadChildren: '../records/records.module#RecordModule',
  },
  { path: ':name', component: CollectionsFormPageComponent },
];

@NgModule({
  declarations: [
    CriterionFieldComponent,
    PropertyFieldComponent,
    RoleFieldComponent,

    CollectionsFormPageComponent,
    CollectionsListPageComponent,
  ],
  imports: [SharedModule, RouterModule.forChild(ROUTES)],
})
export class CollectionModule {}
