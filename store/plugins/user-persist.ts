const PERSISTED_USER_KEY = 'craft-mini:user';

export const registerUserPersistPlugin = (pinia: any) => {
	pinia.use(({ store }: any) => {
		if (store.$id !== 'user') {
			return;
		}

		try {
			const persistedState = uni.getStorageSync(PERSISTED_USER_KEY);
			if (persistedState && typeof persistedState === 'object') {
				store.$patch({
					token: persistedState.token || null,
					userInfo: persistedState.userInfo || {}
				});
			}
		} catch (error) {
			console.error('hydrate user store failed', error);
		}

		store.$subscribe((_mutation: any, state: any) => {
			try {
				uni.setStorageSync(PERSISTED_USER_KEY, {
					token: state.token || null,
					userInfo: state.userInfo || {}
				});
			} catch (error) {
				console.error('persist user store failed', error);
			}
		});
	});
};
