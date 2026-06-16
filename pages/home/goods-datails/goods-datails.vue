<template>
	<scroll-view class="detail_page" scroll-y>
		<view class="detail_hero">
			<swiper class="detail_swiper" circular indicator-dots indicator-active-color="#ffffff" indicator-color="rgba(255,255,255,0.4)">
				<swiper-item v-for="image in product.images" :key="image">
					<image class="detail_cover" :src="image" mode="aspectFill"></image>
				</swiper-item>
			</swiper>
			<view class="detail_mask"></view>
			<view class="detail_nav" :style="{ paddingTop: `${statusBarHeight + 12}px` }">
				<view class="nav_back" @click="goBack">
					<text class="iconfont icon-arrow-left"></text>
				</view>
			</view>
		</view>

		<view class="detail_panel">
			<view class="detail_tag">{{ product.category }}</view>
			<view class="detail_title">{{ product.name }}</view>
			<view class="detail_price_row">
				<text class="detail_price">¥{{ product.price }}</text>
				<text class="detail_origin">¥{{ product.originPrice }}</text>
				<text class="detail_sales">已售 {{ product.sales }}</text>
			</view>
			<view class="detail_desc">{{ product.desc }}</view>
		</view>

		<view class="detail_section">
			<view class="section_title">商品信息</view>
			<view class="info_card">
				<view class="info_item">
					<text class="label">材质</text>
					<text class="value">{{ product.material }}</text>
				</view>
				<view class="info_item">
					<text class="label">规格</text>
					<text class="value">{{ product.dimensions }}</text>
				</view>
				<view class="info_item">
					<text class="label">说明</text>
					<text class="value">当前详情页已经接入共享商品数据，并可直接跳转到结算页，后续可继续替换为真实接口内容。</text>
				</view>
			</view>
		</view>

		<view class="detail_section">
			<view class="section_title">图文详情</view>
			<view class="content_card">
				<text class="content_paragraph" v-for="(paragraph, index) in product.content" :key="index">{{ paragraph }}</text>
				<image class="content_image" :src="product.image" mode="aspectFill"></image>
			</view>
		</view>

		<view class="bottom_bar">
			<view class="bottom_meta">
				<text class="meta_label">当前选择</text>
				<text class="meta_value">单件直购，可在结算页补充收货信息</text>
			</view>
			<button class="buy_button btn-active" @click="onBuyNow">立即购买</button>
		</view>
	</scroll-view>
</template>

<script lang="ts" setup>
	import { ref } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import Api from '@/services/api';
	import { saveCheckoutDraft } from '@/shared/mock/craft';

	interface DetailProduct {
		id: string;
		name: string;
		category: string;
		images: string[];
		image: string;
		price: number;
		originPrice?: number | null;
		sales: number;
		desc: string;
		material: string;
		dimensions: string;
		content: string[];
	}

	const statusBarHeight = ref(0);
	const product = ref<DetailProduct>({
		id: '',
		name: '',
		category: '',
		images: [],
		image: '',
		price: 0,
		originPrice: null,
		sales: 0,
		desc: '',
		material: '',
		dimensions: '',
		content: []
	});

	const parseContent = (value?: string | null) => {
		if (!value) {
			return [];
		}

		return value
			.replace(/<[^>]+>/g, '\n')
			.split('\n')
			.map((item) => item.trim())
			.filter(Boolean);
	};

	const syncProductDetail = async (id: string) => {
		try {
			const res = await Api.product.getProductDetailApi(id);
			const data = res?.data;
			if (!data) {
				return;
			}

			product.value = {
				id: data.id,
				name: data.name,
				category: data.category?.name || '未分类',
				images: data.images || [],
				image: data.images?.[0] || '/static/images/logo.png',
				price: data.price,
				originPrice: data.originalPrice,
				sales: data.sales,
				desc: data.description || data.material || '东方器物精选',
				material: data.material || '以实物为准',
				dimensions: data.dimensions || '以实物为准',
				content: parseContent(data.content || data.description)
			};
		} catch (error) {
			console.error('syncProductDetail failed', error);
		}
	};

	onLoad((options) => {
		statusBarHeight.value = getApp().globalData?.statusBarHeight || 0;
		void syncProductDetail(options?.id || '');
	});

	const goBack = () => {
		uni.navigateBack();
	};

	const onBuyNow = () => {
		saveCheckoutDraft({
			productId: product.value.id,
			quantity: 1
		});
		if (!uni.getStorageSync('token')) {
			uni.navigateTo({
				url: `/pages/auth/login?redirect=${encodeURIComponent('/pages/order/checkout/checkout')}`
			});
			return;
		}
		uni.navigateTo({
			url: '/pages/order/checkout/checkout'
		});
	};
