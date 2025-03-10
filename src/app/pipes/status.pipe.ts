import { Pipe, PipeTransform } from '@angular/core';
import { statusParams } from '../services/params/params.service';

@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {
  transform(value: number): string {
    const status = statusParams.find(status => status.value.toString() === value.toString());
    return status ? status.label : 'Unknown';
  }
}
