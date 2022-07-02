import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.sass']
})
export class SignupComponent implements OnInit {
  maxDate: Date;

  constructor(private _authService: AuthService) { }

  ngOnInit(): void {
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  handleSubmit(form: NgForm) {
    console.log('form >>>', form.value);
    console.log('form >>>', form.value.email);


    this._authService.registerUser(
      {
        email: form.value.email,
        password: form.value.password,
      }
    );
  }

}
