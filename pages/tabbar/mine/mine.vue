<template>
	<view class="mine_container">
		<view class="mine_banner mask">
			<hey-carousel :height="450" :carouselData="swiperData" @onImageChange="onImageChange"></hey-carousel>
		</view>
		<view class="mine_user">
			<view class="user-brief Lefted">
				<view class="user-head">
					<image src="https://salephine.asia/img/index/logo.gif" mode=""></image>
				</view>
				<view class="user-info">
					<view class="user-info-top Lefted">
						<text class="name">小白</text><text class="status on">• 在线</text>
					</view>
					<view class="user-info-bottom Lefted">
						<view class="tag">
							<text>优质</text>
						</view>
						<view class="tag">
							<text>官方认证</text>
						</view>
						<view class="tag">
							<text>23</text>
						</view>
						<view class="tag">
							<text>v1001</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="mine__action">
			<view class="action__content">
				<view class="action__item Lefted" @click="checkLogin(goMineInfo)">
					<view class="iconfont icon-person action__icon"></view>
					<view class="action__title">个人信息</view>
					<view class="iconfont icon-arrow-right"></view>
				</view>
				<view class="action__item Lefted" @click="checkLogin(goMessage)">
					<view class="iconfont icon-chat-dot-round action__icon"></view>
					<view class="action__title Betweened">
						<view class="text">消息通知</view>
						<view class="count">10条</view>
					</view>
					<view class="iconfont icon-arrow-right"></view>
				</view>
				<view class="action__item Lefted" @click="goAboutUs">
					<view class="iconfont icon-guanyuwomen action__icon"></view>
					<view class="action__title">关于我们</view>
					<view class="iconfont icon-arrow-right"></view>
				</view>
				<view class="action__item Lefted" @click="goFunction">
					<view class="iconfont icon-gongneng action__icon"></view>
					<view class="action__title">功能列表</view>
					<view class="iconfont icon-arrow-right"></view>
				</view>
			</view>
			<view class="action__content">
				<view class="action__item Lefted" @click="goSetting">
					<view class="iconfont icon-shezhi action__icon"></view>
					<view class="action__title">设置</view>
					<view class="iconfont icon-arrow-right"></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { useStore } from 'vuex';

	const swiperData = [
		{ img: 'https://i2.hdslb.com/bfs/archive/af29cb677d599db4542c0575afd42f872077f03a.png' },
		{ img: 'https://i1.hdslb.com/bfs/archive/d804ba8a5f651e2af51a13c685ffa584da6ccb29.jpg' },
		{ img: 'https://i0.hdslb.com/bfs/archive/f7b885cdf7c3798309d6eb56e312860e72f1d9a0.jpg' },
	];
	const onImageChange = () => { }

	const store = useStore();
	const isLoggedIn = store.getters.isLoggedIn;

	// 校验是否登录
	const checkLogin = (callback : Function) => {
		if (!isLoggedIn) {
			// #ifdef H5
			uni.navigateTo({
				url: '/pages/auth/login',
				animationType: 'zoom-fade-out',
				animationDuration: 200
			})
			// #endif

			// #ifdef MP-WEIXIN
			uni.navigateTo({
				url: '/platforms/mp-weixin/pages/auth/auth',
			})
			// #endif
		} else {
			callback()
		}
	};

	const goMineInfo = () => {
		uni.showToast({
			icon: 'none',
			title: '个人信息'
		})
	}
	const goMessage = () => {
		uni.showToast({
			icon: 'none',
			title: '消息中心'
		})
	}
	const goAboutUs = () => {
		uni.showToast({
			icon: 'none',
			title: '关于我们'
		})
	}
	const goFunction = () => {
		uni.navigateTo({
			url: '/pages/tools/function/function'
		})
	}
	const goSetting = () => {
		uni.showToast({
			icon: 'none',
			title: '设置'
		})
	}
</script>

<style lang="scss">
	page {
		background-color: #f8f8f8;
	}

	.mine_container {
		width: 100%;

		.mine_banner {
			position: relative;

			&.mask {
				&::after {
					content: "";
					position: absolute;
					bottom: 0;
					left: 0;
					width: 100%;
					height: 20%;
					background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0), #dbe3f4);
					filter: blur(20rpx);
					pointer-events: none;
				}
			}
		}

		.mine__action {
			width: 100%;
			height: auto;

			.action__content {
				width: 100%;
				height: auto;
				background-color: $block-bg-white;
				padding: 0 30upx;
				margin-bottom: 30upx;

				.action__item {
					width: 100%;
					height: 110upx;
					border-bottom: 1upx solid $border-color-ee;

					.action__icon {
						width: 50upx;
					}

					.icon-person {
						color: #e0aaff;
					}

					.icon-chat-dot-round {
						color: #ade8f4;
					}

					.icon-guanyuwomen {
						color: #fad2e1;
					}

					.icon-gongneng {
						color: #dbe3f4;
					}

					.icon-shezhi {
						color: #f0efeb;
					}

					.action__title {
						flex: 1;
						font-size: $font-size-28;
						color: $font-color-mediumGray;

						.count {
							font-size: $font-size-28;
							color: $font-color-lightGrey;
						}
					}

					.icon-arrow-right {
						font-size: $font-size-28;
						color: $font-color-lightGrey;
					}
				}

				.action__item:last-child {
					border-bottom: none;
				}
			}
		}
	}

	.mine_user {
		width: 100%;
		height: auto;
		background-color: #dbe3f4;
		padding: 24rpx;

		.user-brief {
			width: 100%;
			height: auto;
			background-color: #ffffff;
			border-radius: 30rpx;
			box-shadow: 0 0 20rpx 5rpx #eeeeee;
			padding: 30rpx;

			.user-head,
			.user-head image {
				width: 138rpx;
				height: 138rpx;
				border-radius: 50%;
				margin-right: 30rpx;
			}

			.user-info {
				padding: 10rpx;
				box-sizing: border-box;

				.user-info-top {
					margin-bottom: 30rpx;

					.name {
						font-size: 30rpx;
						color: #333;
						font-weight: bolder;
					}

					.status {
						font-size: 22rpx;
						margin-left: 10rpx;

						&.on {
							color: #209869;
						}

						&.offline {
							color: #bebebe;
						}
					}
				}

				.user-info-bottom {
					.tag {
						padding: 5rpx 10rpx;
						border-radius: 20rpx;
						margin-right: 15rpx;
						display: flex;

						.icon {
							width: 22rpx;
							height: 22rpx;
							margin-right: 5rpx;
						}

						text {
							font-size: 20rpx;
							color: #fff;
						}

						&:nth-child(1) {
							background: #352680;
						}

						&:nth-child(2) {
							background: #51a8fd;
						}

						&:nth-child(3) {
							background: #fb74d4;
						}

						&:nth-child(4) {
							background: #977efc;
						}
					}
				}
			}
		}
	}
</style>