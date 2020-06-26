import { ModalController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';

import { Place } from './../../places/places.model';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPlace: Place;
  @Input() selectedMode: 'select' | 'random';

  startDate: string;
  endDate: string;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    const availableFrom = new Date(this.selectedPlace.availableFrom);
    const availableTo = new Date(this.selectedPlace.availableTo);
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    if (this.selectedMode === 'random') {
      this.startDate = new Date(
        availableFrom.getTime() +
          Math.random() *
            (availableTo.getTime() - availableFrom.getTime() - oneWeek)
      ).toISOString();

      this.endDate =
        new Date(
          new Date(this.startDate).getTime() +
          Math.random() *
            (availableTo.getTime() - new Date(this.startDate).getTime())
        ).toISOString();
    }
  }

  onBook(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.modalCtrl.dismiss({ message: 'Place Booked' }, 'confirm');
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
