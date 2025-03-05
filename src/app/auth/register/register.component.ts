import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, NgForm } from '@angular/forms'
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  maxDate: Date = new Date();
  // declare emailFormControl
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.maxDate.setFullYear(this.maxDate.getUTCFullYear() - 18);
  }


  /**
   * onSubmit save user data to firebase
   * @param f
   */
  onSubmit(f: NgForm) {
    const { registerEmail, registerPassword } = f.value;
    this.authService.register(registerEmail, registerPassword)
      .then((result: any) => {
        console.log('User registered', result);
        // redirect to /home after successful registration
        this.router.navigate(['/home']);
      })
      .catch((error: any) => {
        console.error('Error registering user:', error);
      });
  }

}
