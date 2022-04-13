import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

export type GetRequest = AxiosRequestConfig | null;

interface RequestReturn<Data, Error>
  extends Pick<
    SWRResponse<AxiosResponse<Data>, AxiosError<Error>>,
    'isValidating' | 'error' | 'mutate'
  > {
  data: Data | undefined;
  response: AxiosResponse<Data> | undefined;
}

export interface Config<Data = unknown, Error = unknown>
  extends Omit<
    SWRConfiguration<AxiosResponse<Data>, AxiosError<Error>>,
    'fallbackData'
  > {
  fallbackData?: Data;
}

export default function useRequest<Data = unknown, Error = unknown>(
  request: GetRequest,
  { fallbackData, ...config }: Config<Data, Error> = {}
): RequestReturn<Data, Error> {
  const {
    data: response,
    error,
    isValidating,
    mutate,
  } = useSWR<AxiosResponse<Data>, AxiosError<Error>>(
    request && JSON.stringify(request),
    // useSWR fetch nur wenn request nicht null
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    () => axios.request<Data>(request!),
    {
      ...config,
      fallbackData: fallbackData && {
        status: 200,
        statusText: 'InitialData',
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        config: request!,
        headers: {},
        data: fallbackData,
      },
    }
  );

  // wenn session abgelaufen (sonst würde frontend das schon abfangen)
  if (error?.response?.status === 403) location.href = '/login';

  return {
    data: response && response.data,
    response,
    error,
    isValidating,
    mutate,
  };
}
