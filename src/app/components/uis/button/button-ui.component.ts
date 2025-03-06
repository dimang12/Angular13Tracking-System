import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-button-ui',
  templateUrl: './button-ui.component.html',
  styleUrls: ['./button-ui.component.css']
})
export default class ButtonUiComponent implements OnInit {
  constructor() {
    console.log('ButtonUiComponent');
  }

  ngOnInit(): void {
  }
}
