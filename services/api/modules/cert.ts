import httpClient from '@/services/http/client';

// 定义API响应数据类型
interface DataType<T = any> {
	code: number;
	message: string;
	data: T;
}

// 证书相关接口类型定义
export interface Certificate {
	id: string;
	name: string;
	key?: string;
	filePath?: string;
	isDownloaded: boolean;
}

// 获取证书列表
export const getCertificates = () => {
	return httpClient.get<DataType<Certificate[]>>('/api/certificates');
};

// 下载证书密钥
export const downloadCertificateKey = (certificateId: string) => {
	return httpClient.get<DataType<{ key: string }>>(`/api/certificates/${certificateId}/key`);
};

// 更新证书信息
export interface UpdateCertificateParams {
	id: string;
	filePath: string;
	isDownloaded: boolean;
}

export const updateCertificateInfo = (params: UpdateCertificateParams) => {
	return httpClient.put<DataType<void>>(`/api/certificates/${params.id}`, params);
};
