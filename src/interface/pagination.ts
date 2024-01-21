export interface IPagination {
  result?: any;
  pageNumber?: number;
  pageSize?: number;
  offset?: number;
  total?: number;
  pages?: number;
  current?: number;
  previous?: number;
  next?: number;
}
