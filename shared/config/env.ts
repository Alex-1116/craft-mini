// envConfig.ts
const envConfig = {
	dev: {
		baseUrl: process.env.UNI_PLATFORM === 'h5' ? '/test-api' : 'http://127.0.0.1:3000',
	},
	prod: {
		baseUrl: 'https://your-production-url.com',
	},
};

export default envConfig;
