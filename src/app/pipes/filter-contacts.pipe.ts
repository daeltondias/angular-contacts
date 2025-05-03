import { Pipe, PipeTransform } from '@angular/core';
import { ContactType } from '../types/ContactType';

@Pipe({
  name: 'filterContacts',
})
export class FilterContactsPipe implements PipeTransform {
  // prettier-ignore
  transform(items: ContactType[], filter: string, archives: boolean): ContactType[] {
    if (filter) {
      return items.filter(item => (
        (
          item.name.toLowerCase().includes(filter.toLowerCase()) ||
          item.phone.replace(/\D/g, '').includes(filter)
        )
        && item.archive === archives
      ));
    }
    return items.filter(item => item.archive === archives);
  }
}
