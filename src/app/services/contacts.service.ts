import { ContactType } from '../types/ContactType';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  constructor() {}

  contacts: Set<ContactType> = new Set([
    {
      name: 'João Marques',
      phone: '(63) 98187-7817',
      archive: false,
    },
    {
      name: 'Ana Cristina',
      phone: '(67) 99211-0327',
      archive: false,
    },
  ]);

  private contactsSubject = new BehaviorSubject<ContactType[]>(
    Array.from(this.contacts)
  );

  private updateContacts() {
    this.contactsSubject.next([...this.contacts]);
  }

  getContacts() {
    return this.contactsSubject.asObservable();
  }

  addContact(contact: ContactType) {
    this.contacts.add(contact);
    this.updateContacts();
  }

  editContact(contact: ContactType, updatedData: ContactType) {
    this.contacts.forEach((item) => {
      if (item.phone === contact.phone) {
        item.name = updatedData.name;
        item.phone = updatedData.phone;
      }
    });
    this.updateContacts();
  }

  removeContact(contact: ContactType) {
    this.contacts.delete(contact);
    this.updateContacts();
  }

  toogleArchiveContact(contact: ContactType) {
    this.contacts.forEach((item) => {
      if (item.phone === contact.phone) {
        item.archive = !item.archive;
      }
    });
    this.updateContacts();
  }
}
