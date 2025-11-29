import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TaskService } from '../services/task.service';
import { ProjectService } from '../services/project.service';
import { DailyReportService } from '../services/daily-report.service';
import { TaskInterface } from '../interfaces/task.interface';
import { ProjectInterface } from '../interfaces/project.interface';
import { DailyReportInterface, ReferenceInterface } from '../interfaces/daily-report.interface';
import { BreadcrumbInterface } from '../interfaces/breadcrumb.interface';
import { DatePipe } from '@angular/common';
import { Timestamp } from '@angular/fire/firestore';
import { RichTextEditorComponent } from '../components/uis/rich-text-editor/rich-text-editor.component';
import { ConfirmDialogComponent } from '../components/uis/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-daily-report',
  templateUrl: './daily-report.component.html',
  styleUrls: ['./daily-report.component.css'],
  providers: [DatePipe]
})
export class DailyReportComponent implements OnInit {
  @ViewChild('referencePopup') referencePopup!: TemplateRef<any>;
  @ViewChild(RichTextEditorComponent) richTextEditor!: RichTextEditorComponent;
  @ViewChild('tabGroup') tabGroup: any;

  reportForm: FormGroup;
  selectedDate: Date = new Date();
  showAllReports: boolean = true;
  isContentEmpty: boolean = true;
  tasks: TaskInterface[] = [];
  projects: ProjectInterface[] = [];
  references: Array<ReferenceInterface> = [];
  reports: any[] = [];
  filteredReports: any[] = [];
  public breadcrumbs: BreadcrumbInterface[] = [
    { label: 'Daily Report', link: '/daily-report', active: true }
  ];
  isLoading: boolean = false;
  isEditMode: boolean = false;
  currentReportId: string | null = null;
  content: string = '';
  // Control which tab is selected (0 = Report Form, 1 = History). Default to History.
  selectedTabIndex: number = 1;

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
      content: [this.content, Validators.required]
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

  onToggleChange(): void {
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

  addReference(ref: { id: string, name: string }, type: 'task' | 'project'): void {
    this.references.push({ ...ref, type });
    this.dialog.closeAll();
  }

  removeReference(ref: ReferenceInterface): void {
    const index = this.references.indexOf(ref);
    if (index >= 0) {
      this.references.splice(index, 1);
    }
  }

  onSubmit(): void {
    if (this.reportForm.valid && !this.isContentEmpty) {
      this.isLoading = true;
      const reportData: DailyReportInterface = {
        ...this.reportForm.value,
        references: this.references,
        id: this.currentReportId || '', // Use currentReportId if in edit mode
        userId: null, // Set userId as needed
        status: 1 // Set status as needed
      };

      if (this.isEditMode && this.currentReportId) {
        this.dailyReportService.updateDailyReport(this.currentReportId, reportData).subscribe(() => {
          this.resetForm();
        }, () => {
          this.isLoading = false;
        });
      } else {
        this.dailyReportService.addDailyReport(reportData).subscribe(() => {
          this.resetForm();
        }, () => {
          this.isLoading = false;
        });
      }
    }
  }

  onEditorContentChanged(content: string): void {
    const textOnly = content.replace(/<[^>]*>/g, '');
    this.isContentEmpty = !(textOnly?.length > 0);
    this.reportForm.patchValue({ content });
  }

  deleteReport(report: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Delete Report',
        message: `Are you sure you want to delete this report?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dailyReportService.deleteDailyReport(report.id).subscribe(() => {
          this.reports = this.reports.filter(r => r.id !== report.id);
          this.filterReports();
        });
      }
    });
  }

  editReport(report: DailyReportInterface): void {
    // Clear any previous content to ensure change detection notices the update
    this.content = '';
    this.isEditMode = true;
    this.currentReportId = report.id;
    // patch date immediately, content will be set after tab switch to ensure editor exists
    this.reportForm.patchValue({
      date: report.date,
      content: ''
    });
    this.references = report.references || [];
    // set selectedTabIndex so the bound mat-tab-group switches to the Report Form
    this.selectedTabIndex = 0;

    // Use a microtask to set content after the tab switch / editor initialization
    setTimeout(() => {
      this.content = report.content || '';
      this.reportForm.patchValue({ content: report.content || '' });
      // If the rich text editor component instance is available, update it directly as well
      if (this.richTextEditor && (this.richTextEditor as any).quill) {
        (this.richTextEditor as any).quill.root.innerHTML = report.content || '';
      }
    }, 0);
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  resetForm(): void {
    this.isLoading = false;
    this.isEditMode = false;
    this.currentReportId = null;
    this.reportForm.reset({
      date: this.selectedDate,
      content: ''
    });
    this.references = [];
    this.content = '';
    this.richTextEditor.resetContent();
  }
}
