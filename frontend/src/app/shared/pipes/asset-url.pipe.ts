import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

@Pipe({
  name: 'assetUrl',
  standalone: true
})
export class AssetUrlPipe implements PipeTransform {
  transform(value?: string | null) {
    if (!value) {
      return 'assets/placeholder-plant.svg';
    }

    if (
      value.startsWith('http://') ||
      value.startsWith('https://') ||
      value.startsWith('data:') ||
      value.startsWith('assets/')
    ) {
      return value;
    }

    return `${environment.assetBaseUrl}${value}`;
  }
}
