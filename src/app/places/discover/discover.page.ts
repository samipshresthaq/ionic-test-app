import { Component, OnInit, OnDestroy } from '@angular/core';
import {SegmentChangeEventDetail} from '@ionic/core';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';

import { PlacesService } from '../places.service';
import { Place } from '../places.model';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  loadedPlaces: Place[];
  listedLoadedPlaces: Place[];
  filteredPlaces: Place[];
  private placesSubs: Subscription;

  constructor(
    private placesService: PlacesService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.placesSubs = this.placesService.places.subscribe(places => {
      this.loadedPlaces = places;
      this.filteredPlaces = this.loadedPlaces;
      this.listedLoadedPlaces = this.filteredPlaces.slice(1);
    });
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    if (event.detail.value === 'all' ) {
      this.filteredPlaces = this.loadedPlaces;
      this.listedLoadedPlaces = this.filteredPlaces.slice(1);
    } else {
      this.filteredPlaces = this.loadedPlaces.filter(place => place.userId !== this.authService.userId);
      this.listedLoadedPlaces = this.filteredPlaces.slice(1);
    }
    console.log(event.detail);
  }

  ngOnDestroy() {
    if (this.placesSubs) {
      this.placesSubs.unsubscribe();
    }
  }

}
