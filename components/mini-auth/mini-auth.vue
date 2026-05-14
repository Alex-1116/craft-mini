<template>
	<view class="miniauthContainer">
		<view class="miniauth-window" :class="{ 'on': open }">
			<view class="title">
				<image class="title-logo" src="/static/images/mini-logo.png" mode=""></image>
				<view class="title-txt">小程序 申请</view>
			</view>
			<view class="notes">
				<view class="notes-top">完善你的昵称、头像</view>
				<view class="notes-bot">注册、登录小程序</view>
			</view>
			<view class="userbox">
				<button class="userbox-arrow-right" type="balanced" open-type="chooseAvatar"
					@chooseavatar="onChooseAvatar">
					<view class="userbox-item">
						<image class="userbox-item-img" :src="displayedAvatar" mode=""></image>
						<view class="userbox-item-txt">点击选择头像</view>
					</view>
				</button>
				<view class="userbox-item">
					<view class="userbox-item-nick">昵称：</view>
					<input class="userbox-item-input" type="nickname" v-model="nickName" @blur="getNickName"
						@input="getNickName" placeholder="请填写昵称">
				</view>
			</view>
			<view class="task-btn">
				<button class="btn btn-active" @click="onCancel">取消</button>
				<button class="btn btn-active login" @click="authorize">登录</button>
			</view>
		</view>
		<view class="mask" @touchmove.prevent :hidden="!open" @click="onCancel"></view>
	</view>
</template>

<script lang="ts" setup>
	import { ref, computed } from 'vue';
	defineOptions({
		name: 'MiniAuth',
	});

	const props = defineProps({
		open: {
			type: Boolean,
			default: false
		}
	});
	const emit = defineEmits(['update:open', 'authorize']);

	const headImg = '/static/images/mini-unhead.png';
	const avatarUrl = ref('');
	const nickName = ref('');
	const displayedAvatar = computed(() => avatarUrl.value || headImg);

	const authorize = async () => {
		if (!avatarUrl.value) {
			uni.showToast({
				title: '请选择头像',
				icon: "none",
				duration: 1500
			})
			return
		}
		nickName.value = nickName.value.trim();
		if (!nickName.value) {
			uni.showToast({
				title: '请填写昵称',
				icon: "none",
				duration: 1500
			})
			return
		}
		uni.showLoading({
			title: "登录中···"
		})
		let userInfo = {
			avatarUrl: avatarUrl.value,
			nickName: nickName.value
		}
		uni.hideLoading()
		emit('authorize', userInfo);
		emit('update:open')
	};
	const getNickName = (e: any) => {
		nickName.value = e.detail.value
	};
	const uploadImg = async (url: string) => {
		avatarUrl.value = url;
	};
	const onChooseAvatar = (e: any) => {
		uploadImg(e.detail.avatarUrl)
	};
	const onCancel = () => {
		emit('update:open')
	};
</script>

<style lang="scss" scoped>
	button {
		padding: 0upx;
		margin: 0upx;
		border: none;
		border-radius: 0upx;
		box-sizing: border-box;
		background-color: transparent;
	}

	button.button-hover {
		transform: translate(3rpx, 3rpx);
		background-color: transparent;
	}

	button::after {
		border: none
	}

	.mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, .5);
		z-index: 99;
	}

	.miniauth-window {
		width: 100%;
		background-color: #fff;
		padding: 40rpx;
		border-radius: 24rpx 24rpx 0 0;
		box-sizing: border-box;
		// box-shadow: 0px 0px 30rpx 30rpx rgba(107,127,153,0.30);
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 6666;
		transform: translate3d(0, 100%, 0);
		-webkit-transform: translate3d(0, 100%, 0);
		-ms-transform: translate3d(0, 100%, 0);
		-moz-transform: translate3d(0, 100%, 0);
		-o-transform: translate3d(0, 100%, 0);
		transition: all .3s cubic-bezier(.25, .5, .5, .9);
		-webkit-transition: all .3s cubic-bezier(.25, .5, .5, .9);
		-ms-transition: all .3s cubic-bezier(.25, .5, .5, .9);
		-moz-transition: all .3s cubic-bezier(.25, .5, .5, .9);
		-o-transition: all .3s cubic-bezier(.25, .5, .5, .9);

		&.on {
			transform: translate3d(0, 0, 0);
			-webkit-transform: translate3d(0, 0, 0);
			-ms-transform: translate3d(0, 0, 0);
			-moz-transform: translate3d(0, 0, 0);
			-o-transform: translate3d(0, 0, 0);
		}

		.title {
			width: 100%;
			padding: 26rpx 0rpx 40rpx;
			box-sizing: border-box;
			overflow: auto;
			display: flex;
			justify-content: flex-start;
			align-items: center;

			.title-logo {
				width: 48rpx;
				height: 48rpx;
				border-radius: 50%;
				margin-right: 10rpx;
			}

			.title-txt {
				font-size: 28rpx;
				font-family: PingFang SC, PingFang SC-Semibold;
				font-weight: bold;
				text-align: left;
				color: #000;
			}
		}

		.notes {
			width: 100%;

			.notes-top {
				width: 100%;
				font-size: 32rpx;
				font-family: PingFang SC, PingFang SC-Semibold;
				font-weight: bold;
				text-align: left;
				color: #000;
				padding: 10rpx 0;
			}

			.notes-bot {
				width: 100%;
				font-size: 26rpx;
				font-family: PingFang SC, PingFang SC-Semibold;
				font-weight: 400;
				text-align: left;
				color: #666;
				padding: 10rpx 0;
			}
		}

		.userbox {
			width: 100%;
			border-top: 1rpx solid #ededed;
			margin: 20rpx 0;

			.userbox-arrow-right {
				border-color: #fff;
				padding: 0rpx !important;
				margin: 0rpx !important;
				border: none !important;
				border-radius: 0rpx !important;
				box-sizing: border-box !important;
				background-color: transparent !important;
			}

			.userbox-item {
				width: 100%;
				height: 125rpx;
				border-bottom: 1rpx solid #ededed;
				overflow: auto;
				display: flex;
				justify-content: flex-start;
				align-items: center;

				.userbox-item-img {
					width: 80rpx;
					height: 80rpx;
					border-radius: 8rpx;
					margin-right: 20rpx;
				}

				.userbox-item-txt {
					font-size: 26rpx;
					font-family: PingFang SC, PingFang SC-Semibold;
					font-weight: 400;
					text-align: left;
					color: #666;
				}

				.userbox-item-nick {
					width: 80rpx;
					height: 80rpx;
					font-size: 26rpx;
					font-family: PingFang SC, PingFang SC-Semibold;
					font-weight: 400;
					text-align: left;
					color: #000;
					margin-right: 20rpx;
					display: flex;
					justify-content: flex-start;
					align-items: center;
				}

				.userbox-item-input {
					flex: 1;
					font-size: 26rpx;
					font-family: PingFang SC, PingFang SC-Semibold;
					font-weight: 400;
					text-align: left;
					color: #000;
				}
			}
		}

		.task-btn {
			width: 100%;
			box-sizing: border-box;
			margin: 90rpx auto;
			padding: 0 80rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.btn {
				width: 240rpx;
				height: 96rpx;
				line-height: 96rpx;
				text-align: center;
				background: #F2F2F2;
				border-radius: 15rpx;
				font-size: 32rpx;
				font-family: PingFang SC, PingFang SC-Regular;
				font-weight: 500;
				text-align: center;
				color: #57be6a;

				&.login {
					background: #57be6a;
					color: #ffffff;
				}
			}
		}
	}
</style>