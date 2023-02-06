export type QueryParameters = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filter?: any;
  aggregate?: any;
  groupBy?: any;
  sort?: string;
  fields?: string;
  search?: string;
  limit?: string;
  offset?: string;
  page?: string;
  deep?: string;
  meta?: string;
  export?: string;
};

export type RequestResponse<T> = {
  status: number;
  data?: T;
  message?: string;
};
