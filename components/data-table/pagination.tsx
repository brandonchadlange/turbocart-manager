import { Pagination } from "@mantine/core";

type PaginationProps = {
  currentPage: {
    get: number;
    set: (page: number) => void;
  };
  pages: number;
};

const PaginationComponent = (props: PaginationProps) => {
  const { get, set } = props.currentPage;
  return <Pagination page={get} onChange={set} size="md" total={props.pages} />;
};

export default PaginationComponent;
