import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-top-navigation',
  templateUrl: './top-navigation.component.html',
  styleUrls: ['./top-navigation.component.css']
})
export class TopNavigationComponent implements OnInit {
  user$: Observable<firebase.User | null>;

  constructor(private authService: AuthService) {
    this.user$ = this.authService.getUser();
  }

  ngOnInit(): void {}

  logout(): void {
    this.authService.logout();
  }
}
