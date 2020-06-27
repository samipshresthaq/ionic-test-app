import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {
  form: FormGroup;

  constructor(
    private navCtrl: NavController,
    private placesService: PlacesService,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      price: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      }),
      fromDate: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      toDate: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      })
    });
  }

  onCreateOffer() {
    if (this.form.invalid) {
      return;
    }

    this.loadingCtrl.create({
      message: 'Adding offer...'
    }).then(loadingEl => {
      loadingEl.present();
      // return loadingEl.onDidDismiss();
      this.placesService.addPlace(
        this.form.value.title,
        'Nepal',
        this.form.value.description,
        +this.form.value.price,
        new Date(this.form.value.fromDate),
        new Date(this.form.value.toDate)
      ).subscribe(() => {
        loadingEl.dismiss();
        this.form.reset();
        this.navCtrl.navigateBack('/places/tabs/offers');
      });
    });

  }

  onAddOffer() {
    this.navCtrl.navigateBack('/places/tabs/offers');
  }
}
