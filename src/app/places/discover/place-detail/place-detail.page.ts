import { PlacesService } from './../../places.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ModalController, ActionSheetController } from '@ionic/angular';

import { CreateBookingComponent } from './../../../bookings/create-booking/create-booking.component';
import { Place } from '../../places.model';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {
  place: Place;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private placesService: PlacesService,
    private actionSheetCtrl: ActionSheetController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe( paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      this.place = this.placesService.getPlace(paramMap.get('placeId'));
    });
  }

  onBookPlace() {
    // this.router.navigateByUrl('/places/tabs/discover');
    // this.navCtrl.pop(); not effective when no navigation history
    // this.navCtrl.navigateBack('/places/tabs/discover');
    this.actionSheetCtrl.create({
      header: "Choose an action",
      buttons: [
        {
          text: "Select Date",
          handler: () => {
            this.openBookingModal('select');
          }
        },
        {
          text: "Random Date",
          handler: () => {
            this.openBookingModal('random');
          }
        },
        {
          text: "Cancel",
          role: "cancel"
        }
      ]
    }).then(actionEl => {
      actionEl.present();
    });

  }

  openBookingModal(mode: 'select' | 'random') {
    this.modalCtrl
    .create({
      component: CreateBookingComponent,
      componentProps: {
        selectedPlace: this.place,
        mode
      }
    })
    .then(modelEl => {
      modelEl.present();
      return modelEl.onDidDismiss();
    })
    .then(resultData => {
      console.log(resultData.data, resultData.role);
      if (resultData.role === 'confirm') {
        console.log('Booked');
      }
    });
  }
}
