import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, NgForm } from '@angular/forms'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  maxDate: Date = new Date();

  constructor(
  ) { }

  ngOnInit(): void {
    this.maxDate.setFullYear(this.maxDate.getUTCFullYear() - 18);
  }

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);

  onSubmit(f: NgForm) {

  }

}
