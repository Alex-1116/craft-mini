import config from '@/services/http/config' // 导入私有配置
const baseUrl = config.http.url;

/**
 * @description uploadFilePromise 封装方法 根据自己的需求修改
 * @baseUrl url地址
 * @function uploadFilePromise
 * @description 上传图片
 * @param {String} url 本地路径
 * @param {File} file 二进制文件流
 * @return {void} 
 * @example 
	uni.chooseImage({
		success(res) {
			console.log(res.tempFilePaths[0]);// 图片文件本地地址
			uploadFilePromise(res.tempFilePaths[0], res.tempFiles[0]).then(res => {
				console.log('结果', res)
			})
		}
	})
 */

// 上传文件的接口返回数据的类型声明
interface UploadFileResponse {
	// 根据实际的响应数据结构定义属性
	// 例如，如果接口返回 { success: boolean, url: string }，可以这样定义：
	code: number;
	msg?: string;
	url?: string;
	success?: boolean; // 根据实际返回数据修改
}

// 定义 uploadFilePromise 函数的返回类型为 Promise<UploadFileResponse>
export async function uploadFilePromise(url: string): Promise<UploadFileResponse> {
    // 确保 url 是字符串
    url = Array.isArray(url) ? url[0] : url;

    const data = {
        returnPath: 'true'
    };

    return new Promise<UploadFileResponse>((resolve, reject) => {
        uni.uploadFile({
            url: baseUrl + '/api/ali/uploadFile', // 接口地址 baseUrl 域名地址
            type: 'POST',
            // #ifdef H5
            files: [{
                name: 'file',
                uri: url,
            }],
            // #endif
            // #ifdef MP || APP
            filePath: url,
            name: 'file',
            header: {
                'content-type': 'multipart/form-data',
                token: '' // 获取自己的 token
            },
            // #endif
            formData: data,
            success: (res) => {
                try {
                    // 根据实际的响应数据结构解析
                    const datas: UploadFileResponse = JSON.parse(res.data);
                    resolve(datas);
                } catch (error) {
                    reject(new Error('解析响应数据失败: ' + (error as Error).message));
                }
            },
            fail: (err) => {
                reject(new Error('上传文件失败: ' + err.errMsg));
            }
        });
    });
}