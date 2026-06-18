<template>
	<scroll-view class="checkout_page" scroll-y>
		<view class="page_header" :style="{ paddingTop: `${statusBarHeight}px` }">
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
			<view class="address_card" v-if="selectedAddress" @click="goAddressManage">
				<view class="address_top">
					<view class="address_name">
						<text>{{ selectedAddress.name }}</text>
						<text class="address_phone">{{ formatPhone(selectedAddress.phone) }}</text>
					</view>
					<view class="address_top-right">
						<text class="address_tag" v-if="selectedAddress.isDefault">默认</text>
						<text class="iconfont icon-arrow-right address_arrow"></text>
					</view>
				</view>
				<view class="address_text">{{ selectedAddress.region }}</view>
				<view class="address_text">{{ selectedAddress.detail }}</view>
			</view>
			<view class="address_empty-card" v-else @click="goAddressManage">
				<view class="address_empty-top">
					<view class="address_empty-title">暂无可用收货地址</view>
					<text class="iconfont icon-arrow-right address_arrow"></text>
				</view>
				<view class="address_empty-desc">请先前往地址列表新增地址，再选择回填到当前订单。</view>
				<view class="address_empty-action">去新增并选择</view>
			</view>
			<view class="notes_card">
				<view class="field_item notes_field-item">
					<text class="field_label">订单备注</text>
					<textarea v-model="formState.notes" class="field_textarea notes_textarea" placeholder="如有特殊需求，请在此补充" placeholder-class="field_placeholder"></textarea>
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
	import { clearCheckoutDraft, clearCheckoutSelectedAddress, getCheckoutDraft, getCheckoutSelectedAddress } from '@/shared/mock/craft';
	import { ensureSession, hasAccessToken } from '@/shared/auth/session';

	interface AddressItem {
		id: string;
		name: string;
		phone: string;
		region: string;
		detail: string;
		isDefault: boolean;
	}

	const statusBarHeight = ref(0);
	const quantity = ref(1);
	const loading = ref(false);
	const product = ref<any>(null);
	const selectedAddress = ref<AddressItem | null>(null);
	const formState = ref({
		notes: ''
	});

	const totalPrice = computed(() => ((product.value?.price || 0) * quantity.value).toFixed(2));

	const syncSelectedAddress = async () => {
		if (!hasAccessToken()) {
			selectedAddress.value = null;
			return;
		}

		try {
			const res = await Api.address.getAddressListApi();
			const addressList = (res?.data || []) as AddressItem[];
			const pendingSelectedId = getCheckoutSelectedAddress();
			const pendingSelectedAddress = pendingSelectedId ? addressList.find((item) => item.id === pendingSelectedId) : null;
			const defaultAddress = addressList.find((item) => item.isDefault) || null;
			selectedAddress.value = pendingSelectedAddress || defaultAddress || null;
			clearCheckoutSelectedAddress();
		} catch (error) {
			selectedAddress.value = null;
			console.error('syncSelectedAddress failed', error);
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
		await syncSelectedAddress();
	});

	onShow(() => {
		if (!ensureSession('/pages/order/checkout/checkout')) {
			return;
		}
		void syncSelectedAddress();
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
			url: `/pages/mine/address/address?mode=select&redirect=${encodeURIComponent('/pages/order/checkout/checkout')}`
		});
	};

	const formatPhone = (phone: string) => {
		const normalizedPhone = phone.replace(/\s+/g, '');
		if (normalizedPhone.length !== 11) {
			return phone;
		}
		return `${normalizedPhone.slice(0, 3)} ${normalizedPhone.slice(3, 7)} ${normalizedPhone.slice(7)}`;
	};

	const submitOrder = async () => {
		if (!product.value || loading.value) {
			return;
		}

		if (!selectedAddress.value) {
			uni.showToast({
				icon: 'none',
				title: '请先选择收货地址'
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
				customerName: selectedAddress.value.name,
				phone: selectedAddress.value.phone,
				address: `${selectedAddress.value.region} ${selectedAddress.value.detail}`,
				notes: formState.value.notes
			});
			const order = res?.data;
			if (!order?.id) {
				throw new Error('订单创建失败');
			}
			clearCheckoutDraft();
			clearCheckoutSelectedAddress();
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

	.product_card,
	.address_card,
	.address_empty-card,
	.notes_card,
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

	.address_card {
		padding: 28rpx;
	}

	.address_top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 18rpx;
	}

	.address_top-right {
		display: flex;
		align-items: center;
		gap: 12rpx;
		flex-shrink: 0;
	}

	.address_name {
		font-size: 30rpx;
		font-weight: 700;
		color: $font-color-darkGrey;
	}

	.address_phone {
		margin-left: 14rpx;
		font-size: 24rpx;
		font-weight: 500;
		color: $font-color-lightGrey;
	}

	.address_tag {
		padding: 8rpx 16rpx;
		border-radius: 999rpx;
		background: $block-bg-accent;
		font-size: 20rpx;
		color: $theme-color;
	}

	.address_arrow {
		font-size: 24rpx;
		color: $font-color-lightGrey;
	}

	.address_text {
		margin-top: 16rpx;
		font-size: 24rpx;
		line-height: 1.8;
		color: $font-color-mediumGray;
	}

	.address_empty-card {
		padding: 30rpx;
	}

	.address_empty-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16rpx;
	}

	.address_empty-title {
		font-size: 32rpx;
		font-weight: 700;
		color: $font-color-darkGrey;
	}

	.address_empty-desc {
		margin-top: 14rpx;
		font-size: 24rpx;
		line-height: 1.8;
		color: $font-color-lightGrey;
	}

	.address_empty-action {
		margin-top: 20rpx;
		font-size: 24rpx;
		color: $theme-color;
	}

	.notes_card {
		padding: 10rpx 24rpx;
		margin-top: 18rpx;
	}

	.field_item {
		padding: 22rpx 0;
		border-bottom: 1rpx solid rgba(138, 120, 80, 0.1);

		&:last-child {
			border-bottom: none;
		}
	}

	.notes_field-item {
		padding: 16rpx 0 12rpx;
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
		min-height: 100rpx;
	}

	.notes_textarea {
		height: 100rpx;
		min-height: 100rpx;
		line-height: 36rpx;
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
