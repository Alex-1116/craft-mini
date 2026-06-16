import httpClient from '@/services/http/client';

export interface MobileLoginPayload {
	username: string;
	password: string;
}

export interface MobileRegisterPayload {
	username: string;
	password: string;
	confirmPassword: string;
	email?: string;
	phone?: string;
	name?: string;
}

export const mobileLoginApi = (data: MobileLoginPayload) => {
	return httpClient.post<any>('/api/mobile/auth/login', data, {
		skipSignature: true
	});
};

export const mobileRegisterApi = (data: MobileRegisterPayload) => {
	return httpClient.post<any>('/api/mobile/auth/register', data, {
		skipSignature: true
	});
};
