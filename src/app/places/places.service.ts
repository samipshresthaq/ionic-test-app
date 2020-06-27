import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';

import { Place } from './places.model';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([
    new Place(
      'p1',
      'Basantapur',
      'Kathmandu',
      'This is capital',
      'http://ecs.com.np/fckimage/article/images/2015/9/basantapur_2.jpg',
      1200,
      new Date('2020-01-01'),
      new Date('2022-02-25'),
      'xyz'
    ),
    new Place(
      'p2',
      'Patan',
      'Lalitpur',
      'This is tourist place',
      'https://www.wondermondo.com/wp-content/uploads/2017/10/PatanDurbarSquare.jpg?ezimgfmt=ng:webp/ngcb9',
      1000,
      new Date('2022-08-01'),
      new Date('2022-11-11'),
      'xyz'
    ),
    new Place(
      'p3',
      'Bhaktapur',
      'Bhaktapur',
      'This is another famous tourist place',
      'http://www.holidaynepal.com/gallery/images/bhaktapur.jpg',
      889,
      new Date('2024-07-03'),
      new Date('2025-07-03'),
      'xyz'
    ),
  ]);

  private _offers = new BehaviorSubject<Place[]>([
    new Place(
      'p1',
      'Sahid Smarak',
      'Hetauda',
      'Green city of country',
      'https://3.bp.blogspot.com/-6PTDCRU0Tpc/W4oiJnL-IDI/AAAAAAAAHyA/8BDSXsTkcmAHCNacm1FK8kdLPgIAq4P1gCLcBGAs/s1600/20170108_095254.jpg',
      5399,
      new Date('2024-07-03'),
      new Date('2025-07-03'),
      'xyz'
    ),
    new Place(
      'p2',
      'Antu Danda',
      'Illam',
      'Illam, a beautiful hill station in the eastern part of Nepal. It is popular for the tea production and it’s luxurious tea gardens which would take your breath away. Not just for tea, but there are a number of places you can visit.',
      'https://omgnepal.com/wp-content/uploads/2018/07/0002-1469162707.png',
      299,
      new Date('2024-07-03'),
      new Date('2025-07-03'),
      'xyz'
    ),
    new Place(
      'p3',
      'Siddi Thumka',
      'Illam',
      'Illam, a beautiful hill station in the eastern part of Nepal. It is popular for the tea production and it’s luxurious tea gardens which would take your breath away. Not just for tea, but there are a number of places you can visit.',
      'https://omgnepal.com/wp-content/uploads/2018/07/0006-1469162707.png',
      599,
      new Date('2024-07-03'),
      new Date('2025-07-03'),
      'xyz'
    ),
  ]);

  get places(): Observable<Place[]> {
    return this._places.asObservable();
  }

  get offers(): Observable<Place[]> {
    return this._offers.asObservable();
  }
  constructor(private authService: AuthService) {}

  getPlace(id: string): Observable<Place> {
    return this.places.pipe(
      take(1),
      map(places => {
        return { ...places.find((pl) => pl.id === id) };
      })
    );
  }

  addPlace(
    title: string,
    location: string,
    description: string,
    price: number,
    availableFrom: Date,
    availableTo: Date
  ) {
    const newPlace = new Place(
      `p${Math.round(Math.random() * 10).toString()}`,
      title,
      location,
      description,
      'https://omgnepal.com/wp-content/uploads/2018/07/0006-1469162707.png',
      price,
      availableFrom,
      availableTo,
      this.authService.userId
    );

    this.places.pipe(take(1)).subscribe(places => {
      this._places.next(places.concat(newPlace));
    });

  }
}
