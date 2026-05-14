import './md5.js';

// 条件编译，区分H5和其他小程序环境(由于vue3对模块化开发的兼容性要求比较严格)
let md5: ((...args: any[]) => any) | undefined;
const platform = process.env.UNI_PLATFORM;
console.log('platform', platform);
// 使用环境变量或编译时的条件来区分环境
if (platform === 'h5') {
  // 如果在H5环境中，假设md5被挂载到了window上
  md5 = (window as any).md5;
} else if (platform === 'mp-weixin') {
  // 对于其他环境，如微信小程序，使用require导入
  const md5Module = require('./md5.js');
  md5 = md5Module.default || md5Module; // 根据md5.js实际的导出形式调整
} else if (platform === 'app') {
	
} else {
	console.error('Unsupported platform');
}

export default md5 as ((...args: any[]) => any); // 明确导出类型