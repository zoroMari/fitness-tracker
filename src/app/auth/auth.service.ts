import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { IAuthData } from "./auth-data.model";
import { IUser } from "./user.model";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { TrainingService } from "../training/training.service";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _isAuthenticated = false;
  public authChanged = new Subject<boolean>();

  constructor(
    private _router: Router,
    private _angularfireAuth: AngularFireAuth,
    private _trainingService: TrainingService,
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
    this._angularfireAuth.createUserWithEmailAndPassword(
      authData.email,
      authData.password
    ).then(
      result => {
        console.log('result >>>', result);
      }
    ).catch(
      error => console.log('error >>>', error)
    );
  }

  public login(authData: IAuthData) {
    this._angularfireAuth.signInWithEmailAndPassword(
      authData.email,
      authData.password
    ).then(
      result => {
      }
    ).catch(
      error => console.log('error >>>', error)
    );
  }

  public logout() {
    this._angularfireAuth.signOut();
  }

  public isAuth() {
    return this._isAuthenticated;
  }

}
