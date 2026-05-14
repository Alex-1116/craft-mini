<template>
	<view class="home_container" :style="{'padding-top':`${statusBarHeight + navigateHeight}px`}">
		<view class="svg-container">
			<view class="svg-element"></view>
		</view>
		<!-- 导航栏 -->
		<hey-headers :isBack="false" :title="'今天也要开心噢~'" background="#F8D347" :titleStyle="{ 'color': '#ffffff' }"
			boxShadow="initial"></hey-headers>
		<!-- 轮播 -->
		<hey-lunbo :lunboData="lunboData"></hey-lunbo>
		<!-- 分类 -->
		<hey-category :categoryData="categoryData" @onCategoryChange="onCategoryChange"></hey-category>
		<!-- card -->
		<view class="home_card Lefted">
			<view class="card-item">
				<view class="left-box Centered">左盒子</view>
			</view>
			<view class="card-item Lefted">
				<view class="right-top-box Centered">右上盒子</view>
				<view class="right-bottom-box Centered">右下盒子</view>
			</view>
		</view>
		<!-- tabs -->
		<view class="home_main">
			<view class="main_tabs Betweened">
				<view class="main_tabs-left Lefted">
					<view class="Centered" :class="current === index ? 'tab_item active' : 'tab_item'"
						v-for="(item,index) in tabList" :key="index" @click="onSwitchTabs(item, index)">
						<view>{{ item.name }}</view>
						<view class="line"></view>
					</view>
				</view>
				<view class="main_tabs-right Lefted">
					<view class="txt">更多</view>
					<view class="iconfont icon-arrow-right"></view>
				</view>
			</view>
			<view class="main_list">
				<view class="list_item" v-for="(item, index) in liveData" :key="index" @click="jumpLiveDetails">
					<view class="title-box Betweened">
						<view class="title Lefted">{{ item.title }}</view>
					</view>
					<view class="content-box Lefted">
						<image class="picture" :src="item.picture" mode=""></image>
						<view class="info">
							<view class="desc two-line-ellipsis">{{ item.desc }}</view>
							<view class="badge Lefted">
								<view class="badge-item Centered" v-for="(x, i) in item.badgeList" :key="i">{{ x.name }}
								</view>
							</view>
						</view>
					</view>
					<view class="author-box Betweened">
						<view class="info Lefted">
							<image class="header" :src="item.header" mode=""></image>
							<text>{{ item.author }}</text>
						</view>
						<view class="read Righted">
							<view class="iconfont icon-yanjing"></view>
							<view class="txt">{{ item.read }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- ad -->
		<!-- <ad class="ad" unit-id="adunit-9cc5cfc80c469f08"></ad> -->
	</view>
</template>

<script lang="ts" setup>
	import { ref } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';

	const statusBarHeight = ref<number>(0);
	const navigateHeight = ref<number>(0);
	onLoad(() => {
		statusBarHeight.value = getApp().globalData?.statusBarHeight; //状态栏高度
		navigateHeight.value = getApp().globalData?.navigateHeight; //导航栏高度
	});

	// 轮播
	const lunboData = [
		{ img: 'https://t7.baidu.com/it/u=4240641596,3235181048&fm=193&f=GIF' },
		{ img: 'https://t7.baidu.com/it/u=2291349828,4144427007&fm=193&f=GIF' },
		{ img: 'https://t7.baidu.com/it/u=4036010509,3445021118&fm=193&f=GIF' }
	];

	// 分类
	const categoryData = [{
		imageUrl: '/static/images/category/icon-mairu.png',
		text: '淘好货'
	}, {
		imageUrl: '/static/images/category/icon-jianzhi.png',
		text: '兼职'
	}, {
		imageUrl: '/static/images/category/icon-shiwu.png',
		text: '失物招领'
	}, {
		imageUrl: '/static/images/category/icon-kuaidi.png',
		text: '代取快递'
	}, {
		imageUrl: '/static/images/category/icon-watermark.png',
		text: '图片加水印'
	}, {
		imageUrl: '/static/images/category/icon-fabu.png',
		text: '发布内容'
	}, {
		imageUrl: '/static/images/category/icon-hezuo.png',
		text: '推广合作'
	}, {
		imageUrl: '/static/images/category/icon-jiaoliu.png',
		text: '交流群'
	}];

	const onCategoryChange = (item : any) => {
		uni.showToast({
			icon: 'none',
			title: item.text
		})
	}

	// tabs
	const current = ref(0);
	const tabList = [{
		name: '最新'
	}, {
		name: '全部'
	}, {
		name: '排行'
	}];

	const onSwitchTabs = (item, index) => {
		current.value = index;
	};

	// list
	const liveData = [{
		title: '知其不可奈何而安之若命',
		picture: 'https://tupian.qqw21.com/article/UploadPic/2020-3/202032716363464396.jpg',
		desc: '你可以像盲人解释大海，他们不理解什么是蓝色，但是他们可以理解无尽。',
		badgeList: [{
			name: '励志'
		}, {
			name: '风景'
		}, {
			name: '美女'
		}],
		author: '小白',
		header: 'https://salephine.asia/img/index/logo.gif',
		read: 30
	}]
	
	const jumpLiveDetails = () => {
		uni.navigateTo({
			url: '/pages/home/live-details/live-details'
		})
	}
</script>

<style lang="scss">
	page {
		background-color: #f8f8f8;
	}

	.home_container {
		width: 100%;
		height: auto;
		padding-bottom: var(--window-bottom);

		.svg-container {
			width: 100%;
			height: 500upx;
			position: fixed;
			top: 0;
			z-index: -1;

			.svg-element {
				width: 100%;
				height: 500upx;
				background-color: #F8D347;
				border-radius: 0 0 50% 50% / 0% 0% 15% 15%;
				overflow: hidden;
			}
		}

		.home_card {
			gap: 20rpx;
			padding: 30rpx;
			background-color: #ffffff;

			.card-item {
				width: 50%;
				height: 320rpx;
			}

			.left-box {
				width: 100%;
				height: 100%;
				background-color: #effdff;
				border-radius: 30rpx;
			}

			.card-item:nth-child(2) {
				flex-direction: column;
				gap: 20rpx;
			}

			.right-top-box,
			.right-bottom-box {
				width: 100%;
				height: 50%;
				border-radius: 30rpx;
			}

			.right-top-box {
				background-color: #f8f8f8;
			}

			.right-bottom-box {
				background-color: #fef8f3;
			}
		}

		.home_main {
			width: 100%;
			height: 100%;
			overflow-y: scroll;

			.main_tabs {
				width: 100%;
				padding: 20rpx;

				.main_tabs-left {
					flex: 1;
					height: 80rpx;

					.tab_item {
						width: 120rpx;
						height: 80rpx;
						font-size: $font-size-32;
						font-weight: blod;
						color: $font-color-darkGrey;
						flex-direction: column;

						.line {
							width: 30rpx;
							height: 20rpx;
							border-radius: 90%;
							border-bottom: 4rpx solid transparent;
							transition: all 0.3s linear;
						}

						&.active {
							font-size: $font-size-32;
							font-weight: blod;
							color: #47cfc8;
						}

						&.active .line {
							border-bottom: 4rpx solid #47cfc8;
						}
					}
				}

				.main_tabs-right {

					.txt,
					.icon-arrow-right {
						font-size: 24rpx;
						color: #cccccc;
						margin-bottom: 20rpx;
					}
				}
			}

			.main_list {
				padding: 0 30rpx;

				.list_item {
					background: #ffffff;
					border-radius: 60rpx;
					margin-bottom: 30rpx;
					padding: 30rpx;

					.title-box {
						padding: 0rpx 10rpx;

						.title {
							flex: 1;
							font-size: $font-size-28;
							font-weight: bold;
						}
					}

					.content-box {
						margin-top: 20rpx;

						.picture {
							width: 132rpx;
							height: 132rpx;
							border-radius: 20rpx;
							margin-right: 20rpx;
						}

						.info {
							flex: 1;

							.desc {
								width: 100%;
								font-size: 28rpx;
								color: #999999;
							}

							.badge {
								flex-wrap: wrap;
								margin-top: 20rpx;

								.badge-item {
									font-size: 20rpx;
									background: #dbfcf3;
									border-radius: 10rpx;
									margin-right: 10rpx;
									padding: 5rpx 15rpx;
								}
							}
						}
					}

					.author-box {
						margin-top: 20rpx;

						.info {
							width: 70%;

							.header {
								width: 46rpx;
								height: 46rpx;
								border-radius: 50%;
								margin-right: 20rpx;
							}

							text {
								font-size: 24rpx;
							}
						}

						.read {
							flex: 1;
							font-size: 24rpx;
							color: #999999;

							.icon-yanjing {
								margin-right: 10rpx;
							}
						}
					}
				}
			}
		}

		.ad {
			position: fixed;
			bottom: 0;
		}
	}
</style>