import { Injectable } from '@angular/core';

import { Booking } from './booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private _bookings: Booking[] = [{
    id: 'booking1',
    placeId: '12',
    userId: 'u1',
    placeTitle: 'Chitwan',
    guestNumber: 5
  },{
    id: 'booking2',
    placeId: '13',
    userId: 'u1',
    placeTitle: 'Hetauda',
    guestNumber: 2
  }];

  get bookings() {
    return [...this._bookings];
  }
  constructor() { }
}
