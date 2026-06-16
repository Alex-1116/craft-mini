<template>
	<scroll-view class="list_page" scroll-y>
		<view class="page_header" :style="{ paddingTop: `${statusBarHeight + 12}px` }">
			<view class="nav_back" @click="goBack">
				<text class="iconfont icon-arrow-left"></text>
			</view>
			<view class="page_header-main">
				<view class="page_caption">COLLECTION</view>
				<view class="page_title">器物列表</view>
			</view>
		</view>

		<view class="search_area">
			<view class="search_box">
				<text class="iconfont icon-search search_icon"></text>
				<input
					v-model="searchKey"
					class="search_input"
					placeholder="搜索雅器、材质、品类"
					placeholder-class="search_placeholder"
					confirm-type="search"
					@confirm="applySearch"
				/>
				<view class="search_action" @click="applySearch">搜索</view>
			</view>
		</view>

		<view class="category_section">
			<scroll-view class="category_scroll" scroll-x show-scrollbar="false">
				<view class="category_list">
					<view
						v-for="item in categories"
						:key="item"
						class="category_chip"
						:class="{ active: currentCategory === item }"
						@click="switchCategory(item)"
					>
						{{ item }}
					</view>
				</view>
			</scroll-view>
		</view>

		<view class="result_bar">
			<view class="result_text">共找到 {{ filteredProducts.length }} 件器物</view>
			<view class="result_text subtle" v-if="appliedKeyword">关键词：{{ appliedKeyword }}</view>
		</view>

		<view class="product_grid" v-if="filteredProducts.length">
			<view class="product_card" v-for="item in filteredProducts" :key="item.id" @click="openDetail(item.id)">
				<image class="product_image" :src="item.image" mode="aspectFill"></image>
				<view class="product_body">
					<view class="product_category">{{ item.category }}</view>
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

		<view class="empty_state" v-else>
			<view class="empty_title">未找到匹配商品</view>
			<view class="empty_desc">试试更换关键词或切换分类。</view>
			<button class="reset_button btn-active" @click="resetFilters">重置筛选</button>
		</view>
	</scroll-view>
</template>

