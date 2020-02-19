import { ModalController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';

import { Place } from './../../places/places.model';
@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {

  @Input() selectedPlace: Place;
  @Input() mode: string;

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {}

  onBook() {
    this.modalCtrl.dismiss({message: 'Place Booked'}, 'confirm');
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

}
