import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskService } from '../../services/task.service';
import { ProjectService } from '../../services/project.service';
import { CommentService } from '../../services/comment.service';
import { ProjectInterface } from '../../interfaces/project.interface';
import { TaskInterface } from '../../interfaces/task.interface';
import { percentageParams } from '../../services/params/params.service';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit {
  public taskForm: FormGroup;
  public commentForm: FormGroup;
  public projects: ProjectInterface[] = [];
  public tasks: TaskInterface[] = [];
  public percentageParams = percentageParams;
  public comments: string[] = [];

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private projectService: ProjectService,
    private commentService: CommentService,
    public dialogRef: MatDialogRef<EditTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskInterface
  ) {
    this.taskForm = this.fb.group({
      name: [this.data.name, Validators.required],
      project: [this.data.project, Validators.required],
      dueDate: [this.data.dueDate],
      status: [this.data.status, Validators.required],
      detail: [this.data.detail, Validators.required],
      startDate: [this.data.startDate],
      endDate: [this.data.endDate],
      numberOfDays: [{ value: this.data.numberOfDays, disabled: true }],
      priority: [this.data.priority],
      parentTask: [this.data.parentTask],
      loe: [this.data.loe],
      percentageCompletion: [this.data.percentageCompletion],
      taskNumber: [this.data.taskNumber]
    });

    this.commentForm = this.fb.group({
      comment: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.projectService.getProjects().subscribe((projects) => {
      this.projects = projects;
    });

    this.taskService.getTasks().subscribe((tasks) => {
      this.tasks = tasks;
    });

    this.loadComments();
  }

  /**
   * Calculate days
   */
  calculateDays(): void {
    const startDate = this.taskForm.get('startDate')?.value;
    const endDate = this.taskForm.get('endDate')?.value;
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      this.taskForm.get('numberOfDays')?.setValue(diffDays + 1);
    }
  }

  /**
   * On submit Update task
   */
  onSubmit(): void {
    if (this.taskForm.valid) {
      this.taskForm.get('numberOfDays')?.enable(); // Enable the control before getting the value
      const taskData = {
        ...this.taskForm.value,
        id: this.data.id
      };
      this.taskService.updateTask(taskData.id, taskData).subscribe(() => {
        // update number of task in project
        this.taskService.updateNumberOfTaskInProject(taskData.project);
        // update percentage completion in project
        this.taskService.updateCompletionPercentage(taskData.project);
        this.dialogRef.close();
      });
      this.taskForm.get('numberOfDays')?.disable(); // Disable the control again if needed
    }
  }


  private loadComments(): void {
    this.commentService.getComments(this.data.id).subscribe((comments: any[]) => {
      this.comments = comments.map(comment => comment.comment);
    });
  }

  onCommentSubmit(): void {
    if (this.commentForm.valid) {
      this.commentService.addComment(this.data.id, this.commentForm.value.comment).subscribe(() => {
        this.comments.push(this.commentForm.value.comment);
        this.commentForm.reset();
      });
    }
  }


  onEditorContentChanged(content: string): void {
    this.commentForm.get('comment')?.setValue(content);
  }


  /**
   * On cancel close dialog
   */
  onCancel(): void {
    this.dialogRef.close();
  }
}
