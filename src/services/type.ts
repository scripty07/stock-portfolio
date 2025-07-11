export type APIResult<T> = Promise<
  { data: T; error?: undefined } | { data?: undefined; error: Error }
>;
