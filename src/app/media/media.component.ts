import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreadcrumbInterface } from "../interfaces/breadcrumb.interface";
import { GoogleAIService } from '../services/google-ai.service';
import { VertexAIService, VideoGenerationOptions } from '../services/vertex-ai.service';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.css']
})
export class MediaComponent implements OnInit, OnDestroy {

  public breadcrumbs: BreadcrumbInterface[] = [
    { label: 'Media', link: '/media', active: true }
  ];

  // Text generation properties
  textPrompt: string = '';
  textResult: string = '';
  textLoading: boolean = false;
  textError: string = '';
  selectedFeature: string = 'text-generation';

  // Video generation properties
  videoPrompt: string = '';
  videoResult: any = null;
  videoLoading: boolean = false;
  videoError: string = '';
  videoOptions: VideoGenerationOptions = {
    aspectRatio: '16:9',
    sampleCount: 2,
    durationSeconds: '8',
    personGeneration: 'allow_adult',
    addWatermark: true,
    includeRaiReason: true,
    generateAudio: true
  };

  // Operation polling
  private pollingInterval: any;
  currentOperation: any = null;

  constructor(
    private googleAIService: GoogleAIService,
    private vertexAIService: VertexAIService
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }

  generateContent(): void {
    if (this.selectedFeature === 'video-generation') {
      if (!this.videoPrompt.trim()) {
        this.videoError = 'Please enter a video prompt';
        return;
      }
      this.generateVideo();
    } else {
      if (!this.textPrompt.trim()) {
        this.textError = 'Please enter a prompt';
        return;
      }
      this.generateText();
    }
  }

  generateText(): void {
    if (!this.textPrompt.trim()) {
      this.textError = 'Please enter a prompt';
      return;
    }

    this.textLoading = true;
    this.textError = '';
    this.textResult = '';

    this.googleAIService.generateText(this.textPrompt).subscribe({
      next: (response) => {
        console.log('Text generation response:', response);
        this.textLoading = false;
        
        if (response.candidates && response.candidates[0] && response.candidates[0].content) {
          this.textResult = response.candidates[0].content.parts[0].text;
        } else {
          this.textError = 'Unexpected response format';
        }
      },
      error: (error) => {
        console.error('Text generation error:', error);
        this.textLoading = false;
        this.textError = error.message || 'Failed to generate text';
      }
    });
  }

  generateVideo(): void {
    if (!this.videoPrompt.trim()) {
      this.videoError = 'Please enter a video prompt';
      return;
    }

    this.videoLoading = true;
    this.videoError = '';
    this.videoResult = null;
    this.currentOperation = null;

    // Clear any existing polling
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }

    this.vertexAIService.generateVideo(this.videoPrompt, this.videoOptions).subscribe({
      next: (response) => {
        console.log('Video generation initiated:', response);
        
        // Handle different response formats from SDK
        if (response.operation) {
          // SDK response format
          this.currentOperation = response.operation;
          if (response.operation.done) {
            this.handleVideoComplete(response.operation);
          } else {
            this.startPolling(response.operation.name);
          }
        } else if ((response as any).name) {
          // Direct operation response
          this.currentOperation = response;
          if ((response as any).done) {
            this.handleVideoComplete(response);
          } else {
            this.startPolling((response as any).name);
          }
        } else {
          // Unexpected format
          this.videoLoading = false;
          this.videoError = 'Unexpected response format from video generation';
        }
      },
      error: (error) => {
        console.error('Video generation error:', error);
        this.videoLoading = false;
        this.videoError = error.message || 'Failed to start video generation';
      }
    });
  }

  private startPolling(operationPath: string): void {
    console.log('Starting polling for operation:', operationPath);
    
    this.pollingInterval = setInterval(() => {
      this.vertexAIService.checkOperationStatus(operationPath).subscribe({
        next: (response) => {
          console.log('Operation status:', response);
          
          if (response.done) {
            clearInterval(this.pollingInterval);
            this.handleVideoComplete(response);
          }
        },
        error: (error: any) => {
          console.error('Error checking operation status:', error);
          clearInterval(this.pollingInterval);
          this.videoLoading = false;
          this.videoError = 'Error checking video generation status: ' + error.message;
        }
      });
    }, 10000); // Poll every 10 seconds
  }

  private handleVideoComplete(operation: any): void {
    this.videoLoading = false;
    
    if (operation.error) {
      this.videoError = `Video generation failed: ${operation.error.message || 'Unknown error'}`;
      return;
    }

    if (operation.response) {
      this.videoResult = operation.response;
      console.log('Video generation completed:', this.videoResult);
    } else {
      this.videoError = 'Video generation completed but no response data received';
    }
  }

  clearContent(): void {
    this.textPrompt = '';
    this.textResult = '';
    this.textError = '';
    this.videoPrompt = '';
    this.videoResult = null;
    this.videoError = '';
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      // You could add a toast notification here
      console.log('Copied to clipboard');
    });
  }

  getVideoUrl(): string {
    if (this.videoResult && this.videoResult.predictions && this.videoResult.predictions[0]) {
      return this.videoResult.predictions[0].videoUri;
    }
    return '';
  }

  getThumbnailUrl(): string {
    if (this.videoResult && this.videoResult.predictions && this.videoResult.predictions[0]) {
      return this.videoResult.predictions[0].thumbnailUri;
    }
    return '';
  }
}
