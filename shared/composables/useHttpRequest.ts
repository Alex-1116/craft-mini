import httpClient from '@/services/http/client';

export function useHttpRequest() {
  return {
    getRequest: httpClient.get.bind(httpClient),
    postRequest: httpClient.post.bind(httpClient),
    putRequest: httpClient.put.bind(httpClient),
    deleteRequest: httpClient.delete.bind(httpClient),
  };
}