<script lang="ts" setup>
	import { computed, ref } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import Api from '@/services/api';
	import type { ProductItem } from '@/services/api/modules/product';

	interface ListProductItem {
		id: string;
		name: string;
		category: string;
		image: string;
		desc: string;
		price: number;
		originPrice?: number | null;
		sales: number;
	}

	const statusBarHeight = ref(0);
	const categories = ref<string[]>(['全部']);
	const searchKey = ref('');
	const appliedKeyword = ref('');
	const currentCategory = ref('全部');
	const products = ref<ListProductItem[]>([]);

	const filteredProducts = computed(() => {
		return products.value.filter((item) => {
			const matchCategory = currentCategory.value === '全部' || item.category === currentCategory.value;
			const keyword = appliedKeyword.value.trim().toLowerCase();
			const matchKeyword = !keyword ||
				item.name.toLowerCase().includes(keyword) ||
				item.desc.toLowerCase().includes(keyword) ||
				item.category.toLowerCase().includes(keyword);
			return matchCategory && matchKeyword;
		});
	});

	const mapProduct = (item: ProductItem): ListProductItem => ({
		id: item.id,
		name: item.name,
		category: item.category?.name || '未分类',
		image: item.images?.[0] || '/static/images/logo.png',
		desc: item.description || item.material || '东方器物精选',
		price: item.price,
		originPrice: item.originalPrice,
		sales: item.sales
	});

	const syncProducts = async () => {
		try {
			const [categoryRes, productRes] = await Promise.all([
				Api.product.getCategoryListApi(),
				Api.product.getProductListApi({ page: 1, pageSize: 50 })
			]);
			const remoteCategories = (categoryRes?.data || []).map((item: any) => item.name);
			categories.value = ['全部', ...remoteCategories];
			products.value = (productRes?.data?.list || []).map((item: ProductItem) => mapProduct(item));
		} catch (error) {
			console.error('syncProducts failed', error);
		}
	};

	onLoad((options) => {
		statusBarHeight.value = getApp().globalData?.statusBarHeight || 0;
		const category = decodeURIComponent(options?.category || '全部');
		const keyword = decodeURIComponent(options?.keyword || '');
		if (categories.value.includes(category)) {
			currentCategory.value = category;
		}
		searchKey.value = keyword;
		appliedKeyword.value = keyword;
		void syncProducts().then(() => {
			if (categories.value.includes(category)) {
				currentCategory.value = category;
			}
		});
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

	const switchCategory = (category: string) => {
		currentCategory.value = category;
	};

	const applySearch = () => {
		appliedKeyword.value = searchKey.value.trim();
	};

	const resetFilters = () => {
		searchKey.value = '';
		appliedKeyword.value = '';
		currentCategory.value = '全部';
	};

	const openDetail = (id: string) => {
		uni.navigateTo({
			url: `/pages/home/goods-datails/goods-datails?id=${id}`
		});
	};
</script>

<style lang="scss">
	page {
		background: $page-bg-f8;
	}

	.list_page {
		height: 100vh;
		background: $page-bg-f8;
	}

	.page_header {
		display: flex;
		align-items: center;
		padding-left: 28rpx;
		padding-right: 28rpx;
		padding-bottom: 24rpx;
		background: linear-gradient(180deg, #1b1712 0%, #2a2218 100%);
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

	.page_header-main {
		margin-left: 18rpx;
	}

	.page_caption {
		font-size: 20rpx;
		letter-spacing: 5rpx;
		color: rgba(255, 255, 255, 0.56);
	}

	.page_title {
		margin-top: 8rpx;
		font-size: 38rpx;
		font-weight: 700;
		color: $font-color-white;
	}

	.search_area {
		padding: 24rpx 28rpx 0;
	}

	.search_box {
		display: flex;
		align-items: center;
		height: 92rpx;
		padding: 0 20rpx 0 24rpx;
		border-radius: 999rpx;
		background: $block-bg-white;
		box-shadow: 0 12rpx 28rpx $shadow-color-soft;
	}

	.search_icon {
		font-size: 30rpx;
		color: $font-color-lightGrey;
		margin-right: 14rpx;
	}

	.search_input {
		flex: 1;
		height: 100%;
		font-size: 28rpx;
		color: $font-color-darkGrey;
	}

	.search_placeholder {
		color: #aba396;
		font-size: 26rpx;
	}

	.search_action {
		width: 116rpx;
		height: 64rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 999rpx;
		background: linear-gradient(135deg, #9b875a 0%, #75643f 100%);
		font-size: 24rpx;
		color: $font-color-white;
	}

	.category_section {
		padding: 22rpx 0 0 28rpx;
	}

	.category_scroll {
		white-space: nowrap;
	}

	.category_list {
		display: inline-flex;
		gap: 16rpx;
		padding-right: 28rpx;
	}

	.category_chip {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 16rpx 24rpx;
		border-radius: 999rpx;
		background: rgba(255, 255, 255, 0.78);
		font-size: 24rpx;
		color: $font-color-mediumGray;
		box-shadow: 0 8rpx 20rpx $shadow-color-soft;

		&.active {
			background: linear-gradient(135deg, #9b875a 0%, #75643f 100%);
			color: $font-color-white;
		}
	}

	.result_bar {
		display: flex;
		justify-content: space-between;
		gap: 16rpx;
		padding: 24rpx 28rpx 0;
	}

	.result_text {
		font-size: 24rpx;
		color: $font-color-mediumGray;

		&.subtle {
			color: $font-color-lightGrey;
		}
	}

	.product_grid {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		row-gap: 24rpx;
		padding: 24rpx 28rpx calc(36rpx + env(safe-area-inset-bottom));
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

	.product_category {
		font-size: 20rpx;
		color: $font-color-lightGrey;
		margin-bottom: 8rpx;
	}

	.product_name {
		min-height: 84rpx;
		font-size: 28rpx;
		line-height: 1.5;
		font-weight: 600;
		color: $font-color-darkGrey;
	}

	.product_desc {
		min-height: 70rpx;
		margin-top: 10rpx;
		font-size: 22rpx;
		line-height: 1.6;
		color: $font-color-lightGrey;
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

	.empty_state {
		padding: 140rpx 40rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.empty_title {
		font-size: 34rpx;
		font-weight: 700;
		color: $font-color-darkGrey;
	}

	.empty_desc {
		margin-top: 16rpx;
		font-size: 24rpx;
		line-height: 1.8;
		color: $font-color-lightGrey;
	}

	.reset_button {
		width: 240rpx;
		height: 88rpx;
		line-height: 88rpx;
		margin-top: 30rpx;
		border-radius: 999rpx;
		background: linear-gradient(135deg, #9b875a 0%, #75643f 100%);
		font-size: 28rpx;
		color: $font-color-white;
		font-weight: 600;
	}
</style>
