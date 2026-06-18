<template>
	<scroll-view class="detail_page" scroll-y>
		<view class="page_header" :style="{ paddingTop: `${statusBarHeight}px` }">
			<view class="nav_back" @click="goBack">
				<text class="iconfont icon-arrow-left"></text>
			</view>
			<view class="page_header-title">订单详情</view>
		</view>

		<view v-if="order" class="detail_content">
			<view class="success_card">
				<view class="success_icon">
					<text class="iconfont icon-queding1"></text>
				</view>
				<view class="success_title">订单提交成功</view>
				<view class="success_desc">客服将尽快与您联系并安排后续处理。</view>
			</view>

			<view class="section_title">订单状态</view>
			<view class="info_card status_card">
				<view class="status_row">
					<text class="status_code">订单编号：{{ order.id }}</text>
					<view class="order_status" :class="statusClass">{{ statusLabel }}</view>
				</view>
				<view class="status_time">下单时间：{{ formatDate(order.createdAt) }}</view>
			</view>

			<view class="section_title">商品信息</view>
			<view class="info_card product_card">
				<image class="product_image" :src="order.product?.images?.[0] || '/static/images/logo.png'" mode="aspectFill"></image>
				<view class="product_info">
					<view class="product_name">{{ order.product?.name || '商品信息' }}</view>
					<view class="product_meta">单价 ¥{{ order.unitPrice }} × {{ order.quantity }}</view>
					<view class="product_total">实付 ¥{{ order.totalPrice }}</view>
				</view>
			</view>

			<view class="section_title">收货与联系信息</view>
			<view class="info_card">
				<view class="info_item">
					<text class="label">收货人</text>
					<text class="value">{{ order.customerName }}</text>
				</view>
				<view class="info_item">
					<text class="label">联系电话</text>
					<text class="value">{{ order.phone }}</text>
				</view>
				<view class="info_item">
					<text class="label">收货地址</text>
					<text class="value">{{ order.address }}</text>
				</view>
				<view class="info_item" v-if="order.notes">
					<text class="label">订单备注</text>
					<text class="value">{{ order.notes }}</text>
				</view>
			</view>

			<view class="section_title">结算明细</view>
			<view class="info_card">
				<view class="settle_row">
					<text>商品总价</text>
					<text>¥{{ order.totalPrice }}</text>
				</view>
				<view class="settle_row">
					<text>运费</text>
					<text>免运费</text>
				</view>
				<view class="settle_row total">
					<text>实付款</text>
					<text>¥{{ order.totalPrice }}</text>
				</view>
			</view>

			<view class="action_row">
				<button class="action_button ghost btn-active" @click="goHome">返回首页</button>
				<button class="action_button btn-active" @click="goOrderList">查看全部订单</button>
			</view>
		</view>

		<view class="empty_state" v-else>
			<text class="empty_title">订单不存在</text>
			<text class="empty_desc">未找到对应订单信息，请返回订单列表重新查看。</text>
			<button class="empty_button btn-active" @click="goOrderList">返回订单列表</button>
		</view>
	</scroll-view>
</template>

<script lang="ts" setup>
	import { computed, ref } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import Api from '@/services/api';
	import { ensureSession } from '@/shared/auth/session';

	const statusBarHeight = ref(0);
	const order = ref<any>();
	const protectedPath = '/pages/order/detail/detail';

	const statusLabel = computed(() => {
		switch (order.value?.status || 'PENDING') {
			case 'PENDING':
				return '待处理';
			case 'COMPLETED':
				return '已完成';
			case 'CANCELLED':
				return '已取消';
			default:
				return order.value?.status || '待处理';
		}
	});
	const statusClass = computed(() => {
		switch (order.value?.status || 'PENDING') {
			case 'PENDING':
				return 'warning';
			case 'COMPLETED':
				return 'success';
			case 'CANCELLED':
				return 'danger';
			default:
				return 'info';
		}
	});

	onLoad(async (options) => {
		statusBarHeight.value = getApp().globalData?.statusBarHeight || 0;
		const redirectTarget = options?.id ? `${protectedPath}?id=${options.id}` : protectedPath;
		if (!ensureSession(redirectTarget, 'redirectTo')) {
			return;
		}
		try {
			const res = await Api.order.getOrderDetailApi(options?.id || '');
			order.value = res?.data;
		} catch (error) {
			console.error('getOrderDetail failed', error);
			order.value = undefined;
		}
	});

	const goBack = () => {
		uni.navigateBack();
	};

	const goHome = () => {
		uni.switchTab({
			url: '/pages/tabbar/home/home'
		});
	};

	const goOrderList = () => {
		uni.redirectTo({
			url: '/pages/order/list/list'
		});
	};

	const formatDate = (value: string) => new Date(value).toLocaleString('zh-CN');
