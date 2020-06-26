import { Component, OnInit, Input } from '@angular/core';

import { Place } from '../../places.model';

@Component({
  selector: 'app-offer-item',
  templateUrl: './offer-item.html',
  styleUrls: ['./offer-item.scss'],
})
export class OfferItemComponent implements OnInit {
  @Input() offer: Place;

  constructor(
  ) { }

  ngOnInit() {

  }

  getDummyDate() {
    return new Date();
  }
}
