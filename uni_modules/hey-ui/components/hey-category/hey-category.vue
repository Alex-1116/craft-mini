<template>
	<view class="category_container">
		<view class="category_main">
			<view class="category_item animation-slide-bottom" :style="{ 'animation-delay': `${index * 0.1}s` }"
				v-for="(item, index) in categoryData" :key="index" :data-name="item.text" @click="handleCategory(item)">
				<image class="icon" :src="item.imageUrl" mode="aspectFit"></image>
				<text class="text Centered">{{item.text}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'HeyCategory',
		props: {
			categoryData: {
				type: Array,
				default: () => []
			}
		},
		data() {
			return {

			}
		},
		methods: {
			handleCategory(item) {
				this.$emit('on-category-change', item)
			}
		}
	}
</script>

<style scoped>
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

	/** 组件样式 */
	.category_container {
		width: 100%;
		height: auto;
	}

	.category_main {
		width: 100%;
		height: auto;
		display: flex;
		flex-wrap: wrap;
		background-color: aliceblue;
		padding: 20upx 10upx;
		box-sizing: border-box;
	}

	.category_item {
		width: 25%;
		height: auto;
		display: flex;
		flex-direction: column;
		padding: 20upx 0;
	}

	.icon {
		width: 60rpx;
		height: 60rpx;
		margin: 0 auto;
	}

	.text {
		font-size: 28upx;
		font-weight: bold;
		color: #000;
		margin-top: 20rpx;
	}

	/** animation */
	.animation-slide-bottom {
		animation-name: slide-bottom;
		animation-duration: .5s;
		animation-timing-function: ease-out;
		animation-fill-mode: both
	}

	@keyframes slide-bottom {
		0% {
			opacity: 0;
			transform: translateY(100%)
		}

		100% {
			opacity: 1;
			transform: translateY(0)
		}
	}
</style>