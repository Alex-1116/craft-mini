<template>
	<view class="editor_page">
		<view class="page_nav" :style="{ paddingTop: `${statusBarHeight}px` }">
			<view class="nav_back" @click="goBack">
				<text class="iconfont icon-arrow-left"></text>
			</view>
			<view class="nav_title">{{ editingId ? '编辑地址' : '新增地址' }}</view>
		</view>

		<view class="content_section">
			<view class="hero_card">
				<view class="hero_caption">Address Editor</view>
				<view class="hero_title">{{ editingId ? '更新收货地址' : '新增收货地址' }}</view>
				<view class="hero_desc">保存后的默认地址会自动回填到结算页，帮助你更快完成下单。</view>
			</view>
		</view>

		<view class="content_section">
			<view class="form_card">
				<view class="field_item">
					<text class="field_label">收货人</text>
					<input v-model="formState.name" class="field_input" placeholder="请输入收货人姓名" placeholder-class="field_placeholder" />
				</view>
				<view class="field_item">
					<text class="field_label">联系电话</text>
					<input v-model="formState.phone" class="field_input" type="number" maxlength="11" placeholder="请输入联系电话" placeholder-class="field_placeholder" />
				</view>
				<view class="field_item">
					<text class="field_label">省市区</text>
					<input v-model="formState.region" class="field_input" placeholder="请输入省市区信息" placeholder-class="field_placeholder" />
				</view>
				<view class="field_item">
					<text class="field_label">详细地址</text>
					<textarea v-model="formState.detail" class="field_textarea" placeholder="请输入街道、门牌等详细信息" placeholder-class="field_placeholder"></textarea>
				</view>
				<view class="default_row" @click="formState.isDefault = !formState.isDefault">
					<view>
						<view class="default_title">设为默认地址</view>
						<view class="default_desc">结算页会优先回填该地址</view>
					</view>
					<view class="default_switch" :class="{ active: formState.isDefault }">
						<view class="default_dot"></view>
					</view>
				</view>
			</view>
		</view>

		<view class="content_section actions_section">
			<button class="submit_button btn-active" @click="submitForm">保存地址</button>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { ref } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import Api from '@/services/api';
	import { ensureSession } from '@/shared/auth/session';

	const statusBarHeight = ref(0);
	const editingId = ref('');
	const redirectTarget = ref('/pages/mine/address-editor/address-editor');
	const isSelectMode = ref(false);
	const redirectUrl = ref('');
	const loading = ref(false);
	const formState = ref({
		name: '',
		phone: '',
		region: '',
		detail: '',
		isDefault: false
	});

	onLoad((options) => {
		statusBarHeight.value = getApp().globalData?.statusBarHeight || 0;
		const id = options?.id || '';
		isSelectMode.value = options?.mode === 'select';
		redirectUrl.value = decodeURIComponent(options?.redirect || '');
		redirectTarget.value = id ? `/pages/mine/address-editor/address-editor?id=${id}` : '/pages/mine/address-editor/address-editor';
		if (!ensureSession(redirectTarget.value, 'redirectTo')) {
			return;
		}
		editingId.value = id;
		if (!id) {
			formState.value.isDefault = true;
			return;
		}
		void loadAddressDetail(id);
	});

	const loadAddressDetail = async (id: string) => {
		try {
			const res = await Api.address.getAddressDetailApi(id);
			const target = res?.data;
			if (!target) {
				uni.showToast({
					icon: 'none',
					title: '地址不存在'
				});
				setTimeout(() => {
					returnToAddressList();
				}, 250);
				return;
			}

			formState.value = {
				name: target.name,
				phone: target.phone,
				region: target.region,
				detail: target.detail,
				isDefault: target.isDefault
			};
		} catch (error) {
			console.error('loadAddressDetail failed', error);
			setTimeout(() => {
				returnToAddressList();
			}, 250);
		}
	};

	const goBack = () => {
		if (getCurrentPages().length > 1) {
			uni.navigateBack();
			return;
		}
		returnToAddressList();
	};

	const returnToAddressList = () => {
		const query = [];
		if (isSelectMode.value) {
			query.push('mode=select');
		}
		if (redirectUrl.value) {
			query.push(`redirect=${encodeURIComponent(redirectUrl.value)}`);
		}
		uni.redirectTo({ url: `/pages/mine/address/address${query.length ? `?${query.join('&')}` : ''}` });
	};

	const submitForm = async () => {
		if (loading.value) {
			return;
		}

		if (!formState.value.name || !/^1\d{10}$/.test(formState.value.phone) || !formState.value.region || !formState.value.detail) {
			uni.showToast({
				icon: 'none',
				title: '请填写完整地址信息'
			});
			return;
		}

		const isEditing = !!editingId.value;
		const payload = {
			name: formState.value.name.trim(),
			phone: formState.value.phone,
			region: formState.value.region.trim(),
			detail: formState.value.detail.trim(),
			isDefault: formState.value.isDefault
		};

		loading.value = true;
		try {
			if (isEditing) {
				await Api.address.updateAddressApi(editingId.value, payload);
			} else {
				await Api.address.createAddressApi(payload);
			}

			uni.showToast({
				icon: 'none',
				title: isEditing ? '地址已更新' : '地址已新增'
			});
			setTimeout(() => {
				goBack();
			}, 250);
		} catch (error) {
			console.error('submitAddress failed', error);
		} finally {
			loading.value = false;
		}
	};
