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

export class ValidationError extends Error {
  constructor({ message, cause, action }) {
    super(message || "An Validation Error Occurred.", {
      cause,
    });
    this.name = "ValidationError";
    this.action = action || "Verify the data sent and try again";
    this.statusCode = 400;
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

export class NotFoundError extends Error {
  constructor({ message, cause, action }) {
    super(message || "This resource was not found in the system.", {
      cause,
    });
    this.name = "NotFoundError";
    this.action = action || "Verify the parameter sent and try again";
    this.statusCode = 404;
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
