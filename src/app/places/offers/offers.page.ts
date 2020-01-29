import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { PlacesService } from '../places.service';
import { Place } from '../places.model';
import { IonItemSliding } from '@ionic/angular';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {
  loadedOffers: Place[];

  constructor(
    private placesService: PlacesService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadedOffers = this.placesService.offers;
  }

  onEdit(offerId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['/places/tabs/offers/edit', offerId]);
    console.log("Edit offer");
  }

  onDelete(offerId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    console.log("Delete offer");
  }

}
