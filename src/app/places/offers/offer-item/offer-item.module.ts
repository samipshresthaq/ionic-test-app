import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { OfferItemRoutingModule } from './offer-item-routing.module';

import { OfferItemComponent } from './offer-item.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    OfferItemRoutingModule
  ],
  declarations: [OfferItemComponent]
})
export class NewOfferPageModule {}
