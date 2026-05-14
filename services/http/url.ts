import config from '@/services/http/config'; // 导入私有配置
const baseURL = config.http.url;
const center = '/banshuwork/icon/';

/**
 * 格式化图片路径，确保它们正确地以前缀baseURL开头。
 * @param {string} value - 要格式化的图片路径。
 * @returns {string} - 格式化后的图片URL，如果输入无效则返回空字符串。
 */
export const formatImgPath = (value: string): string => {
  if (!value) {
    return ''; // 对于null、undefined或空字符串，提前返回
  }
  // 如果值是以http或https开头的绝对URL，直接返回
  if (value.startsWith('https:') || value.startsWith('http:')) {
    return value;
  }
  // 移除value开头的斜杠，以避免在最终URL中出现双斜杠
  const cleanedValue = value.replace(/^\//, '');

  return `${baseURL}/${cleanedValue}`;
};

/**
 * 将对象添加当作参数拼接到URL上面
 * @param baseUrl 需要拼接的url
 * @param obj 参数对象
 * @returns {string} 拼接后的对象
 * 例子:
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export function setObjToUrlParams<T>(baseUrl: string, obj: { [P in keyof T]: any }): string {
  let parameters = '';
  let url = '';
  for (const key in obj) {
    parameters += `${key}=${encodeURIComponent(obj[key])}&`;
  }
  parameters = parameters.replace(/&$/, '');
  if (/\?$/.test(baseUrl)) {
    url = baseUrl + parameters;
  } else {
    url = baseUrl.replace(/\/?$/, '?') + parameters;
  }
  return url;
}

/**
 * 将路径中重复的正斜杆替换成单个斜杆隔开的字符串
 * @param path 要处理的路径
 * @returns {string} 将/去重后的结果
 */
export const uniqueSlash = (path: string): string => path.replace(/(https?:\/)|(\/)+/g, '$1$2');
// Safari 不支持以下正则(反向否定查找) shit!
// export const uniqueSlash = (path: string) => path.replace(/(?<!:)\/{2,}/g, '/');

/**
 * 检测给定的字符串是否是一个绝对 URL。绝对 URL 是指包含协议（如 http:// 或 https://）以及主机名（如 www.example.com）的完整 URL 地址
 */
export const isAbsoluteURL = (url: string) => {
	return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

export const combineURLs = (url: string) => {
	return baseURL + url
}

export const isEmpty = (obj) => {
	if (typeof obj == "undefined" || obj == null || obj == "") {
		return true;
	} else {
		return false;
	}
}
