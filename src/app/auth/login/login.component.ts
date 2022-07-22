import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UIServise } from 'src/app/shared/ui.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit, OnDestroy {
  public loginForm: FormGroup;
  public isLoading = false;
  private _loadingSub: Subscription;

  constructor(
    private _authService: AuthService,
    private _uiService: UIServise,
  ) { }

  ngOnInit(): void {
    this._loadingSub = this._uiService.loadingStateChange.subscribe(
      isLoading => this.isLoading = isLoading
    );

    this.loginForm = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', Validators.required),
    })
  }

  public handleSubmit() {
    this._authService.login({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    });

    this._authService.initAuthListener();

  }

  ngOnDestroy(): void {
    if (this._loadingSub) {
      this._loadingSub.unsubscribe();
    }
  }

}
