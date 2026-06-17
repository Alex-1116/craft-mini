<template>
	<scroll-view class="message_container" scroll-y>
		<view class="message_header" :style="{ paddingTop: `${statusBarHeight}px` }">
			<view class="header_caption">INBOX</view>
			<view class="header_title">消息与动态</view>
			<view class="search_box">
				<view class="iconfont icon-search search_icon"></view>
				<input type="text" v-model="searchKey" placeholder="搜索订单消息、品牌通知" placeholder-class="search_placeholder">
				<button class="btn-search btn-active" @click="onSearch">搜索</button>
			</view>
		</view>

		<view class="summary_card">
			<view class="summary_item">
				<text class="summary_value">{{ unreadCount }}</text>
				<text class="summary_label">未读消息</text>
			</view>
			<view class="summary_item">
				<text class="summary_value">{{ messageData.length }}</text>
				<text class="summary_label">全部会话</text>
			</view>
			<view class="summary_item">
				<text class="summary_value">C 端</text>
				<text class="summary_label">当前范围</text>
			</view>
		</view>

		<view class="message_main">
			<view class="section_title">最近消息</view>
			<view v-for="(msg, index) in messageData" :key="index" class="message_block">
				<hey-side-slip style="width: 100%; height: 100%;" :ref="(el: any) => setSlipRef(el, index)" @remove="onRemove(msg)" @closeOther="onCloseOther(index)">
					<view class="message_item">
						<view class="head_box">
							<image class="header" :src="msg.header" mode="aspectFill"></image>
							<view class="reddot Centered" v-if="msg.unRead > 0 && msg.unRead <= 99">{{ msg.unRead }}</view>
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
	</scroll-view>
</template>

<script lang="ts" setup>
	import { computed, ref, reactive, watch } from 'vue';
	import { onShow } from '@dcloudio/uni-app';
	import { friendlyTimeFormat } from '@/shared/utils/dateUtil';

	const statusBarHeight = ref(0);

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

	const unreadCount = computed(() => messageData.value.reduce((sum, item) => sum + item.unRead, 0));

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

	onShow(() => {
		statusBarHeight.value = getApp().globalData?.statusBarHeight; //状态栏高度
	})
</script>

<style lang="scss">
	page {
		background-color: $page-bg-f8;
	}

	.message_container {
		height: 100vh;
	}

	.message_header {
		padding: 34rpx 28rpx;
		background: linear-gradient(180deg, #1b1712 0%, #2a2218 100%);
		border-bottom-left-radius: 34rpx;
		border-bottom-right-radius: 34rpx;
	}

	.header_caption {
		font-size: 20rpx;
		letter-spacing: 5rpx;
		color: rgba(255, 255, 255, 0.58);
	}

	.header_title {
		margin-top: 12rpx;
		font-size: 42rpx;
		font-weight: 700;
		color: $font-color-white;
	}

	.search_box {
		display: flex;
		align-items: center;
		height: 92rpx;
		margin-top: 26rpx;
		padding: 0 20rpx 0 24rpx;
		border-radius: 999rpx;
		background: rgba(255, 255, 255, 0.08);
		border: 1rpx solid rgba(255, 255, 255, 0.1);
	}

	.search_icon {
		font-size: 30rpx;
		color: rgba(255, 255, 255, 0.68);
		margin-right: 18rpx;
	}

	.search_box input {
		flex: 1;
		height: 100%;
		font-size: 28rpx;
		color: $font-color-white;
	}

	.search_placeholder {
		color: rgba(255, 255, 255, 0.48);
		font-size: 26rpx;
	}

	.btn-search {
		width: 132rpx;
		height: 64rpx;
		line-height: 64rpx;
		border-radius: 999rpx;
		font-size: 24rpx;
		color: $font-color-white;
		background: linear-gradient(135deg, #9b875a 0%, #75643f 100%);
	}

	.summary_card {
		display: flex;
		margin: 24rpx 28rpx 0;
		padding: 18rpx 0;
		border-radius: 28rpx;
		background: $block-bg-white;
		box-shadow: 0 12rpx 30rpx $shadow-color-soft;
	}

	.summary_item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10rpx;
		padding: 14rpx 0;
	}

	.summary_value {
		font-size: 34rpx;
		font-weight: 700;
		color: $theme-color;
	}

	.summary_label {
		font-size: 22rpx;
		color: $font-color-lightGrey;
	}

	.message_main {
		padding: 28rpx;
	}

	.section_title {
		font-size: 32rpx;
		font-weight: 700;
		color: $font-color-darkGrey;
		margin-bottom: 18rpx;
	}

	.message_block {
		margin-bottom: 18rpx;
		border-radius: 28rpx;
		overflow: hidden;
		box-shadow: 0 12rpx 30rpx $shadow-color-soft;
	}

	.message_item {
		display: flex;
		align-items: center;
		padding: 24rpx;
		background: $block-bg-white;
		position: relative;
	}

	.head_box {
		margin-right: 22rpx;
		position: relative;
	}

	.header {
		width: 100rpx;
		height: 100rpx;
		border-radius: 24rpx;
		background: $block-bg-f8;
	}

	.reddot {
		width: 38rpx;
		height: 38rpx;
		font-size: 20rpx;
		font-weight: 500;
		color: #ffffff;
		background-color: #d95d4e;
		border-radius: 50%;
		position: absolute;
		top: -10rpx;
		right: -10rpx;
	}

	.info_box {
		flex: 1;
	}

	.top {
		.name {
			font-size: 30rpx;
			font-weight: 700;
			color: $font-color-darkGrey;
		}

		.time {
			font-size: 22rpx;
			color: $font-color-lightGrey;
		}
	}

	.content {
		width: 100%;
		font-size: 24rpx;
		color: $font-color-mediumGray;
		margin-top: 12rpx;
	}
</style>
