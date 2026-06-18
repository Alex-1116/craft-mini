<template>
	<view class="auth_page">
		<view class="auth_glow auth_glow-top"></view>
		<view class="auth_glow auth_glow-bottom"></view>

		<view class="auth_nav" :style="{ paddingTop: `${statusBarHeight}px` }">
			<view class="nav_back" @click="goBack">
				<text class="iconfont icon-arrow-left"></text>
			</view>
		</view>

		<view class="auth_container">
			<view class="auth_panel">
				<view class="brand_badge">
					<view class="badge_circle">
						<text class="iconfont icon-lingxing"></text>
					</view>
				</view>

				<view class="auth_header">
					<text class="auth_title">归 尘</text>
					<text class="auth_subtitle">欢迎回到八百徒 · 雅致工艺</text>
				</view>

				<view class="mode_switch">
					<view class="mode_item" :class="{ active: !usePhoneMode }" @click="setMode(false)">雅号登录</view>
					<view class="mode_item" :class="{ active: usePhoneMode }" @click="setMode(true)">手机登录</view>
				</view>

				<view class="form_block" v-if="!usePhoneMode">
					<view class="field_item">
						<text class="field_label">雅号</text>
						<input v-model="formState.username" class="field_input" placeholder="请输入您的用户名" placeholder-class="field_placeholder" />
					</view>
					<view class="field_item">
						<text class="field_label">密匙</text>
						<input v-model="formState.password" password class="field_input" placeholder="请输入密码" placeholder-class="field_placeholder" />
					</view>
				</view>

				<view class="form_block" v-else>
					<view class="field_item">
						<text class="field_label">手机号</text>
						<input v-model="formState.phone" class="field_input" type="number" maxlength="11" placeholder="请输入手机号" placeholder-class="field_placeholder" />
					</view>
					<view class="field_item">
						<text class="field_label">验证码</text>
						<view class="captcha_row">
							<input v-model="formState.captcha" class="field_input" type="number" maxlength="6" placeholder="请输入验证码" placeholder-class="field_placeholder" />
							<button class="captcha_button btn-active" :disabled="captchaDisabled" @click="getCaptcha">{{ captchaText }}</button>
						</view>
					</view>
				</view>

				<button class="submit_button btn-active" @click="submitLogin">
					{{ loading ? '登 录 中 ...' : '立 即 登 录' }}
				</button>

				<view class="agreement_text">
					<text>登录即表示同意</text>
					<text class="agreement_link" @click="showAgreement('用户服务协议')">《用户服务协议》</text>
					<text>和</text>
					<text class="agreement_link" @click="showAgreement('隐私政策')">《隐私政策》</text>
				</view>

				<view class="divider">
					<view class="divider_line"></view>
					<text class="divider_text">OTHER ENTRY</text>
					<view class="divider_line"></view>
				</view>

				<view class="quick_actions">
					<view class="quick_button" @click="quickLogin('微信登录')">
						<text class="iconfont icon-wechat-fill"></text>
					</view>
					<view class="quick_button" @click="quickLogin('QQ登录')">
						<text class="iconfont icon-qq-fill"></text>
					</view>
					<view class="quick_button" @click="quickLogin('Apple登录')">
						<text class="iconfont icon-apple-fill"></text>
					</view>
				</view>

				<view class="footer_text">
					<text>初次造访？</text>
					<text class="footer_link" @click="goRegister">结缘注册</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { computed, ref } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import Api from '@/services/api';
	import { useUserStore } from '@/store';

	const userStore = useUserStore();
	const statusBarHeight = ref(0);
	const loading = ref(false);
	const usePhoneMode = ref(false);
	const countdown = ref(0);
	const redirectUrl = ref('');
	const formState = ref({
		username: '',
		password: '',
		phone: '',
		captcha: ''
	});

	const captchaDisabled = computed(() => countdown.value > 0);
	const captchaText = computed(() => (countdown.value > 0 ? `${countdown.value}s` : '获取验证码'));

	onLoad((options) => {
		statusBarHeight.value = getApp().globalData?.statusBarHeight || 0;
		redirectUrl.value = decodeURIComponent(options?.redirect || '');
	});

	const goBack = () => {
		if (getCurrentPages().length > 1) {
			uni.navigateBack();
			return;
		}
		uni.switchTab({
			url: '/pages/tabbar/home/home'
		});
	};

	const setMode = (phoneMode: boolean) => {
		usePhoneMode.value = phoneMode;
	};

	const getCaptcha = () => {
		if (!/^1\d{10}$/.test(formState.value.phone)) {
			uni.showToast({
				icon: 'none',
				title: '请先输入正确手机号'
			});
			return;
		}

		if (countdown.value > 0) {
			return;
		}

		countdown.value = 60;
		const timer = setInterval(() => {
			countdown.value -= 1;
			if (countdown.value <= 0) {
				clearInterval(timer);
				countdown.value = 0;
			}
		}, 1000);

		uni.showToast({
			icon: 'none',
			title: '演示验证码已发送'
		});
	};

	const completeLogin = (token: string, userInfo: Record<string, any>) => {
		userStore.updateToken(token);
		userStore.updateUserInfo(userInfo);
		uni.showToast({
			icon: 'none',
			title: '登录成功'
		});
		setTimeout(() => {
			if (redirectUrl.value) {
				if (redirectUrl.value.startsWith('/pages/tabbar/')) {
					uni.switchTab({
						url: redirectUrl.value
					});
					return;
				}
				uni.redirectTo({
					url: redirectUrl.value
				});
				return;
			}
			uni.switchTab({
				url: '/pages/tabbar/mine/mine'
			});
		}, 300);
	};

	const submitLogin = async () => {
		if (loading.value) {
			return;
		}

		if (!usePhoneMode.value) {
			if (!formState.value.username || !formState.value.password) {
				uni.showToast({
					icon: 'none',
					title: '请输入雅号和密码'
				});
				return;
			}
		} else {
			if (!/^1\d{10}$/.test(formState.value.phone) || !formState.value.captcha) {
				uni.showToast({
					icon: 'none',
					title: '请输入完整手机信息'
				});
				return;
			}

			uni.showToast({
				icon: 'none',
				title: '验证码登录暂未接入，请使用雅号登录'
			});
			return;
		}

		loading.value = true;
		try {
			const res = await Api.auth.mobileLoginApi({
				username: formState.value.username.trim(),
				password: formState.value.password
			});
			const result = res?.data;
			if (!result?.accessToken || !result?.userInfo) {
				throw new Error('登录返回数据异常');
			}
			completeLogin(result.accessToken, result.userInfo);
		} finally {
			loading.value = false;
		}
	};

	const quickLogin = (name: string) => {
		uni.showToast({
			icon: 'none',
			title: `${name}后续接入`
		});
	};

	const showAgreement = (title: string) => {
		uni.showToast({
			icon: 'none',
			title
		});
	};

	const goRegister = () => {
		uni.navigateTo({
			url: `/pages/auth/register${redirectUrl.value ? `?redirect=${encodeURIComponent(redirectUrl.value)}` : ''}`
		});
	};
