import httpClient from '@/services/http/client';

export interface ProductCategory {
	id: number;
	name: string;
	sort?: number;
}

export interface ProductItem {
	id: string;
	name: string;
	images: string[];
	price: number;
	originalPrice?: number | null;
	material?: string | null;
	dimensions?: string | null;
	stock: number;
	sales: number;
	description?: string | null;
	content?: string | null;
	categoryId: number;
	category?: ProductCategory;
	isFeatured?: boolean;
	isPublished?: boolean;
}

export interface ProductListParams {
	page?: number;
	pageSize?: number;
	categoryId?: number;
	q?: string;
	featured?: boolean;
}

export const getCategoryListApi = () => {
	return httpClient.get<any>('/api/mobile/categories');
};

export const getProductListApi = (params?: ProductListParams) => {
	return httpClient.get<any>('/api/mobile/products', params as Record<string, any>);
};

export const getProductDetailApi = (id: string) => {
	return httpClient.get<any>(`/api/mobile/products/${id}`);
};
