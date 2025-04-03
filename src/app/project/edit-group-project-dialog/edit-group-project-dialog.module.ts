import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { EditGroupProjectDialogComponent } from './edit-group-project-dialog.component';
import { UiModule } from '../../components/uis/ui.module';
import { colorParams } from '../../services/params/color.params.service';
import { sizeParams } from '../../services/params/params.service';

@NgModule({
  declarations: [
    EditGroupProjectDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    UiModule
  ],
  exports: [
    EditGroupProjectDialogComponent
  ],
  providers: [
    { provide: 'colorParams', useValue: colorParams },
    { provide: 'sizeParams', useValue: sizeParams }
  ]
})
export class EditGroupProjectDialogModule { } 