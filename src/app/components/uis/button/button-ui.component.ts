import { Component, OnInit, Input } from '@angular/core';
import { UiComponent } from '../ui.component';
import { colorParams } from 'src/app/services/params/color.params.service';
import {sizeParams} from "../../../services/params/params.service";

@Component({
  selector: 'app-button-ui',
  templateUrl: './button-ui.component.html',
  styleUrls: ['./button-ui.component.css']
})
export default class ButtonUiComponent extends UiComponent {
  @Input() color: string = colorParams.primary;
  @Input() disabled: boolean = false;
  @Input() size: string = sizeParams.small;
  @Input() type: string = 'button';

  constructor() {
    super();
  }

  override ngOnInit(): void {
    // set color
    this.color = this.getColorClass(this.color);
    // set size
    this.size = this.getButtonSize(this.size);
  }

}
