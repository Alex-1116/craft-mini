<template>
	<scroll-view class="mine_page" scroll-y>
		<view class="mine_hero" :style="{ paddingTop: `${statusBarHeight}px` }">
			<view class="hero_top">
				<view>
					<view class="hero_caption">CRAFT CENTER</view>
					<view class="hero_title">我的雅集</view>
				</view>
			</view>

			<view class="profile_card" @click="handleProfileClick">
				<image class="avatar" :src="avatarUrl" mode="aspectFill"></image>
				<view class="profile_main">
					<view class="profile_name">{{ displayName }}</view>
					<view class="profile_meta">{{ isLoggedIn ? profileText : '登录后可查看订单、收藏与个人信息' }}</view>
					<view class="profile_tags">
						<text class="profile_tag">东方美学</text>
						<text class="profile_tag">精选器物</text>
						<text class="profile_tag" v-if="isLoggedIn">已登录</text>
					</view>
				</view>
				<view class="profile_arrow">
					<text class="profile_hint">{{ isLoggedIn ? '账户信息' : '点击登录' }}</text>
					<text class="iconfont icon-arrow-right"></text>
				</view>
			</view>
		</view>

		<view class="content_section">
			<view class="metrics_card">
				<view class="metric_item" v-for="item in metrics" :key="item.label">
					<text class="metric_value">{{ item.value }}</text>
					<text class="metric_label">{{ item.label }}</text>
				</view>
			</view>
		</view>

		<view class="content_section">
			<view class="section_header">
				<view class="section_caption">Orders</view>
				<view class="section_title">订单与服务</view>
			</view>
			<view class="menu_card">
				<view class="menu_item" v-for="item in orderMenus" :key="item.title" @click="handleMenu(item.requireLogin, item.action, item.redirectUrl || '')">
					<view class="menu_left">
						<view class="menu_icon" :class="item.iconClass">
							<text class="iconfont" :class="item.icon"></text>
						</view>
						<view>
							<view class="menu_title">{{ item.title }}</view>
							<view class="menu_desc">{{ item.desc }}</view>
						</view>
					</view>
					<text class="iconfont icon-arrow-right menu_arrow"></text>
				</view>
			</view>
		</view>

		<view class="content_section">
			<view class="section_header">
				<view class="section_caption">Explore</view>
				<view class="section_title">品牌与内容</view>
			</view>
			<view class="menu_card">
				<view class="menu_item" v-for="item in exploreMenus" :key="item.title" @click="item.action()">
					<view class="menu_left">
						<view class="menu_icon" :class="item.iconClass">
							<text class="iconfont" :class="item.icon"></text>
						</view>
						<view>
							<view class="menu_title">{{ item.title }}</view>
							<view class="menu_desc">{{ item.desc }}</view>
						</view>
					</view>
					<text class="iconfont icon-arrow-right menu_arrow"></text>
				</view>
			</view>
		</view>
	</scroll-view>
</template>

<script lang="ts" setup>
	import { computed, ref } from 'vue';
	import { onShow } from '@dcloudio/uni-app';
	import { listOrders } from '@/shared/mock/craft';
	import { clearSession, ensureSession, syncSessionState } from '@/shared/auth/session';
	import { useUserStore } from '@/store';

	const userStore = useUserStore();
	const statusBarHeight = ref(0);
	const orderCount = ref(0);
	const avatarUrl = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80';

	const isLoggedIn = computed(() => userStore.isLoggedIn);
	const userInfo = computed(() => userStore.userInfo || {});
	const displayName = computed(() => (isLoggedIn.value ? (userInfo.value.name || userInfo.value.username || '雅致来客') : '雅致来客'));
	const profileText = computed(() => userInfo.value.email || '欢迎回到八百徒 · 雅致工艺');
	const metrics = computed(() => [
		{ label: '收藏器物', value: isLoggedIn.value ? '12' : '--' },
		{ label: '历史订单', value: isLoggedIn.value ? `${orderCount.value}`.padStart(2, '0') : '--' },
		{ label: '品牌权益', value: isLoggedIn.value ? '已开启' : '待登录' }
	]);

	const orderMenus = [
		{
			title: '我的订单',
			desc: '查看购买记录与订单详情',
			icon: 'icon-classify-line',
			iconClass: 'gold',
			requireLogin: true,
			redirectUrl: '/pages/order/list/list',
			action: () => uni.navigateTo({ url: '/pages/order/list/list' })
		},
		{
			title: '收货与联系信息',
			desc: '管理默认地址与联系方式',
			icon: 'icon-person',
			iconClass: 'dark',
			requireLogin: true,
			redirectUrl: '/pages/mine/address/address',
			action: () => uni.navigateTo({ url: '/pages/mine/address/address' })
		},
		{
			title: '消息通知',
			desc: '承接订单更新与品牌消息',
			icon: 'icon-chat-dot-round',
			iconClass: 'light',
			requireLogin: true,
			action: () => uni.switchTab({ url: '/pages/tabbar/message/message' })
		}
	];

	const exploreMenus = [
		{
			title: '关于我们',
			desc: '查看品牌故事与东方美学定位',
			icon: 'icon-guanyuwomen',
			iconClass: 'gold-soft',
			action: () => uni.navigateTo({ url: '/pages/mine/about/about' })
		},
		{
			title: '设置',
			desc: '管理账号状态、通知提醒与缓存',
			icon: 'icon-shezhi',
			iconClass: 'dark',
			action: () => handleSetting()
		},
		{
			title: '小程序功能清单',
			desc: '查看当前已迁移与待迁移内容',
			icon: 'icon-gongneng',
			iconClass: 'dark-soft',
			action: () => uni.navigateTo({ url: '/pages/tools/function/function' })
		}
	];

	onShow(() => {
		statusBarHeight.value = getApp().globalData?.statusBarHeight || 0;
		syncSessionState();
		orderCount.value = listOrders().length;
	});

	const goLogin = (redirect = '') => {
		uni.navigateTo({
			url: `/pages/auth/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`
		});
	};

	const logout = () => {
		clearSession();
		uni.showToast({
			icon: 'none',
			title: '已退出登录'
		});
	};

	const showSoon = (title: string) => {
		uni.showToast({
			icon: 'none',
			title
		});
	};

	const handleProfileClick = () => {
		if (!isLoggedIn.value) {
			goLogin('/pages/mine/profile/profile');
			return;
		}
		if (!ensureSession('/pages/mine/profile/profile')) {
			return;
		}
		uni.navigateTo({
			url: '/pages/mine/profile/profile'
		});
	};

	const handleSetting = () => {
		if (!isLoggedIn.value) {
			goLogin('/pages/mine/settings/settings');
			return;
		}
		if (!ensureSession('/pages/mine/settings/settings')) {
			return;
		}
		uni.navigateTo({
			url: '/pages/mine/settings/settings'
		});
	};

	const handleMenu = (requireLogin: boolean, action: () => void, redirectUrl = '') => {
		if (requireLogin && !ensureSession(redirectUrl)) {
			return;
		}
		action();
	};
