import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';
import { PlacesService } from '../places.service';
import { Place } from '../places.model';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {
  loadedOffers: Place[];
  isLoading = false;
  userId: string;
  private placesSubs: Subscription;

  constructor(
    private placesService: PlacesService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.userId.pipe(take(1))
    .subscribe(uId => {
      if (!uId) {
        throw new Error('User not found');
      }
      this.userId = uId;
      this.placesSubs = this.placesService.places.subscribe(places => this.loadedOffers = places);
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.placesService.fetchPlaces().subscribe((places) => {
      this.loadedOffers = places;
      this.isLoading = false;
    });
  }

  onEdit(offerId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['/places/tabs/offers/edit', offerId]);
    console.log('Edit offer');
  }

  onDelete(offerId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.loadingCtrl.create({
      message: 'Deleting offer...'
    }).then(loadingEl => {
      loadingEl.present();
      this.placesService.deletePlace(offerId).subscribe(() => {
        loadingEl.dismiss();
      });
    });
  }

  ngOnDestroy() {
    if (this.placesSubs) {
      this.placesSubs.unsubscribe();
    }
  }

}
