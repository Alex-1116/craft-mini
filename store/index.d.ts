type UserInfo = Record<string, any>;

interface UserStore {
	token: string | null;
	userInfo: UserInfo;
	isLoggedIn: boolean;
	getToken: string | null;
	getUserInfo: UserInfo;
	updateToken(token: string | null): void;
	updateUserInfo(userInfo: UserInfo): void;
	logout(): void;
	syncFromStorage(): void;
	miniLogin(params: Record<string, any>): Promise<any>;
}

declare module '@/store' {
	const pinia: any;
	function useUserStore(piniaInstance?: any): UserStore;

	export { pinia, useUserStore };
	export default pinia;
}
