import type { NextApiRequest, NextApiResponse } from "next";
import HttpException from "./http-exception";
import { HttpStatusCode } from "axios";

export type HandlerRequest = {
  getBody<T>(): T;
  getParam(paramName: QueryParam | string): string | string[] | undefined;
  getParamOrFail(paramName: QueryParam, message: string): string | string[];
};

export type HandlerResponse = {
  send<T>(statusCode: HttpStatusCode, data: T): void;
  sendOk(value: any): void;
  sendCreated(value: any): void;
  sendNotFoundIfNull(value: any): void;
  setCachControlHeader(value: number): void;
};

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type HttpHandler = (request: NextApiRequest, response: NextApiResponse) => void;

interface RouteHandlerParams {
  GET?: HttpHandler;
  POST?: HttpHandler;
  PUT?: HttpHandler;
  DELETE?: HttpHandler;
}

export function RouteHandler(handlers: RouteHandlerParams) {
  return async (request: NextApiRequest, response: NextApiResponse) => {
    const method = request.method as HttpMethod;
    const handler = handlers[method];

    if (!handler) {
      return response.status(405).send("Method not allowed");
    }

    try {
      return await handler!(request, response);
    } catch (err) {
      const error = err as HttpException;
      response.status(error.status).send(error.response);
    }
  };
}
