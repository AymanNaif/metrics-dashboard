import { keepPreviousData, QueryKey, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { ApiError } from '@/lib/api/types';

type iMessageError = ApiError;
type tResponseError = ApiError;
type tResponse<T> = T | { data: T };

export interface iOptions {
  keepPreviousData?: boolean;
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean;
  enabled?: boolean;
  retry?: boolean;
  cacheEnabled?: boolean;
  staleTime?: number;
  skipNormalization?: boolean;
}

export interface iUseFetchData<T> {
  queryKey: QueryKey;
  request: () => Promise<tResponse<T>> | Promise<T>;
  options?: iOptions;
  callback?: (_data: T) => void;
  errorCallback?: (__error: iMessageError) => void;
}

const useFetchData = <T extends object>({
  queryKey,
  request,
  options,
  callback,
  errorCallback,
}: iUseFetchData<T>): UseQueryResult<T, tResponseError> => {
  const queryClient = useQueryClient();

  return useQuery<T, tResponseError>({
    queryKey,
    queryFn: async () => {
      try {
        let response: tResponse<T> | undefined;
        if (options?.cacheEnabled) {
          response = queryClient.getQueryData<T>(queryKey);
        }

        if (
          (options?.cacheEnabled && (!response || (typeof response === 'object' && Object.keys(response as object).length === 0))) ||
          !options?.cacheEnabled
        ) {
          response = await request();
        }

        if (response && typeof response === 'object' && 'data' in response && !options?.skipNormalization) {
          const data = (response as { data: T }).data;
          callback?.(data);
          return data;
        }

        callback?.(response as T);
        return response as T;
      } catch (error) {
        errorCallback?.(error as iMessageError);
        throw error;
      }
    },
    enabled: options?.enabled,
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    refetchOnMount: options?.refetchOnMount,
    retry: options?.retry ?? false,
    staleTime: options?.staleTime,
    placeholderData: options?.keepPreviousData ? keepPreviousData : undefined,
  });
};

export default useFetchData;
