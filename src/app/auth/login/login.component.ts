import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoading: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(f: NgForm) {

  }

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);

}
