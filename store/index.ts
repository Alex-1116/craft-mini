// @ts-ignore
import { createPinia } from 'pinia';
// @ts-ignore
import { createPersistedState } from 'pinia-plugin-persistedstate';
import { useUserStore } from './modules/user';

const pinia = createPinia();

pinia.use(
	createPersistedState({
		storage: {
			getItem: (key: string) => {
				const value = uni.getStorageSync(key);
				return typeof value === 'string' ? value : null;
			},
			setItem: (key: string, value: string) => {
				uni.setStorageSync(key, value);
			}
		}
	})
);

export { pinia, useUserStore };
export default pinia;
