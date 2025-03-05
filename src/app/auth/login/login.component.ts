import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoading: boolean = false;
  isLoginError: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onSubmit(f: NgForm) {
    this.isLoading = true;
    const { loginEmail ,loginPassword } = f.value
    this.authService.login(loginEmail, loginPassword)
      .then((result: any) => {
        console.log('User logged in', result);
        this.router.navigate(['/home']);
      })
      .catch(() => {
        this.isLoading = false;
        this.isLoginError = true;
      });
  }



}