</script>

<style lang="scss">
	page {
		background: $page-bg-f8;
	}

	.detail_page {
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

	.detail_content {
		padding: 28rpx;
	}

	.success_card,
	.info_card {
		border-radius: 28rpx;
		background: $block-bg-white;
		box-shadow: 0 12rpx 30rpx $shadow-color-soft;
	}

	.success_card {
		padding: 34rpx 28rpx;
		text-align: center;
		margin-bottom: 28rpx;
	}

	.success_icon {
		width: 100rpx;
		height: 100rpx;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background: #edf6ef;
		color: #3d8f62;
		font-size: 44rpx;
	}

	.success_title {
		margin-top: 18rpx;
		font-size: 34rpx;
		font-weight: 700;
		color: $font-color-darkGrey;
	}

	.success_desc {
		margin-top: 12rpx;
		font-size: 24rpx;
		line-height: 1.8;
		color: $font-color-lightGrey;
	}

	.section_title {
		font-size: 30rpx;
		font-weight: 700;
		color: $font-color-darkGrey;
		margin-bottom: 16rpx;
	}

	.status_card,
	.product_card {
		margin-bottom: 28rpx;
	}

	.status_card,
	.info_card {
		padding: 24rpx 28rpx;
	}

	.status_row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16rpx;
	}

	.status_code {
		font-size: 24rpx;
		color: $font-color-mediumGray;
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

	.status_time {
		margin-top: 16rpx;
		font-size: 22rpx;
		color: $font-color-lightGrey;
	}

	.product_card {
		display: flex;
	}

	.product_image {
		width: 160rpx;
		height: 160rpx;
		border-radius: 22rpx;
		margin-right: 20rpx;
		background: $block-bg-f8;
	}

	.product_info {
		flex: 1;
	}

	.product_name {
		font-size: 29rpx;
		font-weight: 700;
		color: $font-color-darkGrey;
	}

	.product_meta {
		margin-top: 12rpx;
		font-size: 22rpx;
		color: $font-color-lightGrey;
	}

	.product_total {
		margin-top: 18rpx;
		font-size: 28rpx;
		font-weight: 700;
		color: $theme-color;
	}

	.info_item,
	.settle_row {
		display: flex;
		justify-content: space-between;
		gap: 18rpx;
		padding: 18rpx 0;
		border-bottom: 1rpx solid rgba(138, 120, 80, 0.08);
		font-size: 25rpx;
		color: $font-color-mediumGray;

		&:last-child {
			border-bottom: none;
		}
	}

	.label {
		min-width: 120rpx;
		color: $font-color-lightGrey;
	}

	.value {
		flex: 1;
		text-align: right;
		line-height: 1.7;
		color: $font-color-darkGrey;
	}

	.settle_row.total {
		font-weight: 700;
		color: $font-color-darkGrey;
	}

	.action_row {
		display: flex;
		gap: 18rpx;
		margin-top: 30rpx;
		margin-bottom: calc(30rpx + env(safe-area-inset-bottom));
	}

	.action_button,
	.empty_button {
		flex: 1;
		height: 88rpx;
		line-height: 88rpx;
		border-radius: 999rpx;
		background: linear-gradient(135deg, #9b875a 0%, #75643f 100%);
		color: $font-color-white;
		font-size: 28rpx;
		font-weight: 600;

		&.ghost {
			background: #ede7da;
			color: $font-color-darkGrey;
		}
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
		margin-top: 30rpx;
		width: 280rpx;
	}
</style>
