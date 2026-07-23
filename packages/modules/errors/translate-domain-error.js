import { NotFoundError, ConflictError, ValidationError, UnauthorizedError } from './domain-errors.js';

const statusByErrorClass = new Map([
  [NotFoundError, 404],
  [ConflictError, 409],
  [ValidationError, 400],
  [UnauthorizedError, 401],
]);

export const wrapWithHttpTranslation = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (error) {
    for (const [ErrorClass, status] of statusByErrorClass) {
      if (error instanceof ErrorClass) {
        return res.status(status).json({ error: error.message });
      }
    }
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