</script>

<style lang="scss">
	page {
		background: $page-bg-f8;
	}

	.mine_page {
		height: 100vh;
		background: linear-gradient(180deg, #17130f 0%, #17130f 320rpx, #f4efe6 380rpx, #f7f4ee 100%);
	}

	.mine_hero {
		padding: 34rpx 28rpx;
	}

	.hero_top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 30rpx;
	}

	.hero_caption {
		font-size: 20rpx;
		letter-spacing: 5rpx;
		color: rgba(255, 255, 255, 0.58);
		margin-bottom: 8rpx;
	}

	.hero_title {
		font-size: 44rpx;
		font-weight: 700;
		letter-spacing: 4rpx;
		color: $font-color-white;
	}

	.profile_card {
		position: relative;
		display: flex;
		align-items: center;
		padding: 30rpx;
		border-radius: 30rpx;
		background: linear-gradient(135deg, rgba(44, 34, 24, 0.96) 0%, rgba(28, 22, 17, 0.92) 100%);
		backdrop-filter: blur(16rpx);
		border: 1rpx solid rgba(255, 255, 255, 0.1);
		box-shadow: 0 18rpx 40rpx rgba(22, 15, 10, 0.22);
		overflow: hidden;
	}

	.profile_card::after {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		width: 220rpx;
		height: 220rpx;
		background: radial-gradient(circle, rgba(188, 162, 103, 0.22) 0%, rgba(188, 162, 103, 0) 72%);
		transform: translate(30%, -30%);
		pointer-events: none;
	}

	.avatar {
		position: relative;
		z-index: 1;
		width: 132rpx;
		height: 132rpx;
		border-radius: 50%;
		margin-right: 24rpx;
		border: 4rpx solid rgba(255, 255, 255, 0.18);
	}

	.profile_main {
		flex: 1;
		position: relative;
		z-index: 1;
	}

	.profile_arrow {
		margin-left: 18rpx;
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 10rpx;
		color: rgba(255, 255, 255, 0.78);
		font-size: 22rpx;
	}

	.profile_hint {
		font-size: 22rpx;
		color: rgba(255, 255, 255, 0.78);
	}

	.profile_name {
		font-size: 34rpx;
		font-weight: 700;
		color: $font-color-white;
	}

	.profile_meta {
		margin-top: 12rpx;
		font-size: 23rpx;
		line-height: 1.7;
		color: rgba(255, 255, 255, 0.82);
	}

	.profile_tags {
		display: flex;
		flex-wrap: wrap;
		gap: 12rpx;
		margin-top: 18rpx;
	}

	.profile_tag {
		padding: 8rpx 16rpx;
		border-radius: 999rpx;
		background: rgba(255, 255, 255, 0.14);
		font-size: 20rpx;
		color: rgba(255, 255, 255, 0.88);
	}

	.content_section {
		padding: 0 28rpx 28rpx;
	}

	.metrics_card {
		display: flex;
		padding: 18rpx 0;
		border-radius: 28rpx;
		background: $block-bg-white;
		box-shadow: 0 12rpx 30rpx $shadow-color-soft;
	}

	.metric_item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10rpx;
		padding: 18rpx 0;
	}

	.metric_value {
		font-size: 34rpx;
		font-weight: 700;
		color: $theme-color;
	}

	.metric_label {
		font-size: 22rpx;
		color: $font-color-lightGrey;
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

	.menu_left {
		display: flex;
		align-items: center;
		flex: 1;
		gap: 20rpx;
	}

	.menu_icon {
		width: 76rpx;
		height: 76rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 22rpx;
		font-size: 34rpx;

		&.gold {
			background: #f3ecde;
			color: $theme-color;
		}

		&.dark {
			background: #ede8de;
			color: #40362a;
		}

		&.light {
			background: #f6f2ea;
			color: #8f877c;
		}

		&.gold-soft {
			background: #f5efe3;
			color: #9b875a;
		}

		&.dark-soft {
			background: #efeae0;
			color: #5a5349;
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
