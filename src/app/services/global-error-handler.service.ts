import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private zone: NgZone) {}

  handleError(error: any): void {
    // Log the error with extra context (component stack if present)
    try {
      // Attempt to extract Angular debug context if available
      const debugCtx = (error && error.ngDebugContext) || (error && (error as any).rejection && (error as any).rejection.ngDebugContext);

      // Use zone.run to ensure logs show up in Angular context (useful when debugging)
      this.zone.run(() => {
        // Always log the error locally
        console.error('GlobalErrorHandler captured error: ', error);

        if (debugCtx) {
          try {
            const component = debugCtx.context && debugCtx.context.constructor && debugCtx.context.constructor.name;
            console.error('Component context:', component, debugCtx);
          } catch (e) {
            console.error('Failed to parse ngDebugContext', e);
          }
        }

        // In production you may want to report the error to an external tracking service
        if (environment.production) {
          // TODO: send error to your monitoring service (Sentry, Stackdriver, etc.)
          // For now just log a compact message so logs aren't flooded with full stacks
          console.warn('Error reported (production):', error && error.message ? error.message : error);
        }
      });
    } catch (e) {
      // fallback
      console.error('Error in GlobalErrorHandler', e);
      console.error('Original error', error);
    }

    // In development, rethrow so the error still surfaces and breaks the app for easier debugging.
    // In production do NOT rethrow to avoid crashing the whole app from unexpected runtime errors.
    if (!environment.production) {
      throw error;
    }
  }
}
