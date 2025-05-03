import { ListContactsComponent } from '../../components/list-contacts/list-contacts.component';
import { contactFormSchemaValidator } from '../../validators/contactForm.schema';
import { InputComponent } from '../../components/input/input.component';
import { ContactsService } from '../../services/contacts.service';
import { contactExists } from '../../utils/contactExists';
import { ContactType } from '../../types/ContactType';
import { FormsModule, NgForm } from '@angular/forms';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contacts',
  imports: [CommonModule, FormsModule, ListContactsComponent, InputComponent],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent {
  title = 'contacts';

  contactsService = inject(ContactsService);

  errors: Record<string, string[]> = {};

  contacts: ContactType[] = [];

  archives: boolean = false;

  filter: string = '';

  submitted = false;

  formData = this.formDataEmpty();

  formDataEmpty() {
    return {
      name: '',
      phone: '',
    };
  }

  validate() {
    const shemaValidator = contactFormSchemaValidator.refine(
      ({ phone }) => !contactExists(phone, this.contacts),
      {
        path: ['phone'],
        message: 'Já existe um contato com este número',
      }
    );
    const result = shemaValidator.safeParse(this.formData);
    if (!result.success) {
      this.errors = result.error.flatten().fieldErrors;
    } else {
      this.errors = {};
    }
  }

  onInput() {
    if (this.submitted) this.validate();
  }

  ngOnInit() {
    this.loadContacts();
  }

  loadContacts() {
    this.contactsService.getContacts().subscribe((contacts) => {
      this.contacts = contacts;
    });
  }

  addContact(form: NgForm) {
    this.submitted = true;
    this.validate();
    if (Object.keys(this.errors).length === 0) {
      this.contactsService.addContact({
        ...this.formData,
        archive: false,
      });
      form.resetForm(this.formDataEmpty());
    }
  }

  editContact(params: { contact: ContactType; updatedData: ContactType }) {
    this.contactsService.editContact(params.contact, params.updatedData);
  }

  removeContact(contact: ContactType) {
    this.contactsService.removeContact(contact);
  }

  archiveContact(contact: ContactType) {
    this.contactsService.toogleArchiveContact(contact);
  }
}
