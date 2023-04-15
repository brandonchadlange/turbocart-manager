import { Table } from "@mantine/core";
import { ReactNode } from "react";

export type DataTableColumn<T = any> = {
  component: (data: T) => ReactNode;
  heading: string;
};

type TableComponentProps<T = any> = {
  data: T[];
  columns: DataTableColumn[];
};

const TableComponent = (props: TableComponentProps<any>) => {
  const { columns, data } = props;

  const headings = columns.map((column, columnIndex) => (
    <th key={columnIndex}>{column.heading}</th>
  ));

  const rows = data.map((row, rowIndex) => {
    const rowData = columns.map((column, columnIndex) => {
      const key = `row-${rowIndex} col-${columnIndex}`;
      return <td key={key}>{column.component(row)}</td>;
    });

    const key = `row-${rowIndex}`;
    return <tr key={key}>{rowData}</tr>;
  });

  return (
    <Table>
      <thead>
        <tr>{headings}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
};

export default TableComponent;
