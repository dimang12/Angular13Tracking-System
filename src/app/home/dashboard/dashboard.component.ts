import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { TaskInterface } from '../../interfaces/task.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public tasks: TaskInterface[] = [];

  //TODO: get top on going tasks

  constructor(
    private taskService: TaskService
  ) { }

  ngOnInit(): void {
    this.taskService.getTasksByStatus(['1','2'], 5).subscribe( tasks => {
        this.tasks = tasks;
      }
    );

  }

}
