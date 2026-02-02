export class ApiError extends Error {
  constructor(statusCode, message, errors = undefined) {
    super(message);

    this.statusCode = statusCode;
    this.errors = errors;

    // Node.js specific (safe in JS)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
