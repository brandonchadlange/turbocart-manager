import useDebounce from "@/frontend/utils/use-debounce";
import axios from "axios";
import { cloneElement, ReactElement, useState } from "react";
import { useQuery, useQueryClient } from "react-query";

import { Flex, Space } from "@mantine/core";
import Pagination from "./pagination";
import Query from "./query";
import Pages from "./pages";
import Table, { type DataTableColumn } from "./table";

type DataTableProps<T = any> = {
  queryId: string;
  baseUrl: string;
  columns: DataTableColumn<T>[];
};

const DataTable = (props: DataTableProps<any>) => {
  const { data, query, currentPage, totalPages, itemsPerPage } =
    useDataTable(props);

  return (
    <>
      <Query query={query} />
      <Table columns={props.columns} data={data!} />
      <Space h={40} />
      <Flex justify="space-between">
        <Pagination currentPage={currentPage} pages={totalPages.get} />
        <Pages itemsPerPage={itemsPerPage} />
      </Flex>
    </>
  );
};

export default DataTable;
export { type DataTableColumn };

export function useDataTable<T>(props: DataTableProps<T>) {
  const queryClient = useQueryClient();

  const [query, setQuery] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState("10");

  const debounceQuery = useDebounce(query, 250);

  const fetchData = async () => {
    const url = new URL(props.baseUrl);

    if (debounceQuery) url.searchParams.append("query", debounceQuery);
    url.searchParams.append("take", itemsPerPage);
    url.searchParams.append("page", currentPage.toString());

    const response = await axios.get<ListResponse<T>>(url.toString());

    setTotalPages(response.data.pages);

    return response.data;
  };

  const request = useQuery(
    [props.queryId, { debounceQuery, itemsPerPage, currentPage }],
    fetchData,
    { initialData: { data: [], pages: totalPages, total: totalPages } }
  );

  const handleSetQuery = (value: string) => {
    setCurrentPage(1);
    setQuery(value);
  };

  const handleSetItemsPerPage = (value: string) => {
    setCurrentPage(1);
    setItemsPerPage(value);
  };

  return {
    query: {
      get: query,
      set: handleSetQuery,
    },
    totalPages: {
      get: totalPages,
      set: setTotalPages,
    },
    currentPage: {
      get: currentPage,
      set: setCurrentPage,
    },
    itemsPerPage: {
      get: itemsPerPage,
      set: handleSetItemsPerPage,
    },
    data: request.data?.data,
    refresh() {
      queryClient.invalidateQueries(props.queryId);
    },
  };
}