</script>

<style lang="scss">
	page {
		background: #15120f;
	}

	.auth_page {
		min-height: 100vh;
		position: relative;
		overflow: hidden;
		background:
			radial-gradient(circle at top right, rgba(138, 120, 80, 0.2), transparent 32%),
			radial-gradient(circle at bottom left, rgba(138, 120, 80, 0.12), transparent 34%),
			linear-gradient(180deg, #16120f 0%, #110f0c 100%);
	}

	.auth_glow {
		position: absolute;
		border-radius: 50%;
		filter: blur(90rpx);
		opacity: 0.5;
	}

	.auth_glow-top {
		width: 320rpx;
		height: 320rpx;
		top: -80rpx;
		right: -60rpx;
		background: rgba(194, 167, 112, 0.2);
	}

	.auth_glow-bottom {
		width: 360rpx;
		height: 360rpx;
		left: -120rpx;
		bottom: 120rpx;
		background: rgba(194, 167, 112, 0.12);
	}

	.auth_nav {
		position: relative;
		z-index: 2;
		padding-left: 28rpx;
	}

	.nav_back {
		width: 72rpx;
		height: 72rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.08);
		color: $font-color-white;
	}

	.auth_container {
		position: relative;
		z-index: 2;
		padding: 50rpx 32rpx calc(50rpx + env(safe-area-inset-bottom));
	}

	.auth_panel {
		padding: 44rpx 36rpx;
		border-radius: 36rpx;
		background: rgba(255, 253, 249, 0.95);
		box-shadow: 0 32rpx 60rpx rgba(0, 0, 0, 0.18);
	}

	.brand_badge {
		display: flex;
		justify-content: center;
		margin-bottom: 24rpx;
	}

	.badge_circle {
		width: 108rpx;
		height: 108rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(138, 120, 80, 0.1);
		border: 1rpx solid rgba(138, 120, 80, 0.18);
		color: $theme-color;
		font-size: 46rpx;
	}

	.auth_header {
		text-align: center;
		display: flex;
		flex-direction: column;
		gap: 14rpx;
	}

	.auth_title {
		font-size: 52rpx;
		font-weight: 700;
		letter-spacing: 10rpx;
		color: $font-color-darkGrey;
	}

	.auth_subtitle {
		font-size: 24rpx;
		color: $font-color-lightGrey;
		letter-spacing: 2rpx;
	}

	.mode_switch {
		display: flex;
		padding: 8rpx;
		margin-top: 34rpx;
		border-radius: 999rpx;
		background: #f4efe6;
	}

	.mode_item {
		flex: 1;
		height: 72rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 999rpx;
		font-size: 25rpx;
		color: $font-color-mediumGray;

		&.active {
			background: linear-gradient(135deg, #9b875a 0%, #75643f 100%);
			color: $font-color-white;
			box-shadow: 0 12rpx 22rpx rgba(138, 120, 80, 0.28);
		}
	}

	.form_block {
		margin-top: 34rpx;
		display: flex;
		flex-direction: column;
		gap: 22rpx;
	}

	.field_item {
		display: flex;
		flex-direction: column;
		gap: 12rpx;
	}

	.field_label {
		font-size: 24rpx;
		color: $font-color-mediumGray;
	}

	.field_input {
		width: 100%;
		height: 96rpx;
		padding: 0 28rpx;
		border-radius: 24rpx;
		background: #fbfaf7;
		border: 1rpx solid rgba(138, 120, 80, 0.16);
		font-size: 28rpx;
		color: $font-color-darkGrey;
	}

	.field_placeholder {
		color: #aba396;
		font-size: 26rpx;
	}

	.captcha_row {
		display: flex;
		align-items: center;
		gap: 16rpx;

		.field_input {
			flex: 1;
		}
	}

	.captcha_button {
		width: 190rpx;
		height: 96rpx;
		line-height: 96rpx;
		border-radius: 24rpx;
		font-size: 24rpx;
		color: $theme-color;
		background: #f3ebdc;
	}

	.submit_button {
		width: 100%;
		height: 96rpx;
		line-height: 96rpx;
		margin-top: 34rpx;
		border-radius: 999rpx;
		background: linear-gradient(135deg, #9b875a 0%, #75643f 100%);
		color: $font-color-white;
		font-size: 30rpx;
		font-weight: 600;
		letter-spacing: 6rpx;
		box-shadow: 0 20rpx 36rpx rgba(138, 120, 80, 0.28);
	}

	.agreement_text {
		margin-top: 24rpx;
		font-size: 22rpx;
		line-height: 1.7;
		text-align: center;
		color: $font-color-lightGrey;
	}

	.agreement_link {
		color: $theme-color;
	}

	.divider {
		display: flex;
		align-items: center;
		gap: 16rpx;
		margin-top: 34rpx;
	}

	.divider_line {
		flex: 1;
		height: 1rpx;
		background: rgba(138, 120, 80, 0.18);
	}

	.divider_text {
		font-size: 20rpx;
		letter-spacing: 4rpx;
		color: $font-color-lightGrey;
	}

	.quick_actions {
		display: flex;
		justify-content: center;
		gap: 28rpx;
		margin-top: 28rpx;
	}

	.quick_button {
		width: 92rpx;
		height: 92rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background: #f8f4ec;
		color: $font-color-darkGrey;
		font-size: 42rpx;
		box-shadow: inset 0 0 0 1rpx rgba(138, 120, 80, 0.1);
	}

	.footer_text {
		margin-top: 34rpx;
		text-align: center;
		font-size: 24rpx;
		color: $font-color-mediumGray;
	}

	.footer_link {
		margin-left: 10rpx;
		color: $theme-color;
		font-weight: 600;
	}
</style>
