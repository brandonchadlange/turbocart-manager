import { NextApiRequest } from "next";

type CommonQueryParams = {
  query?: string;
  take?: number;
  skip?: number;
};

export interface IQueryHandler<T = any, R = any> {
  getParams: (request: NextApiRequest) => T;
  getQueryTotal: (params: CommonQueryParams & T) => Promise<number>;
  getQueryResponse: (params: CommonQueryParams & T) => Promise<R>;
}
