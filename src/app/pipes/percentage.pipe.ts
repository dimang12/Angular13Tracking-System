import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'percentage'
})
export class PercentagePipe implements PipeTransform {
  transform(value: any): string {
    if (value === undefined || value === null) {
      return '';
    }
    return (value) + '%';
  }
}
