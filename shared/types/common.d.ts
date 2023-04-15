declare type ListResponse<T> = {
  data: T[];
  total: number;
  pages: number;
};
