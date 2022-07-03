import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Subject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class UIServise {
  constructor(private _snackbar: MatSnackBar) {}

  public loadingStateChange = new Subject<boolean>();

  public showSnackbar(message: string, value: string, duration: number) {
    this._snackbar.open(message, value, {
      duration: duration
    })
  }
}
