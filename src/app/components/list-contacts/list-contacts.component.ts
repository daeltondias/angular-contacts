import { contactFormSchemaValidator } from '../../validators/contactForm.schema';
import { FilterContactsPipe } from '../../pipes/filter-contacts.pipe';
import { contactExists } from '../../utils/contactExists';
import { InputComponent } from '../input/input.component';
import { ContactType } from '../../types/ContactType';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import _ from 'lodash';
import {
  Input,
  Output,
  Component,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';

type FormControllerType = {
  origin: ContactType;
  data: ContactType;
  errors: Record<string, string[]>;
  submitted: boolean;
  editing: boolean;
};

type EditParamType = {
  contact: ContactType;
  updatedData: ContactType;
};

type EditType = {
  contact: ContactType;
  formController: FormControllerType;
};

@Component({
  selector: 'app-list-contacts',
  imports: [FilterContactsPipe, InputComponent, CommonModule, FormsModule],
  templateUrl: './list-contacts.component.html',
  styleUrl: './list-contacts.component.scss',
  standalone: true,
})
export class ListContactsComponent {
  @Input({ required: true }) filter!: string;
  @Input({ required: true }) archives!: boolean;
  @Input({ required: true }) contacts!: ContactType[];

  // prettier-ignore
  @Output() onEdit = new EventEmitter<EditParamType>();
  @Output() onRemove = new EventEmitter<ContactType>();
  @Output() onArchive = new EventEmitter<ContactType>();
  @Output() onUnarchive = new EventEmitter<ContactType>();

  formData: Map<string, FormControllerType> = new Map();

  validate(formController: FormControllerType) {
    const contacts = this.contacts.filter(
      (item) => item.phone !== formController.origin.phone
    );
    const shemaValidator = contactFormSchemaValidator.refine(
      ({ phone }) => !contactExists(phone, contacts),
      {
        path: ['phone'],
        message: 'Já existe um contato com este número',
      }
    );
    const result = shemaValidator.safeParse(formController.data);
    if (!result.success) {
      formController.errors = result.error.flatten().fieldErrors;
    } else {
      formController.errors = {};
    }
  }

  onInput(formController: FormControllerType) {
    if (formController.submitted) this.validate(formController);
  }

  toFornController(item: ContactType): FormControllerType {
    return {
      origin: _.cloneDeep(item),
      data: _.cloneDeep(item),
      errors: {},
      submitted: false,
      editing: false,
    };
  }

  ngOnInit() {
    this.formData = new Map(
      this.contacts.map((item) => [item.phone, this.toFornController(item)])
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['contacts']) {
      this.contacts.forEach((item) => {
        const formController = this.formData.get(item.phone);
        if (!formController || !formController.editing) {
          this.formData.set(item.phone, this.toFornController(item));
        }
      });
    }
  }

  edit({ contact, formController }: EditType) {
    const updatedData = formController.data;
    formController.submitted = true;
    this.validate(formController);
    if (Object.keys(formController.errors).length === 0) {
      this.formData.delete(contact.phone);
      this.onEdit.emit({ contact, updatedData });
    }
  }

  cancelEdit(formController: FormControllerType) {
    formController.data = _.cloneDeep(formController.origin);
    formController.editing = false;
    formController.errors = {};
  }
}
