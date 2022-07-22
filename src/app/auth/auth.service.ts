import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Subject } from "rxjs";
import { IAuthData } from "./auth-data.model";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { TrainingService } from "../training/training.service";
import { UIServise } from "../shared/ui.service";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _isAuthenticated = false;
  public authChanged = new Subject<boolean>();
  public activeUserEmail: string = null;

  constructor(
    private _router: Router,
    private _angularfireAuth: AngularFireAuth,
    private _trainingService: TrainingService,
    private _uiService: UIServise,
  ) {}

  public initAuthListener() {
    this._angularfireAuth.authState.subscribe(
      user => {
        if (user) {
          this._isAuthenticated = true;
          this.authChanged.next(true);
          this._router.navigate(['/training']);
        } else {
          this._trainingService.cancelSubscription();
          this._isAuthenticated = false;
          this.authChanged.next(false);
          this._router.navigate(['/home']);
        }
      }
    )
  }

  public registerUser(authData: IAuthData) {
    this._uiService.loadingStateChange.next(true);
    this._angularfireAuth.createUserWithEmailAndPassword(
      authData.email,
      authData.password
    ).then(
      result => {
        this._uiService.loadingStateChange.next(false);
        this.activeUserEmail = authData.email;
        localStorage.setItem('activeUserMail', authData.email);
      })
      .catch(error => {
        this._uiService.loadingStateChange.next(false);
        this._uiService.showSnackbar('The password is invalid or the user does not have a password', null, 3000)
      });
  }

  public login(authData: IAuthData) {
    this._uiService.loadingStateChange.next(true);
    this._angularfireAuth.signInWithEmailAndPassword(
      authData.email,
      authData.password
    ).then(
      result => {
        this._uiService.loadingStateChange.next(false);
        this.activeUserEmail = authData.email;
        localStorage.setItem('activeUserMail', authData.email);
      }
    ).catch(error => {
        this._uiService.loadingStateChange.next(false);
        this._uiService.showSnackbar('The password is invalid or the user does not have a password', null, 3000)
      });
  }

  public logout() {
    this._angularfireAuth.signOut();
    this.activeUserEmail = null;
    localStorage.removeItem('activeUserMail');
    this.authChanged.next(false);
    this._router.navigate(['/home']);
  }

  public isAuth() {
    return this._isAuthenticated;
  }

  public autoLogin() {
    if (localStorage.getItem('activeUserMail')) {
      this._isAuthenticated = true;
      this.authChanged.next(true);
      this.activeUserEmail = localStorage.getItem('activeUserMail');
    }
  }
}
