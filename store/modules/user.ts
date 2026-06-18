// @ts-ignore
import { computed, ref } from 'vue';
// @ts-ignore
import { defineStore } from 'pinia';
import Api from '@/services/api';

type UserInfo = Record<string, any>;

const PERSISTED_USER_KEY = 'craft-mini:user';
const LEGACY_TOKEN_KEY = 'token';
const LEGACY_USER_INFO_KEY = 'userInfo';

const getStoredToken = (): string | null => uni.getStorageSync(LEGACY_TOKEN_KEY) || null;
const getStoredUserInfo = (): UserInfo => uni.getStorageSync(LEGACY_USER_INFO_KEY) || {};

const syncLegacyToken = (nextToken: string | null) => {
	if (nextToken) {
		uni.setStorageSync(LEGACY_TOKEN_KEY, nextToken);
		return;
	}

	uni.removeStorageSync(LEGACY_TOKEN_KEY);
};

const syncLegacyUserInfo = (nextUserInfo: UserInfo) => {
	if (Object.keys(nextUserInfo).length > 0) {
		uni.setStorageSync(LEGACY_USER_INFO_KEY, nextUserInfo);
		return;
	}

	uni.removeStorageSync(LEGACY_USER_INFO_KEY);
};

const clearLegacySession = () => {
	uni.removeStorageSync(LEGACY_TOKEN_KEY);
	uni.removeStorageSync(LEGACY_USER_INFO_KEY);
};

const clearPersistedUserStore = () => {
	uni.removeStorageSync(PERSISTED_USER_KEY);
};

export const useUserStore = defineStore(
	'user',
	() => {
	const token = ref<string | null>(getStoredToken());
	const userInfo = ref<UserInfo>(getStoredUserInfo());

	const isLoggedIn = computed(() => !!token.value);
	const getToken = computed(() => token.value);
	const getUserInfo = computed(() => userInfo.value);

	const updateToken = (nextToken: string | null) => {
		token.value = nextToken || null;
		syncLegacyToken(token.value);
	};

	const updateUserInfo = (nextUserInfo: UserInfo) => {
		userInfo.value = nextUserInfo || {};
		syncLegacyUserInfo(userInfo.value);
	};

	const logout = () => {
		token.value = null;
		userInfo.value = {};
		clearLegacySession();
		clearPersistedUserStore();
	};

	const syncFromStorage = () => {
		token.value = getStoredToken();
		userInfo.value = getStoredUserInfo();
	};

	const miniLogin = async (params: API.MiniLogin) => {
		try {
			const res = await Api.login.miniLoginApi(params);
			const result = res.data;
			if (res.code === 200) {
				updateToken(result.token);
				updateUserInfo(result.userInfo);
				return Promise.resolve(res);
			}
			return Promise.reject(res);
		} catch (error) {
			return Promise.reject(error);
		}
	};

	return {
		token,
		userInfo,
		isLoggedIn,
		getToken,
		getUserInfo,
		updateToken,
		updateUserInfo,
		logout,
		syncFromStorage,
		miniLogin
	};
	}
);
