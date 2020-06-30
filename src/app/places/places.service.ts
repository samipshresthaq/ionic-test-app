import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { take, map, tap, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { AuthService } from '../auth/auth.service';

import { Place } from './places.model';

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  image: string;
  location: string;
  price: number;
  title: string;
  userId: string;
}

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([]);

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
  constructor(private authService: AuthService, private httpClient: HttpClient ) {}

  fetchPlaces() {
    return this.httpClient
      .get<{ [key: string]: PlaceData }>(
        'https://ionic-test-project-a7ef7.firebaseio.com/offered-places.json'
      )
      .pipe(map(res => {
        const places = [];
        if (res) {
          Object.keys(res).forEach((key: string) => {
            places.push(new Place(
              key,
              res[key].title,
              res[key].location,
              res[key].description,
              res[key].image,
              res[key].price,
              new Date(res[key].availableFrom),
              new Date(res[key].availableTo),
              res[key].userId,
            ));
          });
        }

        return places;
      }),
      tap((places: Place[]) => this._places.next(places)));
  }

  getPlace(id: string) {
    return this.httpClient.get<PlaceData>(`https://ionic-test-project-a7ef7.firebaseio.com/offered-places/${id}.json`)
     .pipe(
      map((res) => {
        return new Place(
          id,
          res.title,
          res.location,
          res.description,
          res.image,
          res.price,
          new Date(res.availableFrom),
          new Date(res.availableTo),
          res.userId,
        );
      })
    );
    //  this.places.pipe(
    //   take(1),
    //   map(places => {
    //     return { ...places.find((pl) => pl.id === id) };
    //   })
    // );
  }

  addPlace(
    title: string,
    location: string,
    description: string,
    price: number,
    availableFrom: Date,
    availableTo: Date
  ) {
    let generatedId: string;
    let newPlace: Place;

    return this.authService.userId.pipe(take(1), switchMap(userId => {
      if (!userId) {
        throw new Error('User not found');
      }

      newPlace = new Place(
        `p${Math.round(Math.random() * 10).toString()}`,
        title,
        location,
        description,
        'https://omgnepal.com/wp-content/uploads/2018/07/0006-1469162707.png',
        price,
        availableFrom,
        availableTo,
        userId
      );

      return this.httpClient.post<{name: string}>(
        'https://ionic-test-project-a7ef7.firebaseio.com/offered-places.json',
        { ...newPlace, id: null }
      );
    }),
      switchMap(resData => {
        generatedId = resData.name;
        return this.places;
      }),
      take(1),
      tap(places => {
        newPlace.id = generatedId;
        this._places.next(places.concat(newPlace));
      })
    );

    // return this.places.pipe(take(1), delay(1000), tap(places => {
    //     this._places.next(places.concat(newPlace));
    // }));

  }

  updatePlace(
    id: string,
    title: string,
    description: string,
  ) {
    let updatedPlaces: Place[];
    return this.places.pipe(take(1),
    switchMap(places => {
      if (!places || !places.length) {
        return this.fetchPlaces();
      } else {
        return of(places);
      }
    }),
    switchMap(places => {
      const updatedPlaceIndex = places.findIndex(place => place.id === id);
      updatedPlaces = [...places];
      const oldPlace = updatedPlaces[updatedPlaceIndex];

      updatedPlaces[updatedPlaceIndex] = new Place(
        oldPlace.id,
        title,
        oldPlace.location,
        description,
        oldPlace.image,
        oldPlace.price,
        oldPlace.availableFrom,
        oldPlace.availableTo,
        oldPlace.userId
      );

      return this.httpClient.put(`https://ionic-test-project-a7ef7.firebaseio.com/offered-places/${id}.json`,
      {...updatedPlaces[updatedPlaceIndex], id: null});

    }), tap(() => {
      this._places.next(updatedPlaces);
    }));
  }

  deletePlace(placeId: string) {
    let updatedPlaces: Place[];
    return this.places.pipe(take(1), switchMap(places => {
        updatedPlaces = places.filter(place => place.id !== placeId);
        return this.httpClient.delete(`https://ionic-test-project-a7ef7.firebaseio.com/offered-places/${placeId}.json`);
      }), tap(() => {
        this._places.next(updatedPlaces);
      })
    );
  }
}
