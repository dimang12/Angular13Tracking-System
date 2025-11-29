import { Component, OnInit, Input, Inject } from '@angular/core';
import { UiComponent } from '../ui.component';

@Component({
  selector: 'app-button-ui',
  templateUrl: './button-ui.component.html',
  styleUrls: ['./button-ui.component.css']
})
export class ButtonUiComponent extends UiComponent {
  @Input() color: string = 'primary';
  @Input() disabled: boolean = false;
  @Input() size: string = 'small';
  @Input() type: string = 'button';

  constructor(
    @Inject('COLOR_PARAMS') colorParams: any,
    @Inject('SIZE_PARAMS') sizeParams: any
  ) {
    super(colorParams, sizeParams);
  }

  override ngOnInit(): void {
    // set color
    this.color = this.getColorClass(this.color);
    // set size
    this.size = this.getButtonSize(this.size);
  }
}
