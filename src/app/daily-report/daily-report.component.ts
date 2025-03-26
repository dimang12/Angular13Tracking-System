import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TaskService } from '../services/task.service';
import { ProjectService } from '../services/project.service';
import { DailyReportService } from '../services/daily-report.service';
import { TaskInterface } from '../interfaces/task.interface';
import { ProjectInterface } from '../interfaces/project.interface';
import { BreadcrumbInterface } from '../interfaces/breadcrumb.interface';
import { DatePipe } from '@angular/common';
import { Timestamp } from '@angular/fire/firestore';
import { RichTextEditorComponent } from '../components/uis/rich-text-editor/rich-text-editor.component';

@Component({
  selector: 'app-daily-report',
  templateUrl: './daily-report.component.html',
  styleUrls: ['./daily-report.component.css'],
  providers: [DatePipe]
})
export class DailyReportComponent implements OnInit {
  @ViewChild('referencePopup') referencePopup!: TemplateRef<any>;
  @ViewChild(RichTextEditorComponent) richTextEditor!: RichTextEditorComponent;

  reportForm: FormGroup;
  selectedDate: Date = new Date();
  showAllReports: boolean = true;
  isContentEmpty: boolean = true;
  tasks: TaskInterface[] = [];
  projects: ProjectInterface[] = [];
  references: Array<{ name: string }> = [];
  reports: any[] = [];
  filteredReports: any[] = [];
  public breadcrumbs: BreadcrumbInterface[] = [
    { label: 'Daily Report', link: '/daily-report', active: true }
  ];

  quillModules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      ['image', 'code-block']
    ]
  };

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private projectService: ProjectService,
    private dailyReportService: DailyReportService,
    private dialog: MatDialog,
    private datePipe: DatePipe
  ) {
    this.reportForm = this.fb.group({
      date: [this.selectedDate, Validators.required],
      content: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.taskService.getTasks().subscribe(tasks => this.tasks = tasks);
    this.projectService.getProjects().subscribe(projects => this.projects = projects);
    this.dailyReportService.getDailyReports().subscribe(reports => {
      this.reports = reports.map(report => {
        const timestamp = report.date as unknown as Timestamp;
        const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
        const formattedDate = this.datePipe.transform(date, 'MMMM d, y, h:mm:ss a', 'GMT+0');
        return {
          ...report,
          date,
          newDateFormat: formattedDate
        };
      }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      this.filterReports();
    });
  }

  onDateChange(date: Date): void {
    this.selectedDate = date;
    this.showAllReports = false;
    this.filterReports();
  }

  onToggleChange(event: any): void {
    this.filterReports();
  }

  filterReports(): void {
    if (this.showAllReports) {
      this.filteredReports = this.reports;
    } else {
      this.filteredReports = this.reports.filter(report => {
        const reportDate = new Date(report.date);
        return reportDate.toDateString() === this.selectedDate.toDateString();
      });
    }
  }

  openReferencePopup(): void {
    this.dialog.open(this.referencePopup, {
      width: '80%',
      height: '80%',
    });
  }

  closeReferencePopup(): void {
    this.dialog.closeAll();
  }

  addReference(ref: { name: string }): void {
    this.references.push(ref);
    this.dialog.closeAll();
  }

  removeReference(ref: { name: string }): void {
    const index = this.references.indexOf(ref);
    if (index >= 0) {
      this.references.splice(index, 1);
    }
  }

  onSubmit(): void {
    if (this.reportForm.valid && !this.isContentEmpty) {
      const reportData = {
        ...this.reportForm.value,
        references: this.references
      };
      this.dailyReportService.addDailyReport(reportData).subscribe();
      this.reportForm.reset({
        date: this.selectedDate,
        content: ''
      });
      this.references = [];
      this.richTextEditor.resetContent();
    }
  }

  onEditorContentChanged(content: string): void {
    const textOnly = content.replace(/<[^>]*>/g, '');
    this.isContentEmpty = !(textOnly?.length > 0);
    this.reportForm.patchValue({ content });
  }
}
