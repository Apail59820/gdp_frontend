export type LazyLoadingStateType = {
  limit: number;
  offset: number;
  action: 'REPLACE' | 'APPEND';
};
