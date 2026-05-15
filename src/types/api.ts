export type ApiResponse<T> = {
  data: T;
  meta?: {
    hasNextPage?: boolean;
    [key: string]: any;
  };
};

export type ApiErrorResponse = {
  error: {
    code: string;
    message: string;
    details?: Array<{
      field: string;
      message: string;
    }>;
  };
};
