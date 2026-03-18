import { ServerError } from "../errors";
import { HttpResponse } from "../protocols";

const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
});

const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack as string),
});

const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data,
});

export { badRequest, ok, serverError };
