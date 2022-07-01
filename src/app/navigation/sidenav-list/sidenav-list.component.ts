import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.sass']
})
export class SidenavListComponent implements OnInit, OnDestroy {
  @Input() sidenav;
  public isLogin = false;
  private _authSub: Subscription;

  constructor(private _authService: AuthService) { }

  ngOnInit(): void {
    this._authSub = this._authService.authChanged.subscribe(
      (isLogin: boolean) => {
        this.isLogin = isLogin;
      }
    )
  }

  handleLogout() {
    this.sidenav.close();
    this._authService.logout();
  }

  ngOnDestroy(): void {
    this._authSub.unsubscribe();
  }
}
