import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-ui',
  template: '<div></div>',
})
export class UiComponent implements OnInit {
  constructor(
    @Inject('COLOR_PARAMS') private colorParams: any,
    @Inject('SIZE_PARAMS') private sizeParams: any
  ) {}

  ngOnInit(): void {
  }

  // set color
  getColorClass(color: string): string {
    return this.colorParams[color] || this.colorParams.primary;
  }

  // set size
  getButtonSize(size: string): string {
    return this.sizeParams[size] || this.sizeParams.medium;
  }
}
