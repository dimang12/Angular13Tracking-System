// src/app/task/task.module.ts
import { SharedModule } from '../shared/shared.module';
import {NgModule} from "@angular/core";
import { DetailTaskComponent } from './detail-task/detail-task.component';

@NgModule({
  imports: [
    SharedModule, // Import the shared module
    // other imports...
  ],
  declarations: [
    // Remove StatusPipe from here

    DetailTaskComponent
  ]
})
export class TaskModule {}
