<template>
	<view class="message_container">
		<view class="search_main">
			<view class="search_box Lefted">
				<view class="iconfont icon-search"></view>
				<input type="text" v-model="searchKey" placeholder="请输入...">
				<button class="btn-search btn-active Centered" @click="onSearch">搜索</button>
			</view>
		</view>
		<view class="message_main">
			<view v-for="(msg, index) in messageData" :key="index">
				<hey-side-slip style="width: 100%; height: 100%;" :ref="(el: any) => setSlipRef(el, index)" @remove="onRemove(msg)" @closeOther="onCloseOther(index)">
					<view class="message_item Lefted">
						<view class="head_box">
							<img class="header" :src="msg.header" alt="" />
							<view class="reddot Centered" v-if="msg.unRead > 0 && msg.unRead <= 99">{{ msg.unRead }}
							</view>
							<view class="reddot Centered iconfont icon-more-filled" v-if="msg.unRead > 99"></view>
						</view>
						<view class="info_box">
							<view class="top Betweened">
								<view class="name">{{ msg.name }}</view>
								<view class="time">{{ friendlyTimeFormat(msg.time) }}</view>
							</view>
							<view class="content one-line-ellipsis">{{ msg.content }}</view>
						</view>
					</view>
				</hey-side-slip>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { ref, reactive, watch } from 'vue';
	import { friendlyTimeFormat } from '@/shared/utils/dateUtil';

	const searchKey = ref('');
	const onSearch = () => {
		uni.showToast({
			icon: 'none',
			title: '请输入关键词！'
		})
	}

	const messageData = ref([
		{
			name: '一杯白开水',
			content: '今天天气不错',
			header: 'https://pic.rmb.bdstatic.com/bjh/240110/news/ba29f51405e5761c44df567a0cf53bd15541.png',
			time: '2024-07-12 16:58:01',
			unRead: 1,
		},
		{
			name: '一杯美式',
			content: '你真好看',
			header: 'https://q0.itc.cn/q_70/images03/20240605/69f9d036627e448aadf180145197f0e5.jpeg',
			time: '2024-07-12 13:14:00',
			unRead: 10,
		},
		{
			name: '一杯奶茶',
			content: '请问，明天几点上班？',
			header: 'https://img0.baidu.com/it/u=4046663391,3831059043&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
			time: '2024-07-09 12:01:32',
			unRead: 100,
		},
		{
			name: '一杯冰块',
			content: '是非成败转头空',
			header: 'https://img1.baidu.com/it/u=5692503,2055794973&fm=253&fmt=auto&app=138&f=JPEG?w=420&h=420',
			time: '2024-07-12 08:32:55',
			unRead: 0,
		}
	]);

	// 使用Map来存储每个滑动条组件的引用
	const slipRefs = reactive(new Map<number, any>());
	// 每当`messageData`更新时，我们也需要更新`slipRefs`中的引用。
	watch(messageData, () => {
		messageData.value.forEach((_, index) => {
			slipRefs.set(index, null); // 初始化或清除旧引用
		});
	}, { deep: true });
	
	// 这个方法将在每次`v-for`循环中被调用，用于设置`ref`。
	const setSlipRef = (el: any, index: number) => {
		if (el) {
			slipRefs.set(index, el);
		}
	};
	
	const onRemove = (item) => { };

	const onCloseOther = (agoIndex: number) => {
		// 关闭除了指定索引外的其他项
		messageData.value.forEach((_, index) => {
			if (index !== agoIndex && slipRefs.has(index)) {
				// 获取 ref 并调用关闭方法, hey-side-slip 组件有 close 方法
				const slipRef = slipRefs.get(index);
				if (slipRef && slipRef.close) {
					slipRef.close();
				}
			}
		});
	};
</script>

<style lang="scss">
	page {
		background-color: #f4f6fa;
	}

	.message_container {

		.search_main {
			width: 100%;
			height: auto;

			padding: 24rpx;

			.search_box {
				width: 100%;
				height: 100rpx;
				background: #ffffff;
				border-radius: 50rpx;
				padding: 0 24rpx;
				box-sizing: border-box;

				.icon-search {
					font-size: 32rpx;
					color: #999999;
					margin-right: 20rpx;
				}

				input {
					flex: 1;
					width: 100%;
					height: 100%;
					font-size: 32rpx;
					color: #333333;
				}

				.btn-search {
					width: 140rpx;
					height: 70rpx;
					font-size: 28rpx;
					color: #fff;
					background: #47cfc8;
					border-radius: 35rpx;
				}
			}
		}

		.message_main {
			width: 100%;
			height: auto;

			.message_item {
				padding: 24rpx;
				position: relative;

				.head_box {
					margin-right: 24rpx;
					position: relative;

					.header {
						width: 100rpx;
						height: 100rpx;
						border-radius: 10rpx;
					}

					.reddot {
						width: 36rpx;
						height: 36rpx;
						font-size: 20rpx;
						font-weight: 500;
						color: #ffffff;
						background-color: #ff0000;
						border-radius: 50%;
						position: absolute;
						top: -18rpx;
						right: -18rpx;
					}
				}

				.info_box {
					flex: 1;

					.top {
						.name {
							font-size: 32rpx;
							font-weight: bold;
							color: #333333;
						}

						.time {
							font-size: 24rpx;
							color: #999999;
						}

					}

					.content {
						width: 100%;
						font-size: 28rpx;
						color: #666666;
						margin-top: 15rpx;
					}
				}
			}


			.message_item::after {
				content: '';
				width: calc(100% - 144rpx);
				border-bottom: 1px solid #eeeeee;
				position: absolute;
				right: 0;
				bottom: 0;
			}

			// .message_item:last-child::after {
			// 	display: none;
			// }
		}
	}
</style>