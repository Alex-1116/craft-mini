// import { useHttpRequest } from '@/shared/composables/useHttpRequest';
// const { postRequest } = useHttpRequest();

// // mini login
// export const miniLoginApi = (data: API.MiniLogin) => {
// 	return postRequest('/api/user/login', data)
// }

import httpClient from '@/services/http/client';

// mini login
export const miniLoginApi = (data: API.MiniLogin) => {
	return httpClient.post<any>('/api/user/login', data);
}
