import { ServerError, UnauthorizedError } from "../../errors";
import { HttpResponse } from "../../protocols";

const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
});

const forbidden = (error: Error): HttpResponse => ({
  statusCode: 403,
  body: error,
});

const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError(),
});
0;
const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack as string),
});

const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data,
});

export { badRequest, forbidden, ok, serverError, unauthorized };
