// uni-app类型声明
declare const uni: UniApp.Uni;
declare const wx: any;
declare const plus: any;
declare const process: {
	env: {
		UNI_PLATFORM: string;
	};
};

interface CertProps {
	authId: string;
	cert: string;
	sign: string;
	mobileFileName: string;
}

export const useCert = () => {
	// 保存证书到手机本地文件系统
	const saveCertToLocal = async (certData: CertProps): Promise<string> => {
		// 使用uni-app提供的方法进行Base64编码
		let base64CertData: string | ArrayBuffer;
		try {
			// 转换为字符串
			const certDataStr = JSON.stringify(certData);
			// 将字符串转换为Base64
			const encoder = new TextEncoder();
			const bytes = encoder.encode(certDataStr);
			base64CertData = uni.arrayBufferToBase64(bytes.buffer);
			console.log('保存到手机本地文件系统的Base64证书数据:', base64CertData);
		} catch (e) {
			console.error('Base64编码失败:', e);
			throw new Error('证书密钥编码失败');
		}

		// 生成唯一的文件名
		const fileName = certData.mobileFileName || `cert_${certData.authId}_${Date.now()}.key`;
		// 生成文件路径
		const fs = uni.getFileSystemManager();
		let tempFilePath = '';
		const platform = process.env.UNI_PLATFORM!;

		// 根据平台设置文件路径
		if (platform === 'mp-weixin') {
			tempFilePath = `${wx.env.USER_DATA_PATH}/${fileName}`;
		} else if (platform === 'app-plus') {
			tempFilePath = `${plus.io.convertLocalFileSystemURL('_doc')}/${fileName}`;
		}

		// 写入文件
		await new Promise<void>((resolve, reject) => {
			fs.writeFile({
				filePath: tempFilePath,
				data: base64CertData,
				encoding: 'utf8',
				success: () => resolve(),
				fail: (error) => reject(error)
			});
		});

		return tempFilePath;
	};

	// 从手机本地文件系统读取证书
	const readCertFromLocal = async (fileName: string): Promise<CertProps> => {
		return new Promise((resolve, reject) => {
			// 从本地文件系统读取密钥
			const fs = uni.getFileSystemManager();
			let tempFilePath = '';

			const platform = process.env.UNI_PLATFORM!;
			if (platform === 'mp-weixin') {
				tempFilePath = `${wx.env.USER_DATA_PATH}/${fileName}`;
			} else if (platform === 'app-plus') {
				tempFilePath = `${plus.io.convertLocalFileSystemURL('_doc')}/${fileName}`;
			}

			fs.readFile({
				filePath: tempFilePath,
				encoding: 'utf8',
				success: (res) => {
					try {
						console.log('读取到的Base64证书数据:', res.data);
						// 将Base64格式的证书数据源转换回原始格式
						const arrayBuffer = uni.base64ToArrayBuffer(res.data as string);
						const decoder = new TextDecoder();
						const certDataStr = decoder.decode(arrayBuffer);
						const originalCertData = JSON.parse(certDataStr);
						resolve(originalCertData);
					} catch (error) {
						reject(new Error('证书格式转换失败'));
					}
				},
				fail: () => reject(new Error('读取证书失败'))
			});
		});
	};

	// 检查平台支持
	const checkPlatformSupport = (): boolean => {
		const platform = process.env.UNI_PLATFORM!;
		// TODO：这里需要确定一下 手机是 app 还是 app-plus
		return ['app', 'mp-weixin'].includes(platform);
	};

	return {
		saveCertToLocal,
		readCertFromLocal,
		checkPlatformSupport
	};
}