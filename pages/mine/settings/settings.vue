<template>
	<scroll-view class="settings_page" scroll-y>
		<view class="page_nav" :style="{ paddingTop: `${statusBarHeight + 12}px` }">
			<view class="nav_back" @click="goBack">
				<text class="iconfont icon-arrow-left"></text>
			</view>
			<view class="nav_title">设置</view>
		</view>

		<view class="content_section">
			<view class="section_header">
				<view class="section_caption">Account</view>
				<view class="section_title">账户状态</view>
			</view>
			<view class="hero_card">
				<view class="account_name">{{ isLoggedIn ? displayName : '未登录' }}</view>
				<view class="account_desc">{{ isLoggedIn ? profileText : '登录后可管理个人信息、地址与订单通知设置' }}</view>
				<button v-if="!isLoggedIn" class="primary_button btn-active" @click="goLogin">前往登录</button>
			</view>
		</view>

		<view class="content_section">
			<view class="section_header">
				<view class="section_caption">Preference</view>
				<view class="section_title">偏好设置</view>
			</view>
			<view class="menu_card">
				<view class="menu_item" v-for="item in settingsMenus" :key="item.title" @click="item.action()">
					<view>
						<view class="menu_title">{{ item.title }}</view>
						<view class="menu_desc">{{ item.desc }}</view>
					</view>
					<text class="iconfont icon-arrow-right menu_arrow"></text>
				</view>
			</view>
		</view>

		<view class="content_section" v-if="isLoggedIn">
			<button class="logout_button btn-active" @click="logout">退出登录</button>
		</view>
	</scroll-view>
</template>

<script lang="ts" setup>
	import { computed, ref } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import { useUserStore } from '@/store';

	const userStore = useUserStore();
	const statusBarHeight = ref(0);
	const isLoggedIn = computed(() => userStore.isLoggedIn);
	const userInfo = computed(() => userStore.userInfo || {});
	const displayName = computed(() => userInfo.value.name || userInfo.value.username || '雅致来客');
	const profileText = computed(() => userInfo.value.email || '欢迎回到雅致工艺');

	const settingsMenus = [
		{
			title: '通知提醒',
			desc: '订单状态、品牌消息与活动提醒',
			action: () => showSoon('通知设置后续接入')
		},
		{
			title: '清理缓存',
			desc: '用于释放本地草稿与临时记录',
			action: () => {
				uni.removeStorageSync('craft_checkout_draft');
				uni.showToast({
					icon: 'none',
					title: '已清理本地草稿'
				});
			}
		},
		{
			title: '版本信息',
			desc: 'CRAFT MINI 当前视觉迁移版本',
			action: () => showSoon('当前版本 v0.1.0')
		}
	];

	onLoad(() => {
		statusBarHeight.value = getApp().globalData?.statusBarHeight || 0;
	});

	const goBack = () => {
		if (getCurrentPages().length > 1) {
			uni.navigateBack();
			return;
		}
		uni.switchTab({ url: '/pages/tabbar/mine/mine' });
	};

	const goLogin = () => {
		uni.navigateTo({
			url: `/pages/auth/login?redirect=${encodeURIComponent('/pages/mine/settings/settings')}`
		});
	};

	const logout = () => {
		userStore.logout();
		uni.showToast({
			icon: 'none',
			title: '已退出登录'
		});
		setTimeout(() => {
			uni.switchTab({ url: '/pages/tabbar/mine/mine' });
		}, 250);
	};

	const showSoon = (title: string) => {
		uni.showToast({
			icon: 'none',
			title
		});
	};
</script>

<style lang="scss">
	page {
		background: $page-bg-f8;
	}

	.settings_page {
		min-height: 100vh;
		background: $page-bg-f8;
	}

	.page_nav {
		display: flex;
		align-items: center;
		padding-left: 28rpx;
		padding-right: 28rpx;
		padding-bottom: 28rpx;
		background: linear-gradient(180deg, #17130f 0%, #17130f 100%);
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

	.nav_title {
		margin-left: 18rpx;
		font-size: 34rpx;
		font-weight: 700;
		color: $font-color-white;
	}

	.content_section {
		padding: 28rpx;
	}

	.section_header {
		margin-bottom: 18rpx;
	}

	.section_caption {
		font-size: 20rpx;
		letter-spacing: 4rpx;
		color: $font-color-lightGrey;
		margin-bottom: 8rpx;
	}

	.section_title {
		font-size: 34rpx;
		font-weight: 700;
		color: $font-color-darkGrey;
	}

	.hero_card {
		padding: 30rpx;
		border-radius: 30rpx;
		background: linear-gradient(135deg, rgba(44, 34, 24, 0.96) 0%, rgba(28, 22, 17, 0.92) 100%);
		box-shadow: 0 18rpx 40rpx rgba(22, 15, 10, 0.22);
	}

	.account_name {
		font-size: 36rpx;
		font-weight: 700;
		color: $font-color-white;
	}

	.account_desc {
		margin-top: 14rpx;
		font-size: 24rpx;
		line-height: 1.8;
		color: rgba(255, 255, 255, 0.82);
	}

	.primary_button,
	.logout_button {
		height: 84rpx;
		line-height: 84rpx;
		border-radius: 999rpx;
		font-size: 26rpx;
		font-weight: 600;
		color: $font-color-white;
		background: linear-gradient(135deg, #9b875a 0%, #75643f 100%);
	}

	.primary_button {
		width: 220rpx;
		margin-top: 24rpx;
	}

	.menu_card {
		border-radius: 28rpx;
		background: $block-bg-white;
		box-shadow: 0 12rpx 30rpx $shadow-color-soft;
		overflow: hidden;
	}

	.menu_item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 28rpx;
		border-bottom: 1rpx solid rgba(138, 120, 80, 0.1);

		&:last-child {
			border-bottom: none;
		}
	}

	.menu_title {
		font-size: 28rpx;
		font-weight: 600;
		color: $font-color-darkGrey;
	}

	.menu_desc {
		margin-top: 8rpx;
		font-size: 22rpx;
		line-height: 1.6;
		color: $font-color-lightGrey;
	}

	.menu_arrow {
		font-size: 24rpx;
		color: $font-color-lightGrey;
	}
</style>
