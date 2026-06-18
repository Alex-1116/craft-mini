// envConfig.ts
const envConfig = {
	dev: {
		baseUrl: process.env.UNI_PLATFORM === 'h5' ? '/test-api' : 'https://craft.tarnmind.com',
	},
	prod: {
		baseUrl: 'https://craft.tarnmind.com',
	},
};

export default envConfig;
