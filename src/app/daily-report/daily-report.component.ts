import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DailyReportService } from '../services/daily-report.service';
import {DailyReportInterface} from "../interfaces/daily-report.interface";
import {AuthService} from "../services/auth.service";


@Component({
  selector: 'app-daily-report',
  templateUrl: './daily-report.component.html',
  styleUrls: ['./daily-report.component.css']
})
export class DailyReportComponent implements OnInit {
  reportContent: string = ''; // Current draft report
  reports: DailyReportInterface[] = [];
  userId: string | null = null;


  constructor(
    private http: HttpClient,
    private dailyReportService: DailyReportService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    // retrieve the logged-in user's ID
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.userId = user.uid;
      }
    });

    // Load the daily reports
    this.dailyReportService.getDailyReports().subscribe(reports => {
      this.reports = reports;
    });
  }

  // Submit the daily report
  submitReport() {
    if (this.userId) {
      const newReport :DailyReportInterface = {
        id: '',
        userId: this.userId,
        reportDetail: this.reportContent,
        date: new Date(),
        status: 1
      }

      // Save to history
      this.dailyReportService.addDalyReport(newReport).subscribe();

      // add to the list of reports
      this.reports.push(newReport);

      // Clear the input field
      this.reportContent = '';
    }
  }


  // Use AI to improve the writing
  improveWriting() {
    const payload = {
      text: this.reportContent,
    };

    // Example API call for AI-powered text improvement
    this.http.post('https://ai-api.example.com/improve', payload).subscribe(
      (response: any) => {
        if (response && response.improvedText) {
          this.reportContent = response.improvedText;
        }
      },
      (error) => {
        console.error('Error improving writing:', error);
      }
    );
  }

}
