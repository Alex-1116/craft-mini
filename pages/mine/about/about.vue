<template>
	<scroll-view class="about_page" scroll-y>
		<view class="page_nav" :style="{ paddingTop: `${statusBarHeight + 12}px` }">
			<view class="nav_back" @click="goBack">
				<text class="iconfont icon-arrow-left"></text>
			</view>
			<view class="nav_title">关于我们</view>
		</view>

		<view class="hero_section">
			<view class="hero_card">
				<view class="hero_caption">ABOUT CRAFT</view>
				<view class="hero_title">东方器物的当代日常</view>
				<view class="hero_desc">雅致工艺希望把东方器物从展示语境带回真实生活，以更克制的配色、材质与空间表达，延续网站端的品牌叙事与审美感受。</view>
			</view>
		</view>

		<view class="content_section">
			<view class="section_header">
				<view class="section_caption">Brand Story</view>
				<view class="section_title">品牌故事</view>
			</view>
			<view class="content_card">
				<text class="paragraph" v-for="item in storyList" :key="item">{{ item }}</text>
			</view>
		</view>

		<view class="content_section">
			<view class="section_header">
				<view class="section_caption">Value</view>
				<view class="section_title">品牌关键词</view>
			</view>
			<view class="tag_card">
				<text class="tag_item" v-for="item in tags" :key="item">{{ item }}</text>
			</view>
		</view>

		<view class="content_section">
			<view class="section_header">
				<view class="section_caption">Contact</view>
				<view class="section_title">联络方式</view>
			</view>
			<view class="info_card">
				<view class="info_item" v-for="item in contactList" :key="item.label">
					<text class="info_label">{{ item.label }}</text>
					<text class="info_value">{{ item.value }}</text>
				</view>
			</view>
		</view>
	</scroll-view>
</template>

<script lang="ts" setup>
	import { ref } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';

	const statusBarHeight = ref(0);
	const tags = ['东方美学', '日常器物', '留白陈设', '黑金米白', '手作质感'];
	const storyList = [
		'雅致工艺从器物、茶席、香席与陈设出发，希望在移动端延续网站端所传达的品牌情绪：克制、温润、留白。',
		'我们不把器物看作孤立的商品，而是看作日常空间的一部分。每一件茶器、花器与陈设，都应当在真实生活里获得恰当的位置。',
		'当前小程序版本优先承接 C 端浏览、下单与用户中心能力，后续会继续补充更完整的品牌内容与图文叙事。'
	];
	const contactList = [
		{ label: '品牌名称', value: '雅致工艺 CRAFT MINI' },
		{ label: '品牌邮箱', value: 'hello@craft.local' },
		{ label: '品牌定位', value: '东方器物与审美生活方式' }
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
</script>

<style lang="scss">
	page {
		background: $page-bg-f8;
	}

	.about_page {
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

	.hero_section,
	.content_section {
		padding: 28rpx;
	}

	.hero_card {
		padding: 34rpx 30rpx;
		border-radius: 30rpx;
		background: linear-gradient(180deg, #1d1914 0%, #292219 100%);
		box-shadow: 0 22rpx 40rpx rgba(22, 15, 10, 0.22);
	}

	.hero_caption {
		font-size: 20rpx;
		letter-spacing: 5rpx;
		color: rgba(255, 255, 255, 0.6);
	}

	.hero_title {
		margin-top: 12rpx;
		font-size: 42rpx;
		line-height: 1.4;
		font-weight: 700;
		color: $font-color-white;
	}

	.hero_desc {
		margin-top: 18rpx;
		font-size: 25rpx;
		line-height: 1.9;
		color: rgba(255, 255, 255, 0.8);
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

	.content_card,
	.tag_card,
	.info_card {
		border-radius: 28rpx;
		background: $block-bg-white;
		box-shadow: 0 12rpx 30rpx $shadow-color-soft;
	}

	.content_card {
		padding: 28rpx;
	}

	.paragraph {
		display: block;
		margin-bottom: 18rpx;
		font-size: 24rpx;
		line-height: 1.95;
		color: $font-color-mediumGray;

		&:last-child {
			margin-bottom: 0;
		}
	}

	.tag_card {
		display: flex;
		flex-wrap: wrap;
		gap: 16rpx;
		padding: 28rpx;
	}

	.tag_item {
		padding: 12rpx 20rpx;
		border-radius: 999rpx;
		background: $block-bg-accent;
		font-size: 22rpx;
		color: $theme-color;
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
</style>
