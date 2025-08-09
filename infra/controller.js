import { InternalServerError, MethodNotAllowedError } from "infra/errors";

function onNoMatchHandler(req, res) {
  const methodNotAllowedError = new MethodNotAllowedError();
  res.status(methodNotAllowedError.statusCode).json(methodNotAllowedError);
}

async function onErrorHandler(error, req, res) {
  const publicErrorObject = new InternalServerError({
    statusCode: error.statusCode,
    cause: error,
  });
  console.log(publicErrorObject);
  res.status(publicErrorObject.statusCode).json(publicErrorObject);
}

const controller = {
  errorHandlers: {
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler,
  },
};

export default controller;
