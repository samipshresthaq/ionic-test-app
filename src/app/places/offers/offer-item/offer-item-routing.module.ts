import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OfferItemComponent } from './offer-item.page';

const routes: Routes = [
  {
    path: '',
    component: OfferItemComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfferItemRoutingModule {}
