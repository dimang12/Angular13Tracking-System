import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusColor'
})
export class StatusColorPipe implements PipeTransform {
  transform(value: number): string {
    switch (value) {
      case 1:
        return 'bg-yellow-100 text-yellow-800';
      case 2:
        return 'bg-blue-100 text-blue-800';
      case 3:
        return 'bg-green-100 text-green-800';
      case 4:
        return 'bg-red-100 text-red-800';
      case 5:
        return 'bg-purple-100 text-purple-800';
      default:
        return '';
    }
  }
} 