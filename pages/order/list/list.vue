<template>
	<scroll-view class="order_page" scroll-y>
		<view class="page_header" :style="{ paddingTop: `${statusBarHeight + 12}px` }">
			<view class="nav_back" @click="goBack">
				<text class="iconfont icon-arrow-left"></text>
			</view>
			<view class="page_header-title">我的订单</view>
		</view>

		<view class="order_list" v-if="orders.length">
			<view class="order_card" v-for="item in orders" :key="item.id" @click="openDetail(item.id)">
				<image class="order_image" :src="item.product?.images?.[0] || '/static/images/logo.png'" mode="aspectFill"></image>
				<view class="order_info">
					<view class="order_top">
						<view class="order_name one-line-ellipsis">{{ item.product?.name || '商品信息' }}</view>
						<view class="order_status" :class="statusClass(item.status)">{{ statusLabel(item.status) }}</view>
					</view>
					<view class="order_meta">{{ formatDate(item.createdAt) }} · 数量 {{ item.quantity }}</view>
					<view class="order_bottom">
						<text class="order_price">实付 ¥{{ item.totalPrice }}</text>
						<text class="order_arrow">查看详情</text>
					</view>
				</view>
			</view>
		</view>

		<view class="empty_state" v-else>
			<text class="empty_title">暂无订单记录</text>
			<text class="empty_desc">提交订单后，这里会展示你的历史购买记录。</text>
			<button class="empty_button btn-active" @click="goHome">去选购商品</button>
		</view>
	</scroll-view>
</template>

<script lang="ts" setup>
	import { ref } from 'vue';
	import { onShow } from '@dcloudio/uni-app';
	import Api from '@/services/api';

	const statusBarHeight = ref(0);
	const orders = ref<any[]>([]);

	const syncOrders = async () => {
		try {
			const res = await Api.order.getOrderListApi();
			orders.value = res?.data || [];
		} catch (error) {
			console.error('syncOrders failed', error);
			orders.value = [];
		}
	};

	onShow(() => {
		statusBarHeight.value = getApp().globalData?.statusBarHeight || 0;
		void syncOrders();
	});

	const goBack = () => {
		uni.navigateBack();
	};

	const goHome = () => {
		uni.switchTab({
			url: '/pages/tabbar/home/home'
		});
	};

	const openDetail = (id: string) => {
		uni.navigateTo({
			url: `/pages/order/detail/detail?id=${id}`
		});
	};

	const statusLabel = (status: string) => {
		switch (status) {
			case 'PENDING':
				return '待处理';
			case 'COMPLETED':
				return '已完成';
			case 'CANCELLED':
				return '已取消';
			default:
				return status;
		}
	};
	const statusClass = (status: string) => {
		switch (status) {
			case 'PENDING':
				return 'warning';
			case 'COMPLETED':
				return 'success';
			case 'CANCELLED':
				return 'danger';
			default:
				return 'info';
		}
	};
	const formatDate = (value: string) => new Date(value).toLocaleString('zh-CN');
</script>

<style lang="scss">
	page {
		background: $page-bg-f8;
	}

	.order_page {
		height: 100vh;
		background: $page-bg-f8;
	}

	.page_header {
		display: flex;
		align-items: center;
		padding-left: 28rpx;
		padding-right: 28rpx;
		padding-bottom: 22rpx;
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

	.page_header-title {
		margin-left: 18rpx;
		font-size: 34rpx;
		font-weight: 700;
		color: $font-color-white;
	}

	.order_list {
		padding: 28rpx;
	}

	.order_card {
		display: flex;
		padding: 24rpx;
		margin-bottom: 20rpx;
		border-radius: 28rpx;
		background: $block-bg-white;
		box-shadow: 0 12rpx 30rpx $shadow-color-soft;
	}

	.order_image {
		width: 160rpx;
		height: 160rpx;
		border-radius: 22rpx;
		margin-right: 20rpx;
		background: $block-bg-f8;
	}

	.order_info {
		flex: 1;
	}

	.order_top,
	.order_bottom {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12rpx;
	}

	.order_name {
		flex: 1;
		font-size: 29rpx;
		font-weight: 700;
		color: $font-color-darkGrey;
	}

	.order_status {
		padding: 8rpx 16rpx;
		border-radius: 999rpx;
		font-size: 20rpx;

		&.warning {
			background: #f7efe0;
			color: #9b875a;
		}

		&.info {
			background: #ece8df;
			color: #6f644e;
		}

		&.success {
			background: #ebf5ef;
			color: #3d8f62;
		}

		&.danger {
			background: #f8e9e6;
			color: #b55f54;
		}
	}

	.order_meta {
		margin-top: 16rpx;
		font-size: 22rpx;
		color: $font-color-lightGrey;
	}

	.order_bottom {
		margin-top: 20rpx;
	}

	.order_price {
		font-size: 28rpx;
		font-weight: 700;
		color: $theme-color;
	}

	.order_arrow {
		font-size: 22rpx;
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
		margin-top: 18rpx;
		font-size: 24rpx;
		line-height: 1.8;
		color: $font-color-lightGrey;
	}

	.empty_button {
		width: 260rpx;
		height: 88rpx;
		line-height: 88rpx;
		margin-top: 30rpx;
		border-radius: 999rpx;
		background: linear-gradient(135deg, #9b875a 0%, #75643f 100%);
		color: $font-color-white;
		font-size: 28rpx;
		font-weight: 600;
	}
</style>
