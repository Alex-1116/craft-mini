<template>
	<view>
		<hey-headers boxShadow="none"></hey-headers>
		<view class="login-wrapper" :style="{backgroundImage:'url(https://wx3.sinaimg.cn/mw690/0065hLbaly1g24v3up9ihj30yi22oabn.jpg)'}">
			<view class="header Centered">
				<view class="header-title"> XXX-流程可视化平台</view>
				<view class="header-welcome"> Welcome！ </view>
			</view>
			<view class="content">
				
			</view>
			<view class="btn__authority">
				<button class="btn-login btn-active Centered" @tap="handleLogin">微信一键登录</button>
			</view>
		</view>
		<mini-auth v-model:open="miniauthVisible" @authorize="authorize"></mini-auth>
	</view>
</template>

<script lang="ts" setup>
	import { ref } from 'vue';
	import { useStore } from 'vuex';
	const store = useStore();
	
	const miniauthVisible = ref(false);
	const handleLogin = () => {
		miniauthVisible.value = true;
	}
	const authorize = (data: any) => {
		console.log(data);
	}
	
	// 登录
	const wxLogin = () => {
		uni.login({
			provider: 'weixin',
			success: function(loginRes) {
				console.log(loginRes);
				onLogin(loginRes.code)
			}
		});
	};
	
	const onLogin = async (code: string) => {
		try {
			uni.showLoading({
				title: "授权中...",
				mask: true
			})
			let params = {
				code: code
			}
			const res = await store.dispatch('miniLogin', params);
			if (res.code === 200) {
				setTimeout(() => {
					uni.hideLoading()
				}, 1500);
				uni.switchTab({
					url: '/pages/tabbar/home/home'
				})
			} else {
				uni.hideLoading()
				uni.showToast({
					icon: 'none',
					title: res.message
				});
			}
		} catch (error) {
			// 错误处理逻辑
			uni.hideLoading()
			console.error('登录失败', error);
		}
	}
</script>

<style lang="scss" scoped>
	page {
		height: 100%;
		display: table;
	}

	.login-wrapper {
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		background-position: center center; /* 居中背景图片 */
		background-size: cover; /* 覆盖整个div */
		background-repeat: no-repeat; /* 防止背景图片重复 */
	}

	.bg {
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		z-index: 1;
		object-fit: cover;
	}

	.header {
		width: 85%;
		margin-top: 310rpx;
		font-size: 45rpx;
		// font-weight: 600;
		color: rgba(0, 0, 0, 0.9);
		z-index: 11;
		flex-direction: column;
	}
	
	.header-title {
		font-size: 45rpx;
		color: rgba(0, 0, 0, 0.7);
		margin-top: 20rpx;
		font-weight: bold;
	}

	.header-welcome {
		font-size: 38rpx;
		color: rgba(0, 0, 0, 0.7);
		margin-top: 50rpx;
		font-weight: bold;
	}

	.content {
		width: 85%;
		height: auto;
		z-index: 11;
		text-align: center;
		font-size: 30rpx;
		color: rgba(0, 0, 0, 1);
	}

	// botton 去除边框
	button::after {
		border: none;
	}

	.btn__authority {
		width: 100%;
		height: auto;
		position: absolute;
		bottom: 300rpx;

		.btn-login {
			width: 85%;
			height: 100rpx;
			font-size: 36rpx;
			font-weight: bold;
			color: #1677ff;
			background-color: rgba(255, 255, 255, 1);
			box-shadow: 0 0 20rpx 0 rgba(248, 248, 248, 1);
			border-radius: 50rpx;
			margin: 0 auto;
		}
	}
</style>