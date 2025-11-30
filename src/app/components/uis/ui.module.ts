import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiComponent } from './ui.component';
import { ButtonUiComponent } from './button/button-ui.component';
import { colorParams } from '../../services/params/color.params.service';
import { sizeParams } from '../../services/params/params.service';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { OpenaiToastComponent } from './openai-toast/openai-toast.component';

@NgModule({
  declarations: [
    UiComponent,
    ButtonUiComponent,
    OpenaiToastComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  exports: [
    UiComponent,
    ButtonUiComponent,
    OpenaiToastComponent
  ],
  providers: [
    { provide: 'COLOR_PARAMS', useValue: colorParams },
    { provide: 'SIZE_PARAMS', useValue: sizeParams }
  ]
})
export class UiModule { }
