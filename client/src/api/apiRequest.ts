import axios, { type AxiosRequestConfig, type Method } from 'axios'
import { httpClient } from '@/api/httpClient'

type ApiRequestConfig<TBody> = Omit<AxiosRequestConfig<TBody>, 'method' | 'url'> & {
  method: Method
  url: string
}

function getErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return 'Unexpected error'
  }

  const responseData = error.response?.data

  if (
    typeof responseData === 'object' &&
    responseData !== null &&
    'message' in responseData &&
    typeof responseData.message === 'string'
  ) {
    return responseData.message
  }

  return error.message
}

export async function apiRequest<TResponse, TBody = unknown>(
  config: ApiRequestConfig<TBody>,
): Promise<TResponse> {
  try {
    const { data } = await httpClient.request<TResponse, { data: TResponse }, TBody>(config)
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}
