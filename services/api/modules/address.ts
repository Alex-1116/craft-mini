import httpClient from '@/services/http/client';

export interface AddressPayload {
	name: string;
	phone: string;
	region: string;
	detail: string;
	isDefault?: boolean;
}

export const getAddressListApi = () => {
	return httpClient.get<any>('/api/mobile/addresses', {
		token: true
	});
};

export const getAddressDetailApi = (id: string) => {
	return httpClient.get<any>(`/api/mobile/addresses/${id}`, {
		token: true
	});
};

export const createAddressApi = (data: AddressPayload) => {
	return httpClient.post<any>('/api/mobile/addresses', data, {
		token: true
	});
};

export const updateAddressApi = (id: string, data: AddressPayload) => {
	return httpClient.put<any>(`/api/mobile/addresses/${id}`, data, {
		token: true
	});
};

export const deleteAddressApi = (id: string) => {
	return httpClient.delete<any>(`/api/mobile/addresses/${id}`, {
		token: true
	});
};

export const setDefaultAddressApi = (id: string) => {
	return httpClient.put<any>(`/api/mobile/addresses/${id}/default`, {}, {
		token: true
	});
};
