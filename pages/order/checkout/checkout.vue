<template>
	<scroll-view class="checkout_page" scroll-y>
		<view class="page_header" :style="{ paddingTop: `${statusBarHeight + 12}px` }">
			<view class="nav_back" @click="goBack">
				<text class="iconfont icon-arrow-left"></text>
			</view>
			<view class="page_header-title">确认结算</view>
		</view>

		<view class="content_section" v-if="product">
			<view class="section_title">商品摘要</view>
			<view class="product_card">
				<image class="product_image" :src="product.images?.[0] || '/static/images/logo.png'" mode="aspectFill"></image>
				<view class="product_info">
					<view class="product_name">{{ product.name }}</view>
					<view class="product_desc">{{ product.description || product.material || '东方器物精选' }}</view>
					<view class="product_meta">
						<text class="product_price">¥{{ product.price }}</text>
						<view class="quantity_box">
							<view class="quantity_button" @click="changeQuantity(-1)">-</view>
							<view class="quantity_value">{{ quantity }}</view>
							<view class="quantity_button" @click="changeQuantity(1)">+</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="content_section" v-if="product">
			<view class="section_title">收货信息</view>
			<view class="section_action" @click="goAddressManage">管理地址</view>
			<view class="form_card">
				<view class="field_item">
					<text class="field_label">收货人</text>
					<input v-model="formState.customerName" class="field_input" placeholder="请输入收货人姓名" placeholder-class="field_placeholder" />
				</view>
				<view class="field_item">
					<text class="field_label">联系电话</text>
					<input v-model="formState.phone" class="field_input" type="number" maxlength="11" placeholder="请输入联系电话" placeholder-class="field_placeholder" />
				</view>
				<view class="field_item">
					<text class="field_label">收货地址</text>
					<textarea v-model="formState.address" class="field_textarea" placeholder="请输入省市区及详细街道门牌信息" placeholder-class="field_placeholder"></textarea>
				</view>
				<view class="field_item">
					<text class="field_label">订单备注</text>
					<textarea v-model="formState.notes" class="field_textarea" placeholder="如有特殊需求，请在此补充" placeholder-class="field_placeholder"></textarea>
				</view>
			</view>
		</view>

		<view class="content_section" v-if="product">
			<view class="section_title">结算明细</view>
			<view class="summary_card">
				<view class="summary_row">
					<text>商品金额</text>
					<text>¥{{ totalPrice }}</text>
				</view>
				<view class="summary_row">
					<text>运费</text>
					<text>包邮</text>
				</view>
				<view class="summary_row total">
					<text>应付总额</text>
					<text>¥{{ totalPrice }}</text>
				</view>
			</view>
		</view>

		<view class="bottom_bar" v-if="product">
			<view class="bottom_meta">
				<text class="meta_label">应付总额</text>
				<text class="meta_value">¥{{ totalPrice }}</text>
			</view>
			<button class="submit_button btn-active" @click="submitOrder">提交订单</button>
		</view>

		<view class="empty_state" v-if="!product">
			<text class="empty_title">暂无待结算商品</text>
			<text class="empty_desc">请先从商品详情页选择商品后再进入结算。</text>
			<button class="empty_button btn-active" @click="goHome">返回首页</button>
		</view>
	</scroll-view>
</template>

<script lang="ts" setup>
	import { computed, ref } from 'vue';
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import Api from '@/services/api';
	import { clearCheckoutDraft, getCheckoutDraft } from '@/shared/mock/craft';
	import { ensureSession, hasAccessToken } from '@/shared/auth/session';

	const statusBarHeight = ref(0);
	const quantity = ref(1);
	const loading = ref(false);
	const product = ref<any>(null);
	const formState = ref({
		customerName: '',
		phone: '',
		address: '',
		notes: ''
	});

	const totalPrice = computed(() => ((product.value?.price || 0) * quantity.value).toFixed(2));

	const syncDefaultAddress = async () => {
		if (!hasAccessToken()) {
			return;
		}

		try {
			const res = await Api.address.getAddressListApi();
			const defaultAddress = (res?.data || []).find((item: any) => item.isDefault);
			if (!defaultAddress) {
				return;
			}
			formState.value.customerName = defaultAddress.name;
			formState.value.phone = defaultAddress.phone;
			formState.value.address = `${defaultAddress.region} ${defaultAddress.detail}`;
		} catch (error) {
			console.error('syncDefaultAddress failed', error);
		}
	};

	const syncProduct = async () => {
		const draft = getCheckoutDraft();
		if (!draft) {
			return;
		}

		try {
			const res = await Api.product.getProductDetailApi(draft.productId);
			product.value = res?.data || null;
			quantity.value = draft.quantity || 1;
		} catch (error) {
			console.error('syncProduct failed', error);
		}
	};

	onLoad(async () => {
		statusBarHeight.value = getApp().globalData?.statusBarHeight || 0;
		if (!ensureSession('/pages/order/checkout/checkout')) {
			return;
		}
		await syncProduct();
		await syncDefaultAddress();
	});

	onShow(() => {
		void syncDefaultAddress();
	});

	const goBack = () => {
		if (getCurrentPages().length > 1) {
			uni.navigateBack();
			return;
		}
		goHome();
	};

	const goHome = () => {
		uni.switchTab({
			url: '/pages/tabbar/home/home'
		});
	};

	const changeQuantity = (step: number) => {
		const next = quantity.value + step;
		if (next < 1) {
			return;
		}
		quantity.value = next;
	};

	const goAddressManage = () => {
		uni.navigateTo({
			url: '/pages/mine/address/address'
		});
	};

	const submitOrder = async () => {
		if (!product.value || loading.value) {
			return;
		}

		if (!formState.value.customerName || !/^1\d{10}$/.test(formState.value.phone) || !formState.value.address) {
			uni.showToast({
				icon: 'none',
				title: '请填写完整收货信息'
			});
			return;
		}

		loading.value = true;
		try {
			const res = await Api.order.createOrderApi({
				productId: product.value.id,
				quantity: quantity.value,
				unitPrice: product.value.price,
				totalPrice: Number(totalPrice.value),
				customerName: formState.value.customerName,
				phone: formState.value.phone,
				address: formState.value.address,
				notes: formState.value.notes
			});
			const order = res?.data;
			if (!order?.id) {
				throw new Error('订单创建失败');
			}
			clearCheckoutDraft();
			uni.showToast({
				icon: 'none',
				title: '订单已提交'
			});
			setTimeout(() => {
				uni.redirectTo({
					url: `/pages/order/detail/detail?id=${order.id}`
				});
			}, 300);
		} catch (error) {
			console.error('submitOrder failed', error);
		} finally {
			loading.value = false;
		}
	};
