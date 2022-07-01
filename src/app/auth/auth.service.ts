import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { IAuthData } from "./auth-data.model";
import { IUser } from "./user.model";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user: IUser;
  public authChanged = new Subject<boolean>();

  constructor(private _router: Router) {}

  public registerUser(authData: IAuthData) {
    this._user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString(),
    }

    this._authSuccessfully();
  }

  public login(authData: IAuthData) {
    this._user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString(),
    };

    this._authSuccessfully();
  }

  public logout() {
    this._user = null;
    this.authChanged.next(false);
    this._router.navigate(['/login']);
  }

  get user() {
    return { ...this._user };
  }

  public isAuth() {
    return this._user != null;
  }

  private _authSuccessfully() {
    this.authChanged.next(true);
    this._router.navigate(['/training']);
  }
}
