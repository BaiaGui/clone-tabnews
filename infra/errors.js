export class InternalServerError extends Error {
  constructor({ cause }) {
    super("Unexpected Error Ocurred.", {
      cause,
    });
    this.name = "InternalServerError";
    this.action = "Please, contact the support";
    this.statusCode = 500;
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