</script>

<style lang="scss">
	page {
		background: $page-bg-f8;
	}

	.detail_page {
		height: 100vh;
		background: $page-bg-f8;
		padding-bottom: calc(150rpx + env(safe-area-inset-bottom));
	}

	.detail_hero {
		position: relative;
		height: 620rpx;
	}

	.detail_swiper,
	.detail_cover,
	.detail_mask {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.detail_mask {
		background: linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.56) 100%);
	}

	.detail_nav {
		position: relative;
		z-index: 2;
		padding-left: 28rpx;
	}

	.nav_back {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 72rpx;
		height: 72rpx;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.16);
		backdrop-filter: blur(10rpx);
		color: $font-color-white;
	}

	.detail_panel {
		margin: -80rpx 28rpx 28rpx;
		position: relative;
		z-index: 3;
		padding: 34rpx 30rpx;
		border-radius: 32rpx;
		background: $block-bg-white;
		box-shadow: 0 20rpx 40rpx $shadow-color-soft;
	}

	.detail_tag {
		display: inline-flex;
		padding: 10rpx 18rpx;
		border-radius: 999rpx;
		font-size: 22rpx;
		color: $theme-color;
		background: $block-bg-accent;
	}

	.detail_title {
		margin-top: 18rpx;
		font-size: 40rpx;
		line-height: 1.45;
		font-weight: 700;
		color: $font-color-darkGrey;
	}

	.detail_price_row {
		display: flex;
		align-items: baseline;
		flex-wrap: wrap;
		gap: 14rpx;
		margin-top: 18rpx;
	}

	.detail_price {
		font-size: 42rpx;
		font-weight: 700;
		color: $theme-color;
	}

	.detail_origin {
		font-size: 24rpx;
		color: $font-color-lightGrey;
		text-decoration: line-through;
	}

	.detail_sales {
		margin-left: auto;
		font-size: 22rpx;
		color: $font-color-lightGrey;
	}

	.detail_desc {
		margin-top: 22rpx;
		font-size: 25rpx;
		line-height: 1.8;
		color: $font-color-mediumGray;
	}

	.detail_section {
		padding: 34rpx 28rpx;
	}

	.section_title {
		font-size: 32rpx;
		font-weight: 700;
		color: $font-color-darkGrey;
		margin-bottom: 18rpx;
	}

	.info_card,
	.content_card {
		padding: 28rpx;
		border-radius: 28rpx;
		background: $block-bg-white;
		box-shadow: 0 12rpx 28rpx $shadow-color-soft;
	}

	.info_item {
		display: flex;
		flex-direction: column;
		gap: 10rpx;
		padding: 18rpx 0;
		border-bottom: 1rpx solid rgba(138, 120, 80, 0.12);

		&:last-child {
			border-bottom: none;
			padding-bottom: 0;
		}
	}

	.label {
		font-size: 22rpx;
		color: $font-color-lightGrey;
	}

	.value {
		font-size: 26rpx;
		line-height: 1.7;
		color: $font-color-mediumGray;
	}

	.content_paragraph {
		display: block;
		font-size: 25rpx;
		line-height: 1.9;
		color: $font-color-mediumGray;
	}

	.content_image {
		width: 100%;
		height: 420rpx;
		margin: 24rpx 0;
		border-radius: 24rpx;
		background: $block-bg-f8;
	}

	.bottom_bar {
		position: fixed;
		left: 24rpx;
		right: 24rpx;
		bottom: calc(24rpx + env(safe-area-inset-bottom));
		display: flex;
		align-items: center;
		gap: 20rpx;
		padding: 20rpx;
		border-radius: 28rpx;
		background: rgba(255, 253, 249, 0.92);
		backdrop-filter: blur(18rpx);
		box-shadow: 0 16rpx 34rpx $shadow-color-soft;
	}

	.bottom_meta {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 8rpx;
	}

	.meta_label {
		font-size: 20rpx;
		color: $font-color-lightGrey;
	}

	.meta_value {
		font-size: 26rpx;
		color: $font-color-darkGrey;
		font-weight: 600;
	}

	.buy_button {
		width: 220rpx;
		height: 88rpx;
		line-height: 88rpx;
		border-radius: 999rpx;
		background: linear-gradient(135deg, #9b875a 0%, #75643f 100%);
		color: $font-color-white;
		font-size: 28rpx;
		font-weight: 600;
	}
</style>
