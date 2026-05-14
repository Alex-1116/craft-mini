import envConfig from '@/shared/config/env';
import md5 from '@/services/crypto/md5-service';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type RequestParams = Record<string, string | number | boolean | null | undefined>;

interface RequestConfig {
	params?: RequestParams;
	data?: any;
	timeout?: number;
	header?: Record<string, string>;
	method?: string;
	token?: boolean;
	skipSignature?: boolean;
}

interface ResponseError extends Error {
	status?: number;
	data?: any;
}

const REQUEST_SIGNATURE_SALT = 'YUIOJGHBnstw56VHK0K';
const CONFIG_KEYS = ['params', 'data', 'timeout', 'header', 'method', 'token', 'skipSignature'];

const resolveBaseUrl = () => {
	const isDev = process.env.NODE_ENV === 'development';
	return envConfig[isDev ? 'dev' : 'prod'].baseUrl;
};

const isRequestConfig = (value?: RequestParams | RequestConfig): value is RequestConfig => {
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		return false;
	}

	return CONFIG_KEYS.some((key) => key in value);
};

const normalizeParams = (params?: RequestParams) => {
	if (!params) {
		return undefined;
	}

	return Object.keys(params).reduce<Record<string, string>>((acc, key) => {
		const value = params[key];
		if (value !== undefined && value !== null) {
			acc[key] = String(value);
		}
		return acc;
	}, {});
};

const buildQueryString = (params?: RequestParams) => {
	const normalizedParams = normalizeParams(params);
	if (!normalizedParams || Object.keys(normalizedParams).length === 0) {
		return '';
	}

	return new URLSearchParams(normalizedParams).toString();
};

const buildSignature = (payload?: any, skipSignature?: boolean) => {
	if (skipSignature || process.env.UNI_PLATFORM === 'app' || typeof md5 !== 'function') {
		return '';
	}

	if (!payload) {
		return md5(`${REQUEST_SIGNATURE_SALT}`);
	}

	return md5(`${md5(JSON.stringify(payload))}${REQUEST_SIGNATURE_SALT}`);
};

const resolveErrorMessage = (error: any) => {
	return error?.data?.message || error?.data?.msg || error?.message || error?.errMsg || '网络异常，请稍后重试';
};

const showErrorToast = (message: string) => {
	uni.showToast({
		icon: 'none',
		title: message,
		duration: 2000
	});
};

class HttpClient {
	private baseURL: string;
	private defaultConfig: RequestConfig;

	constructor(baseURL: string = '', defaultConfig: RequestConfig = {}) {
		this.baseURL = baseURL;
		this.defaultConfig = defaultConfig;
	}

	private async request<T>(method: RequestMethod, url: string, config: RequestConfig = {}): Promise<T> {
		try {
			const { params, data, timeout = 10000, token = false, skipSignature = false, ...restConfig } = config;
			const queryString = buildQueryString(params);
			const fullURL = `${this.baseURL}${url}${queryString ? `?${queryString}` : ''}`;
			const requestPayload = method === 'GET' || method === 'DELETE' ? params : data;
			const signature = buildSignature(requestPayload, skipSignature);
			const accessToken = token ? uni.getStorageSync('token') : '';

			const finalConfig = {
				...this.defaultConfig,
				...restConfig,
				method,
				timeout,
				data,
				header: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					...(signature ? { signature } : {}),
					...(accessToken ? { Authorization: accessToken } : {}),
					...this.defaultConfig.header,
					...restConfig.header
				}
			};

			const response = await new Promise<any>((resolve, reject) => {
				uni.request({
					url: fullURL,
					...finalConfig,
					success: (res: any) => resolve(res),
					fail: (err: any) => reject(err)
				});
			});

			if (response.statusCode >= 400) {
				const error: ResponseError = new Error(resolveErrorMessage(response));
				error.status = response.statusCode;
				error.data = response.data;
				throw error;
			}

			return response.data as T;
		} catch (error) {
			const message = resolveErrorMessage(error);
			showErrorToast(message);

			if (error instanceof Error) {
				throw error;
			}

			throw new Error(message);
		}
	}

	async get<T>(url: string, params?: RequestParams, config?: RequestConfig): Promise<T>;
	async get<T>(url: string, config?: RequestConfig): Promise<T>;
	async get<T>(url: string, paramsOrConfig?: RequestParams | RequestConfig, config?: RequestConfig): Promise<T> {
		const finalConfig = isRequestConfig(paramsOrConfig) ? paramsOrConfig : { ...config, params: paramsOrConfig };
		return this.request<T>('GET', url, finalConfig);
	}

	async post<T>(url: string, data?: any, config?: RequestConfig): Promise<T> {
		return this.request<T>('POST', url, { ...config, data });
	}

	async put<T>(url: string, data?: any, config?: RequestConfig): Promise<T> {
		return this.request<T>('PUT', url, { ...config, data });
	}

	async delete<T>(url: string, params?: RequestParams, config?: RequestConfig): Promise<T>;
	async delete<T>(url: string, config?: RequestConfig): Promise<T>;
	async delete<T>(url: string, paramsOrConfig?: RequestParams | RequestConfig, config?: RequestConfig): Promise<T> {
		const finalConfig = isRequestConfig(paramsOrConfig) ? paramsOrConfig : { ...config, params: paramsOrConfig };
		return this.request<T>('DELETE', url, finalConfig);
	}
}

const defaultConfig: RequestConfig = {
	header: {
		'Accept': 'application/json'
	},
	timeout: 10000
};

const httpClient = new HttpClient(resolveBaseUrl(), defaultConfig);

export default httpClient;
