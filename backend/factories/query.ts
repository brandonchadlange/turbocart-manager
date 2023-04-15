// import { NextApiRequest } from "next";
// import ListResponse from "../models/list-response";
// import { IQueryHandler } from "../queries/query-handler";
// import { getPages, getQuerySkip } from "../utility/query";

// export type QueryKey = "listing" | "category";

// const QueryHandlerMap: Record<QueryKey, IQueryHandler> = {
//   listing: ListingQueryHandler,
//   category: CategoryQueryHandler,
// };

// const QueryFactory = async (request: NextApiRequest) => {
//   const key = request.query.key as QueryKey;
//   const queryHandler = QueryHandlerMap[key];

//   const query = request.query.query as string | undefined;
//   const take = request.query.take as string | undefined;
//   const page = request.query.page as string | undefined;

//   const parsedTake = take === undefined ? undefined : parseInt(take as string);
//   const parsedPage = page === undefined ? undefined : parseInt(page as string);

//   const skip = getQuerySkip(parsedPage, parsedTake);

//   const additionalQueryParams = queryHandler.getParams(request);

//   const totalPagesInQuery = await queryHandler.getQueryTotal({
//     query,
//     ...additionalQueryParams,
//   });

//   const response = await queryHandler.getQueryResponse({
//     query,
//     take: parsedTake,
//     skip,
//   });

//   return new ListResponse({
//     data: response,
//     pages: getPages(totalPagesInQuery, parsedTake),
//     total: totalPagesInQuery,
//   });
// };

const QueryFactory = {};

export default QueryFactory;
