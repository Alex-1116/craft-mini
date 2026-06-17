import { pinia, useUserStore } from '@/store';

type LoginNavigateMethod = 'navigateTo' | 'redirectTo' | 'reLaunch';
declare const getCurrentPages: () => Array<{ route: string; options?: Record<string, string> }>;

const LOGIN_PATH = '/pages/auth/login';
let loginNavigationPending = false;

const buildLoginUrl = (redirect = '') => {
	return `${LOGIN_PATH}${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`;
};

const resolveCurrentPageUrl = () => {
	const pages = getCurrentPages();
	const currentPage = pages[pages.length - 1];
	if (!currentPage?.route) {
		return '';
	}

	const route = currentPage.route.startsWith('/') ? currentPage.route : `/${currentPage.route}`;
	const options = currentPage.options || {};
	const queryString = Object.keys(options)
		.map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(options[key])}`)
		.join('&');

	return queryString ? `${route}?${queryString}` : route;
};

export const getAccessToken = () => useUserStore(pinia).token || '';

export const hasAccessToken = () => !!getAccessToken();

export const clearSession = () => {
	const userStore = useUserStore(pinia);
	userStore.logout();
};

export const getCurrentPageUrl = () => resolveCurrentPageUrl();

export const syncSessionState = () => {
	const userStore = useUserStore(pinia);
	if (userStore.isLoggedIn) {
		return true;
	}

	userStore.syncFromStorage();
	if (userStore.isLoggedIn) {
		return true;
	}

	clearSession();
	return false;
};

export const openLoginPage = (redirect = '', method: LoginNavigateMethod = 'navigateTo') => {
	if (loginNavigationPending) {
		return;
	}

	const url = buildLoginUrl(redirect);
	const currentPageUrl = resolveCurrentPageUrl();
	if (currentPageUrl.startsWith(LOGIN_PATH)) {
		return;
	}

	loginNavigationPending = true;
	setTimeout(() => {
		loginNavigationPending = false;
	}, 300);

	if (method === 'redirectTo') {
		uni.redirectTo({ url });
		return;
	}

	if (method === 'reLaunch') {
		uni.reLaunch({ url });
		return;
	}

	uni.navigateTo({ url });
};

export const ensureSession = (redirect = '', method: LoginNavigateMethod = 'navigateTo') => {
	if (syncSessionState()) {
		return true;
	}

	openLoginPage(redirect, method);
	return false;
};

export const handleUnauthorized = (redirect = '', method: LoginNavigateMethod = 'redirectTo') => {
	clearSession();
	openLoginPage(redirect, method);
};
