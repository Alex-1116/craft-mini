<template>
	<scroll-view class="profile_page" scroll-y>
		<view class="page_nav" :style="{ paddingTop: `${statusBarHeight + 12}px` }">
			<view class="nav_back" @click="goBack">
				<text class="iconfont icon-arrow-left"></text>
			</view>
			<view class="nav_title">个人信息</view>
		</view>

		<view class="hero_section">
			<view class="profile_card" v-if="isLoggedIn">
				<image class="avatar" :src="avatarUrl" mode="aspectFill"></image>
				<view class="profile_main">
					<view class="profile_name">{{ displayName }}</view>
					<view class="profile_meta">{{ profileText }}</view>
					<view class="profile_tags">
						<text class="profile_tag">雅致工艺</text>
						<text class="profile_tag">会员已启用</text>
					</view>
				</view>
			</view>

			<view class="empty_card" v-else>
				<view class="empty_title">尚未登录</view>
				<view class="empty_desc">登录后可查看个人资料、订单信息与联系方式。</view>
				<button class="empty_button btn-active" @click="goLogin">前往登录</button>
			</view>
		</view>

		<view class="content_section" v-if="isLoggedIn">
			<view class="section_header">
				<view class="section_caption">Profile</view>
				<view class="section_title">基础资料</view>
			</view>
			<view class="info_card">
				<view class="info_item" v-for="item in infoItems" :key="item.label">
					<text class="info_label">{{ item.label }}</text>
					<text class="info_value">{{ item.value }}</text>
				</view>
			</view>
		</view>

		<view class="content_section">
			<view class="section_header">
				<view class="section_caption">Notice</view>
				<view class="section_title">资料说明</view>
			</view>
			<view class="notice_card">
				<text class="notice_text">当前个人信息页优先承接 C 端资料展示，后续接入真实用户体系后，可继续扩展头像修改、联系方式编辑与收货偏好设置。</text>
			</view>
		</view>
	</scroll-view>
</template>

<script lang="ts" setup>
	import { computed, ref } from 'vue';
	import { useStore } from 'vuex';
	import { onLoad } from '@dcloudio/uni-app';

	const store = useStore();
	const statusBarHeight = ref(0);
	const avatarUrl = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80';

	const isLoggedIn = computed(() => store.getters.isLoggedIn);
	const userInfo = computed(() => store.getters.getUserInfo || {});
	const displayName = computed(() => userInfo.value.name || userInfo.value.username || '雅致来客');
	const profileText = computed(() => userInfo.value.email || '欢迎回到雅致工艺');
	const infoItems = computed(() => [
		{ label: '雅号', value: userInfo.value.username || displayName.value },
		{ label: '展示名称', value: userInfo.value.name || displayName.value },
		{ label: '联系邮箱', value: userInfo.value.email || '暂未设置' },
		{ label: '会员身份', value: userInfo.value.role || 'USER' }
	]);

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
			url: `/pages/auth/login?redirect=${encodeURIComponent('/pages/mine/profile/profile')}`
		});
	};
</script>

<style lang="scss">
	page {
		background: $page-bg-f8;
	}

	.profile_page {
		min-height: 100vh;
		background: linear-gradient(180deg, #17130f 0%, #17130f 300rpx, #f7f4ee 300rpx, #f7f4ee 100%);
	}

	.page_nav {
		display: flex;
		align-items: center;
		padding-left: 28rpx;
		padding-right: 28rpx;
		padding-bottom: 28rpx;
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

	.hero_section,
	.content_section {
		padding: 0 28rpx 28rpx;
	}

	.profile_card,
	.empty_card {
		padding: 30rpx;
		border-radius: 30rpx;
		background: linear-gradient(135deg, rgba(44, 34, 24, 0.96) 0%, rgba(28, 22, 17, 0.92) 100%);
		box-shadow: 0 18rpx 40rpx rgba(22, 15, 10, 0.22);
	}

	.profile_card {
		display: flex;
		align-items: center;
	}

	.avatar {
		width: 128rpx;
		height: 128rpx;
		border-radius: 50%;
		margin-right: 24rpx;
		border: 4rpx solid rgba(255, 255, 255, 0.18);
	}

	.profile_main {
		flex: 1;
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
		color: rgba(255, 255, 255, 0.8);
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
		background: rgba(255, 255, 255, 0.12);
		font-size: 20rpx;
		color: rgba(255, 255, 255, 0.88);
	}

	.empty_title {
		font-size: 34rpx;
		font-weight: 700;
		color: $font-color-white;
	}

	.empty_desc {
		margin-top: 14rpx;
		font-size: 24rpx;
		line-height: 1.8;
		color: rgba(255, 255, 255, 0.8);
	}

	.empty_button {
		width: 240rpx;
		height: 84rpx;
		line-height: 84rpx;
		margin-top: 26rpx;
		border-radius: 999rpx;
		background: linear-gradient(135deg, #9b875a 0%, #75643f 100%);
		color: $font-color-white;
		font-size: 26rpx;
		font-weight: 600;
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

	.info_card,
	.notice_card {
		border-radius: 28rpx;
		background: $block-bg-white;
		box-shadow: 0 12rpx 30rpx $shadow-color-soft;
	}

	.info_item {
		display: flex;
		justify-content: space-between;
		gap: 24rpx;
		padding: 28rpx;
		border-bottom: 1rpx solid rgba(138, 120, 80, 0.1);

		&:last-child {
			border-bottom: none;
		}
	}

	.info_label {
		font-size: 24rpx;
		color: $font-color-lightGrey;
	}

	.info_value {
		flex: 1;
		text-align: right;
		font-size: 25rpx;
		color: $font-color-darkGrey;
		font-weight: 500;
	}

	.notice_card {
		padding: 28rpx;
	}

	.notice_text {
		font-size: 24rpx;
		line-height: 1.9;
		color: $font-color-mediumGray;
	}
</style>
