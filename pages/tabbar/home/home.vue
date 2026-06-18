<template>
	<scroll-view class="home_container" scroll-y>
		<view class="home_header" :style="{ paddingTop: `${statusBarHeight}px` }">
			<view class="brand_row" :style="brandRowStyle">
				<view class="brand_copy">
					<view class="brand_subtitle">CRAFT MINI</view>
					<view class="brand_title">雅致工艺</view>
				</view>
				<image class="brand_logo" src="/static/images/mini-logo.png" mode="aspectFill"></image>
			</view>
			<view class="search_box" @click="onSearch">
				<view class="iconfont icon-search search_icon"></view>
				<text class="search_text">搜索雅器、茶器、香器与陈设</text>
			</view>
			<view class="hero_copy">
				<text class="hero_copy-title">以器载道，重构东方审美的日常陈列</text>
				<text class="hero_copy-desc">延续网站端的黑金米白主题，在小程序中优先呈现精选商品、分类与沉浸式卡片布局。</text>
			</view>
		</view>

		<view class="section category_section">
			<view class="category_panel">
				<view class="category_panel-header">
					<view>
						<view class="category_panel-caption">Category</view>
						<view class="category_panel-title">器物分类</view>
					</view>
				</view>
				<scroll-view class="category_scroll" scroll-x show-scrollbar="false">
					<view class="category_list">
						<view
							v-for="item in categories"
							:key="item.name"
							class="category_chip"
							:class="{ active: currentCategory === item.name }"
							@click="switchCategory(item.name)"
						>
							<view class="category_icon-wrap">
								<image class="category_icon" :src="item.icon" mode="aspectFit"></image>
							</view>
							<text class="category_name">{{ item.name }}</text>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>

		<view class="section">
			<view class="section_header">
				<view>
					<view class="section_caption">Featured</view>
					<view class="section_title">好物精选</view>
				</view>
				<view class="section_line"></view>
			</view>

			<swiper class="feature_swiper" circular autoplay interval="4000" duration="500">
				<swiper-item v-for="item in heroBanners" :key="item.id">
					<view class="feature_card" @click="openDetail(item)">
						<image class="feature_image" :src="item.image" mode="aspectFill"></image>
						<view class="feature_mask"></view>
						<view class="feature_content">
							<text class="feature_tag">{{ item.tag }}</text>
							<text class="feature_title">{{ item.title }}</text>
							<text class="feature_desc two-line-ellipsis">{{ item.desc }}</text>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>

		<view class="section">
			<view class="section_header">
				<view>
					<view class="section_caption">Collection</view>
					<view class="section_title">{{ currentCategory }}</view>
				</view>
				<view class="section_more" @click="showMore">查看全部</view>
			</view>

			<view class="product_grid">
				<view class="product_card" v-for="item in filteredProducts" :key="item.id" @click="openDetail(item)">
					<image class="product_image" :src="item.image" mode="aspectFill"></image>
					<view class="product_body">
						<view class="product_name two-line-ellipsis">{{ item.name }}</view>
						<view class="product_desc two-line-ellipsis">{{ item.desc }}</view>
						<view class="product_footer">
							<view>
								<text class="product_price">¥{{ item.price }}</text>
								<text class="product_origin" v-if="item.originPrice">¥{{ item.originPrice }}</text>
							</view>
							<text class="product_sales">已售 {{ item.sales }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="section story_section">
			<view class="section_header">
				<view>
					<view class="section_caption">Brand Story</view>
					<view class="section_title">东方器物的日常表达</view>
				</view>
				<view class="section_line"></view>
			</view>
			<view class="story_card">
				<view class="story_text">网站端的品牌调性以留白、黑金色和偏东方的排版为核心。小程序第一阶段先同步这些视觉 token，再逐步迁移商品详情、订单与登录流程。</view>
				<view class="story_tags">
					<text class="story_tag">黑金配色</text>
					<text class="story_tag">卡片留白</text>
					<text class="story_tag">移动端重构</text>
				</view>
			</view>
		</view>
	</scroll-view>
</template>

<script lang="ts" setup>
	import { computed, ref } from 'vue';
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import Api from '@/services/api';
	import type { ProductItem } from '@/services/api/modules/product';

	interface CategoryItem {
		id?: number;
		name: string;
		icon: string;
	}

	interface HomeProductItem {
		id: string;
		name: string;
		category: string;
		image: string;
		desc: string;
		price: number;
		originPrice?: number | null;
		sales: number;
	}

	const statusBarHeight = ref<number>(0);
	const navigateHeight = ref<number>(44);
	const capsuleWidth = ref<number>(92);
	const capsuleHeight = ref<number>(32);
	const capsuleMarginTop = ref<number>(6);
	const currentCategory = ref('全部');

	const categories = ref<CategoryItem[]>([
		{ name: '全部', icon: '/static/images/category/icon-mairu.png' },
		{ name: '茶器', icon: '/static/images/category/icon-jianzhi.png' },
		{ name: '香器', icon: '/static/images/category/icon-shiwu.png' },
		{ name: '花器', icon: '/static/images/category/icon-hezuo.png' },
		{ name: '陈设', icon: '/static/images/category/icon-jiaoliu.png' }
	]);

	const heroBanners = ref([
		{
			id: 'hero-1',
			title: '器物之美，藏于日用',
			tag: '东方雅集',
			desc: '以更克制的色彩与留白，让首页首屏先承接网站端的品牌气质。',
			image: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=1200&q=80'
		},
		{
			id: 'hero-2',
			title: '茶席与陈设的层次感',
			tag: '本周主推',
			desc: '焦点横幅采用沉浸式大图与渐层遮罩，模拟网站端 Hero Carousel 的观感。',
			image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80'
		},
		{
			id: 'hero-3',
			title: '温润材质，留住手作感',
			tag: '匠心推荐',
			desc: '在小程序里保留黑金米白的视觉基调，同时降低复杂动效，提升触控体验。',
			image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80'
		}
	]);

	const products = ref<HomeProductItem[]>([]);

	const categoryIconMap: Record<string, string> = {
		手串: '/static/images/category/icon-maichu.png',
		茶具: '/static/images/category/icon-jianzhi.png',
		茶器: '/static/images/category/icon-jianzhi.png',
		香道: '/static/images/category/icon-shiwu.png',
		香器: '/static/images/category/icon-shiwu.png',
		摆件: '/static/images/category/icon-jiaoliu.png',
		陈设: '/static/images/category/icon-jiaoliu.png',
		装饰画: '/static/images/category/icon-hezuo.png',
		花器: '/static/images/category/icon-hezuo.png'
	};

	const filteredProducts = computed(() => {
		if (currentCategory.value === '全部') {
			return products.value;
		}
		return products.value.filter((item) => item.category === currentCategory.value);
	});

	const mapProduct = (item: ProductItem): HomeProductItem => ({
		id: item.id,
		name: item.name,
		category: item.category?.name || '全部',
		image: item.images?.[0] || '/static/images/logo.png',
		desc: item.description || item.material || '东方器物精选',
		price: item.price,
		originPrice: item.originalPrice,
		sales: item.sales
	});

	const syncHomeData = async () => {
		try {
			const [categoryRes, featuredRes, productRes] = await Promise.all([
				Api.product.getCategoryListApi(),
				Api.product.getProductListApi({ page: 1, pageSize: 6, featured: true }),
				Api.product.getProductListApi({ page: 1, pageSize: 12 })
			]);

			const remoteCategories = (categoryRes?.data || []).map((item: any) => ({
				id: item.id,
				name: item.name,
				icon: categoryIconMap[item.name] || '/static/images/category/icon-watermark.png'
			}));
			categories.value = [
				{ name: '全部', icon: '/static/images/category/icon-mairu.png' },
				...remoteCategories
			];

			const featuredList = (featuredRes?.data?.list || []).map((item: ProductItem) => mapProduct(item));
			const productList = (productRes?.data?.list || []).map((item: ProductItem) => mapProduct(item));
			if (featuredList.length) {
				heroBanners.value = featuredList.slice(0, 3).map((item, index) => ({
					id: item.id,
					title: item.name,
					tag: index === 0 ? '东方雅集' : index === 1 ? '本周主推' : '匠心推荐',
					desc: item.desc,
					image: item.image
				}));
			}
			products.value = productList;
		} catch (error) {
			console.error('syncHomeData failed', error);
		}
	};

	const homeHeaderStyle = computed(() => ({
		paddingTop: `${statusBarHeight.value + 16}px`
	}));

	const brandRowStyle = computed(() => ({
		paddingRight: `${capsuleWidth.value + 16}px`,
		minHeight: `${Math.max(capsuleHeight.value, 44)}px`,
		marginTop: `${Math.max(capsuleMarginTop.value - 2, 0)}px`
	}));

	onLoad(() => {
		statusBarHeight.value = getApp().globalData?.statusBarHeight || 0;
		navigateHeight.value = getApp().globalData?.navigateHeight || 44;
		capsuleWidth.value = getApp().globalData?.capsuleWidth || 92;
		capsuleHeight.value = getApp().globalData?.capsuleHeight || 32;
		capsuleMarginTop.value = getApp().globalData?.capsuleMarginTopByStatusBar || 6;
		void syncHomeData();
	});

	const switchCategory = (name: string) => {
		currentCategory.value = name;
	};

	const onSearch = () => {
		uni.navigateTo({
			url: '/pages/home/goods-list/goods-list'
		});
	};

	const showMore = () => {
		uni.navigateTo({
			url: `/pages/home/goods-list/goods-list?category=${encodeURIComponent(currentCategory.value)}`
		});
	};

	const openDetail = (item: { id: string; name: string }) => {
		uni.navigateTo({
			url: `/pages/home/goods-datails/goods-datails?id=${item.id}&title=${encodeURIComponent(item.name)}`
		});
	};
</script>

<style lang="scss">
	page {
		background: $page-bg-f8;
	}

	.home_container {
		height: 100vh;
		background: linear-gradient(180deg, #efe7d8 0%, #f7f4ee 220rpx, #f7f4ee 100%);
	}

	.home_header {
		position: relative;
		min-height: 560rpx;
		padding: 34rpx 28rpx;
		padding-bottom: 120rpx;
		background: linear-gradient(180deg, #1c1712 0%, #2a2218 100%);
		border-bottom-left-radius: 48rpx;
		border-bottom-right-radius: 48rpx;
	}

	.brand_row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 20rpx;
		margin-bottom: 34rpx;
	}

	.brand_copy {
		flex: 1;
		min-width: 0;
	}

	.brand_subtitle {
		font-size: 22rpx;
		letter-spacing: 6rpx;
		color: rgba(255, 245, 220, 0.7);
	}

	.brand_title {
		margin-top: 8rpx;
		font-size: 46rpx;
		font-weight: 700;
		letter-spacing: 4rpx;
		color: $font-color-white;
		line-height: 1.18;
	}

	.brand_logo {
		width: 88rpx;
		height: 88rpx;
		flex-shrink: 0;
		border-radius: 24rpx;
		background: rgba(255, 255, 255, 0.08);
	}

	.search_box {
		display: flex;
		align-items: center;
		height: 88rpx;
		padding: 0 28rpx;
		border: 1rpx solid rgba(255, 255, 255, 0.14);
		border-radius: 44rpx;
		background: rgba(255, 255, 255, 0.08);
		backdrop-filter: blur(12rpx);
		box-shadow: 0 12rpx 28rpx rgba(0, 0, 0, 0.12);
	}

	.search_icon {
		font-size: 30rpx;
		color: rgba(255, 255, 255, 0.72);
		margin-right: 18rpx;
	}

	.search_text {
		font-size: 26rpx;
		color: rgba(255, 255, 255, 0.7);
		flex: 1;
	}

	.hero_copy {
		margin-top: 38rpx;
		display: flex;
		flex-direction: column;
		gap: 18rpx;
		padding-right: 20rpx;
	}

	.hero_copy-title {
		font-size: 38rpx;
		line-height: 1.42;
		font-weight: 600;
		color: $font-color-white;
	}

	.hero_copy-desc {
		font-size: 24rpx;
		line-height: 1.8;
		color: rgba(255, 255, 255, 0.76);
	}

	.section {
		padding: 0 32rpx;
		margin-bottom: 44rpx;
	}

	.category_section {
		margin-top: -80rpx;
		position: relative;
		z-index: 3;
	}

	.category_panel {
		padding: 26rpx 24rpx 22rpx;
		border-radius: 30rpx;
		background: rgba(255, 253, 249, 0.98);
		box-shadow: 0 18rpx 40rpx rgba(33, 24, 10, 0.1);
		border: 1rpx solid rgba(138, 120, 80, 0.08);
	}

	.category_panel-header {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 24rpx;
		margin-bottom: 18rpx;
	}

	.category_panel-caption {
		font-size: 18rpx;
		letter-spacing: 4rpx;
		text-transform: uppercase;
		color: $font-color-lightGrey;
	}

	.category_panel-title {
		margin-top: 8rpx;
		font-size: 32rpx;
		font-weight: 700;
		color: $font-color-darkGrey;
	}

	.category_scroll {
		white-space: nowrap;
	}

	.category_list {
		display: inline-flex;
		gap: 16rpx;
		padding: 8rpx 4rpx 4rpx;
	}

	.category_chip {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 148rpx;
		padding: 18rpx 22rpx;
		border-radius: 999rpx;
		background: #f8f4ed;
		border: 1rpx solid rgba(138, 120, 80, 0.08);
		color: $font-color-mediumGray;
		font-size: 24rpx;
		// box-shadow: 0 8rpx 18rpx rgba(0, 0, 0, 0.04);
		transition: all 0.2s ease;

		&.active {
			background: linear-gradient(135deg, #9b875a 0%, #75643f 100%);
			color: $font-color-white;
			border-color: transparent;
			// box-shadow: 0 14rpx 28rpx rgba(117, 100, 63, 0.28);

			.category_icon-wrap {
				background: rgba(255, 255, 255, 0.16);
			}
		}
	}

	.category_icon-wrap {
		width: 42rpx;
		height: 42rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 10rpx;
		border-radius: 50%;
		background: rgba(138, 120, 80, 0.08);
	}

	.category_icon {
		width: 28rpx;
		height: 28rpx;
	}

	.category_name {
		font-size: 25rpx;
		font-weight: 500;
	}

	.section_header {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 20rpx;
		margin-bottom: 24rpx;
	}

	.section_caption {
		font-size: 20rpx;
		letter-spacing: 4rpx;
		text-transform: uppercase;
		color: $font-color-lightGrey;
		margin-bottom: 8rpx;
	}

	.section_title {
		font-size: 38rpx;
		font-weight: 700;
		color: $font-color-darkGrey;
	}

	.section_line {
		flex: 1;
		height: 2rpx;
		margin-bottom: 12rpx;
		background: linear-gradient(90deg, rgba(138, 120, 80, 0.3) 0%, rgba(138, 120, 80, 0) 100%);
	}

	.section_more {
		font-size: 24rpx;
		color: $theme-color;
		padding-bottom: 10rpx;
	}

	.feature_swiper {
		height: 380rpx;
	}

	.feature_card {
		position: relative;
		height: 100%;
		overflow: hidden;
		border-radius: 32rpx;
		box-shadow: 0 24rpx 44rpx $shadow-color-strong;
	}

	.feature_image,
	.feature_mask {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.feature_mask {
		background: linear-gradient(180deg, rgba(0, 0, 0, 0.04) 0%, rgba(0, 0, 0, 0.58) 100%);
	}

	.feature_content {
		position: absolute;
		left: 28rpx;
		right: 28rpx;
		bottom: 30rpx;
		display: flex;
		flex-direction: column;
	}

	.feature_tag {
		align-self: flex-start;
		padding: 8rpx 18rpx;
		margin-bottom: 14rpx;
		border-radius: 999rpx;
		background: rgba(255, 255, 255, 0.16);
		color: rgba(255, 255, 255, 0.92);
		font-size: 22rpx;
	}

	.feature_title {
		font-size: 36rpx;
		font-weight: 700;
		color: $font-color-white;
		margin-bottom: 10rpx;
	}

	.feature_desc {
		font-size: 24rpx;
		line-height: 1.6;
		color: rgba(255, 255, 255, 0.82);
	}

	.product_grid {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		row-gap: 24rpx;
	}

	.product_card {
		width: calc(50% - 12rpx);
		background: $block-bg-white;
		border-radius: 28rpx;
		overflow: hidden;
		box-shadow: 0 12rpx 30rpx $shadow-color-soft;
	}

	.product_image {
		width: 100%;
		height: 260rpx;
		background: $block-bg-f8;
	}

	.product_body {
		padding: 22rpx;
	}

	.product_name {
		font-size: 28rpx;
		line-height: 1.5;
		font-weight: 600;
		color: $font-color-darkGrey;
		min-height: 84rpx;
	}

	.product_desc {
		margin-top: 10rpx;
		font-size: 22rpx;
		line-height: 1.6;
		color: $font-color-lightGrey;
		min-height: 70rpx;
	}

	.product_footer {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		margin-top: 18rpx;
		gap: 12rpx;
	}

	.product_price {
		font-size: 30rpx;
		font-weight: 700;
		color: $theme-color;
	}

	.product_origin {
		margin-left: 10rpx;
		font-size: 20rpx;
		color: $font-color-lightGrey;
		text-decoration: line-through;
	}

	.product_sales {
		font-size: 20rpx;
		color: $font-color-lightGrey;
	}

	.story_section {
		padding-bottom: calc(30rpx + env(safe-area-inset-bottom));
	}

	.story_card {
		padding: 30rpx;
		border-radius: 30rpx;
		background: linear-gradient(180deg, #1d1914 0%, #292219 100%);
		box-shadow: 0 22rpx 40rpx $shadow-color-strong;
	}

	.story_text {
		font-size: 25rpx;
		line-height: 1.8;
		color: rgba(255, 255, 255, 0.82);
	}

	.story_tags {
		display: flex;
		flex-wrap: wrap;
		gap: 14rpx;
		margin-top: 24rpx;
	}

	.story_tag {
		padding: 10rpx 18rpx;
		border-radius: 999rpx;
		font-size: 22rpx;
		color: #f3ead5;
		background: rgba(255, 255, 255, 0.08);
	}
</style>
