import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { timer } from 'rxjs';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
  }

  onLogin() {
    this.isLoading = true;
    this.authService.login();
    this.loadingCtrl
      .create({
        keyboardClose: true,
        spinner: 'crescent',
        message: 'Logging in...'
      })
      .then(loadingElem => {
        loadingElem.present();

        timer(1500).subscribe(() => {
          this.isLoading = false;
          loadingElem.dismiss();
          this.router.navigateByUrl('/places');
        });
      });
  }

}
