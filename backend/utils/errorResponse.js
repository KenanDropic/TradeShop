export class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class BadRequestError extends ErrorResponse {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

export class UnAuthenticatedError extends BadRequestError {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

export class NotFoundError extends BadRequestError {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}
export class UnAuthorizedError extends NotFoundError {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}
