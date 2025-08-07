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
