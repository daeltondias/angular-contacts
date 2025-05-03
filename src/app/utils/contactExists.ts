import { ContactType } from '../types/ContactType';

export const contactExists = (
  phoneToCheck: string,
  contacts: ContactType[]
) => {
  const t = (value: string) => value.replace(/\D/g, '');
  return contacts.some((contact) => t(contact.phone) === t(phoneToCheck));
};
