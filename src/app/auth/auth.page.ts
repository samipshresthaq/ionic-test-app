import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';

import { AuthService, AuthResponseData } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoading = false;
  isLoginMode = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
  }

  authenticate(email: string, password: string) {
    this.isLoading = true;
    return this.loadingCtrl
      .create({
        keyboardClose: true,
        spinner: 'crescent',
        message: this.isLoginMode ? 'Logging in...' : 'Signing up. Please wait...'
      })
      .then(loadingElem => {
        let authObs: Observable<AuthResponseData>;
        loadingElem.present();

        if (this.isLoginMode) {
          authObs = this.authService.login(email, password);
        } else {
          authObs = this.authService.signUp(email, password);
        }

        authObs.subscribe((resData: AuthResponseData) => {
          loadingElem.dismiss();
          if (this.isLoginMode) {
            this.router.navigateByUrl('/places/tabs/discover');
          } else {
            this.isLoginMode = true;
            this.toastCtrl.create({
              message: 'New account Successfully created! Login to procced!',
              duration: 5000,
              buttons: ['OK']
            }).then(toastEl => {
              toastEl.present();
            });
          }
          // show success message
        }, errResp => {
          loadingElem.dismiss();
          const error = errResp.error.error.message;
          let errorMsg: string;

          switch (error) {
            case 'EMAIL_EXISTS':
              errorMsg = 'The email address already exists!';
              break;
            case 'INVALID_EMAIL':
              errorMsg = 'The email address is invalid!';
              break;
            case 'EMAIL_NOT_FOUND':
            case 'INVALID_PASSWORD':
              errorMsg = 'The email or password is incorrect!';
              break;
            default:
              errorMsg = 'An error occured during sign up. Please try again later!';
          }
          this.showAlert(errorMsg);
        });
      });
  }

  onSwitchLoginMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.authenticate(email, password).then(() => form.reset());
  }

  private showAlert(message: string) {
    this.alertCtrl.create({
      header: 'Authentication failed!',
      subHeader: message,
      buttons: ['Ok'],
    }).then(alertEl => {
      alertEl.present();
    });
  }

}
