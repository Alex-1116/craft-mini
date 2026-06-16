import httpClient from '@/services/http/client';

export interface OrderProduct {
	id: string;
	name: string;
	images: string[];
	price: number;
}

export interface OrderItem {
	id: string;
	status: string;
	productId: string;
	quantity: number;
	unitPrice: number;
	totalPrice: number;
	customerName: string;
	phone: string;
	address: string;
	notes?: string;
	createdAt: string;
	product: OrderProduct;
}

export interface CreateOrderPayload {
	productId: string;
	quantity: number;
	unitPrice: number;
	totalPrice: number;
	customerName: string;
	phone: string;
	address: string;
	notes?: string;
}

export const getOrderListApi = () => {
	return httpClient.get<any>('/api/mobile/orders', {
		token: true
	});
};

export const getOrderDetailApi = (id: string) => {
	return httpClient.get<any>(`/api/mobile/orders/${id}`, {
		token: true
	});
};

export const createOrderApi = (data: CreateOrderPayload) => {
	return httpClient.post<any>('/api/mobile/orders', data, {
		token: true
	});
};
