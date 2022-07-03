import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { IAuthData } from "./auth-data.model";
import { IUser } from "./user.model";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { TrainingService } from "../training/training.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { UIServise } from "../shared/ui.service";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _isAuthenticated = false;
  public authChanged = new Subject<boolean>();

  constructor(
    private _router: Router,
    private _angularfireAuth: AngularFireAuth,
    private _trainingService: TrainingService,
    private _snackBar: MatSnackBar,
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
          this._router.navigate(['/login']);
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
      }
    ).catch(error => {
        this._uiService.loadingStateChange.next(false);
        this._uiService.showSnackbar('The password is invalid or the user does not have a password', null, 3000)
      });
  }

  public logout() {
    this._angularfireAuth.signOut();
  }

  public isAuth() {
    return this._isAuthenticated;
  }

}
