<template>
	<view class="register_page">
		<view class="register_glow register_glow-top"></view>
		<view class="register_glow register_glow-bottom"></view>

		<view class="register_nav" :style="{ paddingTop: `${statusBarHeight}px` }">
			<view class="nav_back" @click="goBack">
				<text class="iconfont icon-arrow-left"></text>
			</view>
		</view>

		<view class="register_container">
			<view class="register_panel">
				<view class="register_badge">
					<view class="badge_circle">
						<text class="iconfont icon-lingxing"></text>
					</view>
				</view>

				<view class="register_header">
					<text class="register_title">结 缘</text>
					<text class="register_subtitle">加入八百徒 · 探索东方美学之境</text>
				</view>

				<view class="field_group">
					<view class="field_item">
						<text class="field_label">雅号</text>
						<input v-model="formState.username" class="field_input" placeholder="请输入用户名，至少 3 个字符" placeholder-class="field_placeholder" />
					</view>
					<view class="field_item">
						<text class="field_label">信笺</text>
						<input v-model="formState.email" class="field_input" placeholder="请输入邮箱，可选" placeholder-class="field_placeholder" />
					</view>
					<view class="field_item">
						<text class="field_label">密匙</text>
						<input v-model="formState.password" password class="field_input" placeholder="请输入密码，至少 6 位" placeholder-class="field_placeholder" />
					</view>
					<view class="field_item">
						<text class="field_label">确印</text>
						<input v-model="formState.confirmPassword" password class="field_input" placeholder="请再次输入密码" placeholder-class="field_placeholder" />
					</view>
				</view>

				<button class="submit_button btn-active" @click="submitRegister">
					{{ loading ? '结 缘 中 ...' : '立 即 结 缘' }}
				</button>

				<view class="tips_card">
					<text class="tips_title">当前阶段说明</text>
					<text class="tips_text">当前已接入网站端注册接口，完成结缘后可直接返回登录页，使用雅号与密匙登录进入小程序。</text>
				</view>

				<view class="footer_text">
					<text>已结善缘？</text>
					<text class="footer_link" @click="goLogin">归尘登录</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { ref } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import Api from '@/services/api';

	const statusBarHeight = ref(0);
	const loading = ref(false);
	const formState = ref({
		username: '',
		email: '',
		password: '',
		confirmPassword: ''
	});

	onLoad(() => {
		statusBarHeight.value = getApp().globalData?.statusBarHeight || 0;
	});

	const goBack = () => {
		uni.navigateBack();
	};

	const goLogin = () => {
		uni.redirectTo({
			url: '/pages/auth/login'
		});
	};

	const submitRegister = async () => {
		if (loading.value) {
			return;
		}

		if (formState.value.username.trim().length < 3) {
			uni.showToast({
				icon: 'none',
				title: '用户名至少 3 个字符'
			});
			return;
		}

		if (formState.value.password.length < 6) {
			uni.showToast({
				icon: 'none',
				title: '密码至少 6 位'
			});
			return;
		}

		if (formState.value.password !== formState.value.confirmPassword) {
			uni.showToast({
				icon: 'none',
				title: '两次输入的密码不一致'
			});
			return;
		}

		loading.value = true;
		try {
			await Api.auth.mobileRegisterApi({
				username: formState.value.username.trim(),
				email: formState.value.email.trim() || undefined,
				password: formState.value.password,
				confirmPassword: formState.value.confirmPassword
			});
			uni.showToast({
				icon: 'none',
				title: '注册成功，请登录'
			});
			setTimeout(() => {
				uni.redirectTo({
					url: '/pages/auth/login'
				});
			}, 400);
		} finally {
			loading.value = false;
		}
	};
</script>

<style lang="scss">
	page {
		background: #f7f4ee;
	}

	.register_page {
		min-height: 100vh;
		position: relative;
		overflow: hidden;
		background:
			radial-gradient(circle at top left, rgba(138, 120, 80, 0.15), transparent 30%),
			radial-gradient(circle at bottom right, rgba(138, 120, 80, 0.1), transparent 34%),
			linear-gradient(180deg, #f8f4ec 0%, #f2ede3 100%);
	}

	.register_glow {
		position: absolute;
		border-radius: 50%;
		filter: blur(100rpx);
	}

	.register_glow-top {
		width: 320rpx;
		height: 320rpx;
		top: -100rpx;
		left: -80rpx;
		background: rgba(138, 120, 80, 0.14);
	}

	.register_glow-bottom {
		width: 360rpx;
		height: 360rpx;
		right: -120rpx;
		bottom: 80rpx;
		background: rgba(138, 120, 80, 0.12);
	}

	.register_nav {
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
		background: rgba(255, 255, 255, 0.72);
		color: $font-color-darkGrey;
		box-shadow: 0 10rpx 24rpx $shadow-color-soft;
	}

	.register_container {
		position: relative;
		z-index: 2;
		padding: 50rpx 32rpx calc(50rpx + env(safe-area-inset-bottom));
	}

	.register_panel {
		padding: 42rpx 36rpx;
		border-radius: 36rpx;
		background: rgba(255, 255, 255, 0.82);
		box-shadow: 0 28rpx 56rpx $shadow-color-soft;
	}

	.register_badge {
		display: flex;
		justify-content: center;
		margin-bottom: 24rpx;
	}

	.badge_circle {
		width: 108rpx;
		height: 108rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background: rgba(138, 120, 80, 0.1);
		color: $theme-color;
		font-size: 46rpx;
	}

	.register_header {
		text-align: center;
		display: flex;
		flex-direction: column;
		gap: 14rpx;
	}

	.register_title {
		font-size: 52rpx;
		font-weight: 700;
		letter-spacing: 10rpx;
		color: $font-color-darkGrey;
	}

	.register_subtitle {
		font-size: 24rpx;
		color: $font-color-lightGrey;
	}

	.field_group {
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
		background: rgba(255, 255, 255, 0.92);
		border: 1rpx solid rgba(138, 120, 80, 0.16);
		font-size: 28rpx;
		color: $font-color-darkGrey;
	}

	.field_placeholder {
		color: #aba396;
		font-size: 26rpx;
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
		box-shadow: 0 18rpx 34rpx rgba(138, 120, 80, 0.24);
	}

	.tips_card {
		margin-top: 28rpx;
		padding: 24rpx;
		border-radius: 24rpx;
		background: #f5efe3;
	}

	.tips_title {
		display: block;
		font-size: 24rpx;
		font-weight: 600;
		color: $font-color-darkGrey;
		margin-bottom: 10rpx;
	}

	.tips_text {
		display: block;
		font-size: 23rpx;
		line-height: 1.8;
		color: $font-color-mediumGray;
	}

	.footer_text {
		margin-top: 30rpx;
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