</script>

<style lang="scss">
	page {
		background: $page-bg-f8;
	}

	.editor_page {
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

	.hero_card {
		padding: 32rpx 30rpx;
		border-radius: 30rpx;
		background: linear-gradient(135deg, rgba(44, 34, 24, 0.96) 0%, rgba(28, 22, 17, 0.92) 100%);
		box-shadow: 0 18rpx 40rpx rgba(22, 15, 10, 0.22);
	}

	.hero_caption {
		font-size: 18rpx;
		letter-spacing: 4rpx;
		color: rgba(255, 255, 255, 0.62);
	}

	.hero_title {
		margin-top: 10rpx;
		font-size: 38rpx;
		font-weight: 700;
		color: $font-color-white;
	}

	.hero_desc {
		margin-top: 16rpx;
		font-size: 24rpx;
		line-height: 1.8;
		color: rgba(255, 255, 255, 0.82);
	}

	.form_card {
		padding: 10rpx 24rpx 24rpx;
		border-radius: 28rpx;
		background: $block-bg-white;
		box-shadow: 0 12rpx 30rpx $shadow-color-soft;
	}

	.field_item {
		padding: 22rpx 0;
		border-bottom: 1rpx solid rgba(138, 120, 80, 0.1);
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

	.default_row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20rpx;
		padding: 26rpx 0 6rpx;
	}

	.default_title {
		font-size: 26rpx;
		font-weight: 600;
		color: $font-color-darkGrey;
	}

	.default_desc {
		margin-top: 8rpx;
		font-size: 22rpx;
		color: $font-color-lightGrey;
	}

	.default_switch {
		width: 92rpx;
		height: 54rpx;
		padding: 4rpx;
		display: flex;
		align-items: center;
		border-radius: 999rpx;
		background: #ded6c7;

		&.active {
			justify-content: flex-end;
			background: linear-gradient(135deg, #9b875a 0%, #75643f 100%);
		}
	}

	.default_dot {
		width: 46rpx;
		height: 46rpx;
		border-radius: 50%;
		background: #ffffff;
	}

	.actions_section {
		padding-top: 0;
		padding-bottom: calc(28rpx + env(safe-area-inset-bottom));
	}

	.submit_button {
		width: 100%;
		height: 88rpx;
		line-height: 88rpx;
		border-radius: 999rpx;
		background: linear-gradient(135deg, #9b875a 0%, #75643f 100%);
		color: $font-color-white;
		font-size: 28rpx;
		font-weight: 600;
	}
</style>
