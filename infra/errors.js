export class InternalServerError extends Error {
  constructor({ statusCode, cause }) {
    super("Unexpected Error Ocurred.", {
      cause,
    });
    this.name = "InternalServerError";
    this.action = "Please, contact the support";
    this.statusCode = statusCode || 500;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class MethodNotAllowedError extends Error {
  constructor() {
    super("This method is not allowed for this endpoint");
    this.name = "MethodNotAllowedError";
    this.action = "Verify the HTTP method used";
    this.statusCode = 405;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class ServiceError extends Error {
  constructor({ message, cause }) {
    super(message || "Service temporarily unavailable.", {
      cause,
    });
    this.name = "ServiceError";
    this.action = "Please, verify if the service is available";
    this.statusCode = 503;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}
