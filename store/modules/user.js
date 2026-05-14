import Api from '@/services/api';

const user = {
	state: {
		token: uni.getStorageSync("token") || null,
		isLogin: !!uni.getStorageSync("token"),
		userInfo: uni.getStorageSync("userInfo") || {}
	},
	mutations: {
		updateToken(state, token) {
			state.token = token;
			state.isLogin = true;
		},

		updateUserInfo(state, userInfo) {
			state.userInfo = userInfo;
		},

		logout(state) {
			uni.removeStorageSync('token');
			uni.removeStorageSync('userInfo');
			state.token = null;
			state.isLogin = false;
			state.userInfo = {};
		}
	},
	actions: {
		async miniLogin({
			commit,
			state
		}, params) {
			try {
				const res = await Api.login.miniLoginApi(params);
				const result = res.data;
				if (res.code === 200) {
					commit('updateToken', result.token);
					commit('updateUserInfo', result.userInfo);
					uni.setStorageSync("token", result.token);
					uni.setStorageSync("userInfo", result.userInfo);
					return Promise.resolve(res);
				} else {
					return Promise.reject(res);
				}
			} catch (error) {
				return Promise.reject(error);
			}
		},
	},
	getters: {
		isLoggedIn: state => state.isLogin,
		getToken: state => state.token,
		getUserInfo: state => state.userInfo,
	}
}

export default user;