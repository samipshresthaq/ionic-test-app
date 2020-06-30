import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take, tap, map, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { AuthService } from '../auth/auth.service';
import { Booking } from './booking.model';

interface BookData {
  endDate: string;
  firstName: string;
  guestNumber: number;
  lastName: string;
  placeId: string;
  placeImage: string;
  placeTitle: string;
  startDate: string;
  userId: string;
}

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private _bookings = new BehaviorSubject<Booking[]>([]);

  get bookings() {
    return this._bookings.asObservable();
  }

  constructor(private authService: AuthService, private httpClient: HttpClient) {}

  fetchBookings() {
    return this.authService.userId.pipe(take(1), switchMap(userId => {
     return this.httpClient
      .get<{ [key: string]: BookData }>(
        `https://ionic-test-project-a7ef7.firebaseio.com/bookings.json?orderBy="userId"&equaltTo="${ userId }"`
      )
      .pipe(
        map((res) => {
          const fetchedBookings: Booking[] = [];
          if (res) {
            Object.keys(res).forEach((key) => {
              fetchedBookings.push(
                new Booking(
                  key,
                  res[key].placeId,
                  res[key].firstName,
                  res[key].lastName,
                  res[key].userId,
                  res[key].placeTitle,
                  res[key].placeImage,
                  +res[key].guestNumber,
                  new Date(res[key].startDate),
                  new Date(res[key].endDate)
                )
              );
            });
          }

          return fetchedBookings;
        }),
        tap((bookings) => {
          this._bookings.next(bookings);
        })
      );
      }));
  }

  addBooking(
    placeId: string,
    placeTitle: string,
    placeImage: string,
    firstName: string,
    lastName: string,
    guestNumber: number,
    fromDate: Date,
    toDate: Date
  ) {
    let generatedId: string;
    let newBooking: Booking;
    return this.authService.userId.pipe(
      take(1),
      switchMap(
      (userId) => {
        if (!userId) {
          throw new Error('No login data found');
        }
        newBooking = new Booking(
          Math.random().toString(),
          placeId,
          firstName,
          lastName,
          userId,
          placeTitle,
          placeImage,
          guestNumber,
          fromDate,
          toDate
        );

        return this.httpClient.post<{name: string}>(
        'https://ionic-test-project-a7ef7.firebaseio.com/bookings.json',
        { ...newBooking, id: null });
      }),
      switchMap(resData => {
        generatedId = resData.name;
        return this.bookings;
      }),
      take(1),
      tap(bookings => {
        newBooking.id = generatedId;
        this._bookings.next(bookings.concat(newBooking));
      })
    );

    // return this.bookings.pipe(
    //   take(1),
    //   delay(1000),
    //   tap((bookings) => {
    //     this._bookings.next(bookings.concat(newBooking));
    //   })
    // );
  }

  cancelBooking(bookingId: string) {
    return this.httpClient.delete<{name: string}>('https://ionic-test-project-a7ef7.firebaseio.com/bookings.json').pipe(
      switchMap(resData => {
        return this.bookings;
      }),
      take(1),
      tap(bookings => {
        const updatedBooking = bookings.filter(booking => booking.id !== bookingId);
        this._bookings.next(updatedBooking);
      })
    );
  }
}
