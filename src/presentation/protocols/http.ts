interface HttpResponse {
  statusCode: number;
  body: any;
}

interface HttpRequest {
  body?: any;
  headers?: any;
}

export { HttpRequest, HttpResponse };
