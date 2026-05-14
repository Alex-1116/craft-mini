<template>
	<view class="headers__container" :style="{'background': background, 'boxShadow': boxShadow, 'position': isFixed}">
		<view class="status__bar" :style="{'height':`${statusBarHeight}px`}"></view>
		<template v-if="!isSearch">
			<view class="navigate__box Lefted" :style="{'height':`${navigateHeight}px`}">
				<view class="iconfont icon-arrow-left Centered" :style="titleStyle" v-if="isBack" @click="back"></view>
				<view class="navigate__title Centered" :style="titleStyle">{{title}}</view>
				<view class="navigate__block"></view>
			</view>
		</template>
		<template v-if="isSearch">
			<!-- #ifdef H5 -->
			<view class="navigate__box Centered"
				:style="{'height':`${navigateHeight}px`}">
				<!-- search__box: 宽度动态计算，此处多减去10为搜索框和胶囊的间距 -->
				<div class="search__box Lefted"
					:style="{'width': `calc(100% - 10px)`, 'height':`${32}px`}">
					<view class="iconfont icon-search"></view>
					<input class="input__srarch" type="text" v-model="keyword" :placeholder="placeholder" @input="handleInput" />
				</div>
			</view>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<view class="navigate__box"
				:style="{'height':`${navigateHeight}px`, 'padding-top':`${capsuleMarginTopByStatusBar}px`}">
				<!-- search__box: 宽度动态计算，此处多减去10为搜索框和胶囊的间距 -->
				<div class="search__box Lefted"
					:style="{'width': `calc(100% - ${capsuleWidth + 10}px)`, 'height':`${capsuleHeight}px`}">
					<view class="iconfont icon-search"></view>
					<input class="input__srarch" type="text" v-model="keyword" :placeholder="placeholder" @input="handleInput" />
				</div>
			</view>
			<!-- #endif -->
		</template>
	</view>
</template>

<script>
	export default {
		name: "HeyHeaders",
		props: {
			// 是否显示返会按钮
			isBack: {
				type: Boolean,
				default: true
			},
			// 标题
			title: {
				type: String,
				default: ''
			},
			// 标题样式
			titleStyle: {
				type: Object,
				default: () => ({
					fontSize: '28rpx',
					color: '#000000' // 设置字体颜色为白色
				})
			},
			// 背景色 参数支持16进制 #ffffff or rgba(255, 255, 255, 1)
			background: {
				type: String,
				default: 'transparent'
			},
			// 是否定位，如无需定位参数传static
			isFixed: {
				type: String,
				default: 'fixed'
			},
			// 是否搜索
			isSearch: {
				type: Boolean,
				default: false
			},
			// 请输入
			placeholder: {
				type: String,
				default: 'search...'
			},
			// 下阴影，如无需下阴影，参数传 none
			boxShadow: {
				type: String,
				default: '0 8rpx 28rpx 0 rgba(0, 0, 0, .12)'
			}
		},
		data() {
			return {
				statusBarHeight: 0, // 状态栏高度
				navigateHeight: 44, // 导航栏高度
				screenHeight: 0, // 屏幕高度
				safeAreaInsetsBottom: 0, // iphone底部虚拟键安全区
				capsuleWidth: 0, // 胶囊宽度
				capsuleHeight: 0, // 胶囊高度
				capsuleMarginTopByStatusBar: 0, // 胶囊距离状态栏的距离
				keyword: '',
			};
		},
		async mounted() {
			await this.fetchSystemInfo();
			// 如果是微信小程序且需要胶囊按钮信息
			if (process.env.UNI_PLATFORM === 'mp-weixin') {
				await this.fetchCapsuleInfo();
			}
		},
		methods: {
			// 获取系统宽高
			async fetchSystemInfo() {
				const systemInfo = await uni.getWindowInfo();
				this.statusBarHeight = systemInfo.statusBarHeight;
				// 网上此计算方式存在误差
				// this.navigateHeight =  (this.menuInfo.top - this.systemInfo.statusBarHeight) * 2 + this.menuInfo.height; //导航栏高度
				// 采用原始计算方式
				// 参考【https://developers.weixin.qq.com/community/develop/article/doc/000a8c989307888cbe1abbf675f413】
				// 计算公式：原生header整体高度 = 状态栏高度 + 44。
				this.navigateHeight = 44; //导航栏高度
				this.screenHeight = systemInfo.screenHeight; //屏幕高度
				this.safeAreaInsetsBottom = systemInfo.safeAreaInsets.bottom; // iphone底部虚拟键安全区
			},
			// 获取微信小程序胶囊宽高
			async fetchCapsuleInfo() {
				const menuInfo = await uni.getMenuButtonBoundingClientRect();
				this.capsuleWidth = menuInfo.width; // 胶囊宽度
				this.capsuleHeight = menuInfo.height; // 胶囊高度
				this.capsuleMarginTopByStatusBar = menuInfo.top - this.statusBarHeight; // 胶囊距离状态栏的距离
			},
			back() {
				uni.navigateBack()
			},
			// 回调方法
			handleInput() {
				this.$emit('handleInput', this.keyword)
			}
		}
	}
</script>

<style scoped>
	@import url('../../static/fonts/iconfont.css');
	/** 基础公共样式 */
	.Lefted {
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.Centered {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.Righted {
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.PR {
		position: relative;
	}

	.PA {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		z-index: -1;
	}

	/** 组件样式 */
	.headers__container {
		width: 100%;
		height: auto;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1000;
		background-color: transparent;
		box-shadow: 0 8rpx 28rpx 0 rgba(0, 0, 0, .12);
	}

	.status__bar {
		width: 100%;
		height: var(--status-bar-height);
	}

	.navigate__box {
		width: 100%;
		height: 88upx;
		padding: 0 20upx;
		box-sizing: border-box;
	}

	.icon-arrow-left {
		width: 36upx;
		height: 100%;
		font-size: 36upx;
		font-weight: 500;
		color: #000000;
	}

	.navigate__title {
		flex: 1;
		height: 100%;
		font-size: 36upx;
	}

	.navigate__block {
		width: 36upx;
		height: 100%;
	}

	.search__box {
		width: 72%;
		height: 64upx;
		background: #F5F5F5;
		border-radius: 32upx;
		padding: 0 20upx;
		box-sizing: border-box;
	}

	.icon-search {
		font-size: 32upx;
		color: #ADADAD;
	}

	.input__srarch {
		flex: 1;
		padding: 0 20upx;
		font-size: 28upx;
		font-weight: 400;
		color: #ADADAD;
	}
</style>