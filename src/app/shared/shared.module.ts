// src/app/shared/shared.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [] // Export the pipe so it can be used in other modules
})
export class SharedModule {}
