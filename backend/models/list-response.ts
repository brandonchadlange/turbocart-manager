type ListResponseProps<T> = {
  data: T[];
  total: number;
  pages?: number;
};

class ListResponse<T> {
  data: T[];
  total: number;
  pages?: number;

  constructor(props: ListResponseProps<T>) {
    this.data = props.data;
    this.total = props.total;
    this.pages = props.pages;
  }
}

export default ListResponse;
