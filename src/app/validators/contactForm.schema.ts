import { z } from 'zod';

export const contactFormSchemaValidator = z.object({
  name: z.string().min(1, 'Campo obrigatório'),
  phone: z.string().min(1, 'Campo obrigatório').min(15, 'Número inválido'),
});