</script>

<style lang="scss">
	page {
		background: $page-bg-f8;
	}

	.checkout_page {
		height: 100vh;
		background: $page-bg-f8;
		padding-bottom: calc(160rpx + env(safe-area-inset-bottom));
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

	.content_section {
		padding: 28rpx;
	}

	.section_title {
		font-size: 30rpx;
		font-weight: 700;
		color: $font-color-darkGrey;
		margin-bottom: 16rpx;
	}

	.section_action {
		margin-top: -2rpx;
		margin-bottom: 16rpx;
		font-size: 24rpx;
		color: $theme-color;
	}

	.product_card,
	.form_card,
	.summary_card {
		border-radius: 28rpx;
		background: $block-bg-white;
		box-shadow: 0 12rpx 30rpx $shadow-color-soft;
	}

	.product_card {
		display: flex;
		padding: 24rpx;
	}

	.product_image {
		width: 180rpx;
		height: 180rpx;
		border-radius: 24rpx;
		margin-right: 20rpx;
		background: $block-bg-f8;
	}

	.product_info {
		flex: 1;
	}

	.product_name {
		font-size: 30rpx;
		font-weight: 700;
		color: $font-color-darkGrey;
	}

	.product_desc {
		margin-top: 10rpx;
		font-size: 22rpx;
		line-height: 1.7;
		color: $font-color-lightGrey;
	}

	.product_meta {
		margin-top: 18rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.product_price {
		font-size: 34rpx;
		font-weight: 700;
		color: $theme-color;
	}

	.quantity_box {
		display: flex;
		align-items: center;
		border-radius: 999rpx;
		background: #f6f1e8;
	}

	.quantity_button,
	.quantity_value {
		width: 60rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		color: $font-color-darkGrey;
	}

	.form_card {
		padding: 10rpx 24rpx;
	}

	.field_item {
		padding: 22rpx 0;
		border-bottom: 1rpx solid rgba(138, 120, 80, 0.1);

		&:last-child {
			border-bottom: none;
		}
	}

	.field_label {
		display: block;
		margin-bottom: 12rpx;
		font-size: 24rpx;
		color: $font-color-mediumGray;
	}

	.field_input,
	.field_textarea {
		width: 100%;
		font-size: 28rpx;
		color: $font-color-darkGrey;
	}

	.field_textarea {
		min-height: 140rpx;
	}

	.field_placeholder {
		color: #aba396;
		font-size: 26rpx;
	}

	.summary_card {
		padding: 10rpx 24rpx;
	}

	.summary_row {
		display: flex;
		justify-content: space-between;
		padding: 22rpx 0;
		font-size: 26rpx;
		color: $font-color-mediumGray;
		border-bottom: 1rpx solid rgba(138, 120, 80, 0.08);

		&.total {
			font-weight: 700;
			color: $font-color-darkGrey;
			border-bottom: none;
		}
	}

	.bottom_bar {
		position: fixed;
		left: 24rpx;
		right: 24rpx;
		bottom: calc(24rpx + env(safe-area-inset-bottom));
		display: flex;
		align-items: center;
		gap: 18rpx;
		padding: 20rpx;
		border-radius: 28rpx;
		background: rgba(255, 253, 249, 0.94);
		box-shadow: 0 16rpx 34rpx $shadow-color-soft;
	}

	.bottom_meta {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.meta_label {
		font-size: 20rpx;
		color: $font-color-lightGrey;
	}

	.meta_value {
		margin-top: 6rpx;
		font-size: 34rpx;
		font-weight: 700;
		color: $theme-color;
	}

	.submit_button,
	.empty_button {
		width: 220rpx;
		height: 88rpx;
		line-height: 88rpx;
		border-radius: 999rpx;
		background: linear-gradient(135deg, #9b875a 0%, #75643f 100%);
		color: $font-color-white;
		font-size: 28rpx;
		font-weight: 600;
	}

	.empty_state {
		padding: 120rpx 40rpx;
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

	.empty_button {
		margin-top: 28rpx;
		width: 260rpx;
	}
</style>
