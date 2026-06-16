<template>
	<scroll-view class="address_page" scroll-y>
		<view class="page_nav" :style="{ paddingTop: `${statusBarHeight + 12}px` }">
			<view class="nav_back" @click="goBack">
				<text class="iconfont icon-arrow-left"></text>
			</view>
			<view class="nav_title">收货与联系信息</view>
		</view>

		<view class="content_section" v-if="isLoggedIn">
			<view class="section_header">
				<view>
					<view class="section_caption">Address</view>
					<view class="section_title">地址管理</view>
				</view>
				<view class="header_action" @click="goEditor()">新增地址</view>
			</view>

			<view class="address_card" v-for="item in addressList" :key="item.id">
				<view class="address_top">
					<view class="address_name">
						<text>{{ item.name }}</text>
						<text class="address_phone">{{ formatPhone(item.phone) }}</text>
					</view>
					<text class="address_tag" v-if="item.isDefault">默认</text>
				</view>
				<view class="address_text">{{ item.region }}</view>
				<view class="address_text">{{ item.detail }}</view>
				<view class="address_actions">
					<view class="action_button" @click="goEditor(item.id)">编辑</view>
					<view class="action_button ghost" @click="makeDefault(item.id)" v-if="!item.isDefault">设为默认</view>
					<view class="action_button danger" @click="deleteAddress(item.id)" v-if="addressList.length > 1">删除</view>
				</view>
			</view>

			<view class="info_card" v-if="defaultAddress">
				<view class="info_item">
					<text class="info_label">默认联系人</text>
					<text class="info_value">{{ defaultAddress.name }}</text>
				</view>
				<view class="info_item">
					<text class="info_label">联系电话</text>
					<text class="info_value">{{ formatPhone(defaultAddress.phone) }}</text>
				</view>
				<view class="info_item">
					<text class="info_label">默认收货地址</text>
					<text class="info_value">{{ `${defaultAddress.region} ${defaultAddress.detail}` }}</text>
				</view>
			</view>
		</view>

		<view class="content_section" v-else>
			<view class="empty_card">
				<view class="empty_title">登录后查看收货信息</view>
				<view class="empty_desc">收货地址会用于结算页默认回填，帮助你更快完成下单。</view>
				<button class="empty_button btn-active" @click="goLogin">前往登录</button>
			</view>
		</view>
	</scroll-view>
</template>

<script lang="ts" setup>
	import { computed, ref } from 'vue';
	import { useStore } from 'vuex';
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import Api from '@/services/api';

	interface AddressItem {
		id: string;
		name: string;
		phone: string;
		region: string;
		detail: string;
		isDefault: boolean;
	}

	const store = useStore();
	const statusBarHeight = ref(0);
	const isLoggedIn = computed(() => store.getters.isLoggedIn);
	const addressList = ref<AddressItem[]>([]);
	const defaultAddress = computed(() => addressList.value.find((item) => item.isDefault) || null);
	const loading = ref(false);

	const syncAddresses = async () => {
		if (!isLoggedIn.value) {
			addressList.value = [];
			return;
		}

		loading.value = true;
		try {
			const res = await Api.address.getAddressListApi();
			addressList.value = res?.data || [];
		} catch (error: any) {
			if (error?.status === 401) {
				store.commit('logout');
				addressList.value = [];
			}
		} finally {
			loading.value = false;
		}
	};

	onLoad(() => {
		statusBarHeight.value = getApp().globalData?.statusBarHeight || 0;
		void syncAddresses();
	});

	onShow(() => {
		void syncAddresses();
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
			url: `/pages/auth/login?redirect=${encodeURIComponent('/pages/mine/address/address')}`
		});
	};

	const formatPhone = (phone: string) => {
		const normalizedPhone = phone.replace(/\s+/g, '');
		if (normalizedPhone.length !== 11) {
			return phone;
		}
		return `${normalizedPhone.slice(0, 3)} ${normalizedPhone.slice(3, 7)} ${normalizedPhone.slice(7)}`;
	};

	const goEditor = (id = '') => {
		uni.navigateTo({
			url: `/pages/mine/address-editor/address-editor${id ? `?id=${id}` : ''}`
		});
	};

	const makeDefault = async (id: string) => {
		if (loading.value) {
			return;
		}

		try {
			await Api.address.setDefaultAddressApi(id);
			await syncAddresses();
			uni.showToast({
				icon: 'none',
				title: '已设为默认地址'
			});
		} catch (error: any) {
			if (error?.status === 401) {
				store.commit('logout');
			}
		}
	};

	const deleteAddress = (id: string) => {
		uni.showModal({
			title: '删除地址',
			content: '确认删除这条地址信息吗？',
			success: (res) => {
				if (!res.confirm) {
					return;
				}
				void (async () => {
					try {
						await Api.address.deleteAddressApi(id);
						await syncAddresses();
						uni.showToast({
							icon: 'none',
							title: '地址已删除'
						});
					} catch (error: any) {
						if (error?.status === 401) {
							store.commit('logout');
						}
					}
				})();
			}
		});
	};
</script>

<style lang="scss">
	page {
		background: $page-bg-f8;
	}

	.address_page {
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

	.content_section {
		padding: 28rpx;
	}

	.section_header {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 18rpx;
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

	.header_action {
		padding-bottom: 8rpx;
		font-size: 24rpx;
		color: $theme-color;
	}

	.address_card,
	.info_card,
	.empty_card {
		border-radius: 28rpx;
		background: $block-bg-white;
		box-shadow: 0 12rpx 30rpx $shadow-color-soft;
	}

	.address_card {
		padding: 28rpx;
		margin-bottom: 20rpx;
	}

	.address_top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 18rpx;
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

	.address_text {
		margin-top: 16rpx;
		font-size: 24rpx;
		line-height: 1.8;
		color: $font-color-mediumGray;
	}

	.address_actions {
		display: flex;
		flex-wrap: wrap;
		gap: 16rpx;
		margin-top: 24rpx;
	}

	.action_button {
		min-width: 128rpx;
		height: 68rpx;
		padding: 0 26rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 999rpx;
		background: linear-gradient(135deg, #9b875a 0%, #75643f 100%);
		font-size: 24rpx;
		color: $font-color-white;

		&.ghost {
			background: #f4efe6;
			color: $font-color-mediumGray;
		}

		&.danger {
			background: #f5e9e5;
			color: #aa6a59;
		}
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

	.empty_card {
		padding: 30rpx;
	}

	.empty_title {
		font-size: 34rpx;
		font-weight: 700;
		color: $font-color-darkGrey;
	}

	.empty_desc {
		margin-top: 14rpx;
		font-size: 24rpx;
		line-height: 1.8;
		color: $font-color-lightGrey;
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
</style>
