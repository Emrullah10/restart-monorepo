import { ValidationError } from '@restart/errors';

export const makeSubmitContactMessage = () => async ({ name, email, message }) => {
  if (!name || !email || !message) {
    throw new ValidationError('name, email and message are required');
  }
  // No persistence layer yet — accept and acknowledge.
  return { success: true };
};
