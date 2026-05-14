// import { useHttpRequest } from '@/shared/composables/useHttpRequest';
// const { getRequest, postRequest, putRequest, deleteRequest } = useHttpRequest();

// // getRequest
// export const testGetApi = (data?: any) => {
// 	return getRequest('/api/test/get', data)
// }

// // postRequest
// export const testPostApi = (data?: any) => {
// 	return postRequest('/api/test/post', data)
// }

// // putRequest
// export const testPutApi = (data?: any) => {
// 	return putRequest('/api/test/put', data)
// }

// // deleteRequest
// export const testDeleteApi = (data?: any) => {
// 	return deleteRequest('/api/test/delete', data)
// }



import httpClient from '@/services/http/client';

// getRequest
export const testGetApi = (data?: any) => {
	return httpClient.get<any>('/api/test/get', data);
}

// postRequest
export const testPostApi = (data?: any) => {
	return httpClient.post<any>('/api/test/post', data);
}

// putRequest
export const testPutApi = (data?: any) => {
	return httpClient.put<any>('/api/test/put', data);
}

// deleteRequest
export const testDeleteApi = (data?: any) => {
	return httpClient.delete<any>('/api/test/delete', data);
}
