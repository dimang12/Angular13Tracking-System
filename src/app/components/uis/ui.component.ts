import { Component, OnInit } from '@angular/core';
import { colorParams } from 'src/app/services/params/color.params.service';
import { sizeParams } from 'src/app/services/params/params.service';


@Component({
  selector: 'app-ui',
  template: '<div></div>',
})

export class UiComponent implements OnInit {
  constructor() {
  }

  ngOnInit(): void {
  }

  // set color
  getColorClass(color: string): string {
    // @ts-ignore
    return colorParams[color] || colorParams.primary;
  }

  // set size
  getButtonSize(size: string): string {
    // @ts-ignore
    return sizeParams[size] || sizeParams.medium;
  }
}
