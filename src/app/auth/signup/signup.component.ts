import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UIServise } from 'src/app/shared/ui.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.sass']
})
export class SignupComponent implements OnInit, OnDestroy {
  maxDate: Date;
  public isLoading = false;
  private _sub: Subscription;

  constructor(
    private _authService: AuthService,
    private _uiService: UIServise,
  ) { }

  ngOnInit(): void {
    this._sub = this._uiService.loadingStateChange.subscribe(
      isLoading => this.isLoading = isLoading
    );

    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  handleSubmit(form: NgForm) {
    this._authService.registerUser(
      {
        email: form.value.email,
        password: form.value.password,
      }
    );
  }

  ngOnDestroy(): void {
      this._sub.unsubscribe();
  }

}
