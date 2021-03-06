import { Component, OnInit, OnDestroy } from '@angular/core';
import {SegmentChangeEventDetail} from '@ionic/core';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';

import { PlacesService } from '../places.service';
import { Place } from '../places.model';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  loadedPlaces: Place[];
  listedLoadedPlaces: Place[];
  filteredPlaces: Place[];
  isLoading = false;
  private placesSubs: Subscription;
  private currentFilter = 'all';

  constructor(
    private placesService: PlacesService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.placesSubs = this.placesService.places.subscribe(places => {
      this.authService.userId.pipe(take(1)).subscribe(userId => {
        this.loadedPlaces = places;

        if (this.currentFilter === 'all' ) {
          this.filteredPlaces = this.loadedPlaces;
        } else {
          this.filteredPlaces = this.loadedPlaces.filter(place => place.userId !== userId);
        }
        this.listedLoadedPlaces = this.filteredPlaces.slice(1);
      });
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.placesService.fetchPlaces().subscribe((places) => {
      this.isLoading = false;
      this.loadedPlaces = places;
      this.authService.userId.pipe(take(1)).subscribe(userId => {
        if (this.currentFilter === 'all' ) {
          this.filteredPlaces = this.loadedPlaces;
        } else {
          this.filteredPlaces = this.loadedPlaces.filter(place => place.userId !== userId);
        }
        this.listedLoadedPlaces = this.filteredPlaces.slice(1);
      });
    });
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    this.currentFilter = event.detail.value;
    this.authService.userId.pipe(take(1)).subscribe(userId => {
      if (event.detail.value === 'all' ) {
        this.filteredPlaces = this.loadedPlaces;
      } else {
        this.filteredPlaces = this.loadedPlaces.filter(place => place.userId !== userId);
      }
      this.listedLoadedPlaces = this.filteredPlaces.slice(1);
    });
  }

  ngOnDestroy() {
    if (this.placesSubs) {
      this.placesSubs.unsubscribe();
    }
  }

}
