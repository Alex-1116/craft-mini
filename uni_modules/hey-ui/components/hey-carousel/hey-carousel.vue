<template>
	<view class="carousel_container PR">
		<swiper class="h-swiper" :style="{'height': `${height}rpx`}" circular :autoplay="autoplay" :interval="interval"
			:duration="duration" @change="swiperChange">
			<swiper-item v-for="(item, index) in carouselData" :key="index">
				<view class="h-swiper-img-box">
					<image class="h-swiper-img" mode="" :src="formatImgPath(item.img)" @click.stop="onImageClick(item)"></image>
				</view>
			</swiper-item>
		</swiper>
		<view class="h-swiper-indicator Centered">
			<view class="h-indicator-item-round" :class="{ 'h-indicator-item-round-active': index == current }"
				v-for="(item, index) in carouselData.length" :key="index"></view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "HeyCarousel",
		props: {
			height: {
				type: Number,
				default: 400
			},
			carouselData: {
				type: Array,
				default: () => []
			},
			carouselOptions: {
				type: Object,
				default: () => ({
					autoplay: true, // 是否自动切换
					interval: 3000, // 自动切换时间间隔
					duration: 1500, // 滑动动画时长
				})
			}
		},
		data() {
			return {
				current: 0, // 当前活跃的swiper-item的index
				...this.carouselOptions,
			};
		},
		methods: {
			// 格式化图片路径
			formatImgPath(value) {
				if (!value) {
					return ''; // 对于null、undefined或空字符串，提前返回
				}
				// 如果值是以http或https开头的绝对URL，直接返回
				if (value.startsWith('https:') || value.startsWith('http:')) {
					return value;
				}
				// 移除value开头的斜杠，以避免在最终URL中出现双斜杠
				const cleanedValue = value.replace(/^\//, '');

				return `${baseURL}/${cleanedValue}`;
			},

			swiperChange(e) {
				let current = e.detail.current;
				this.current = current;
			},

			onImageClick(item) {
				this.$emit('on-image-change', item)
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
	.carousel_container {
		width: 100%;
		height: auto;
	}

	.h-swiper {
		width: 100%;
		height: 400upx;
		overflow: hidden;
	}

	.h-swiper-img-box {
		width: 100%;
		height: 100%;
	}

	.h-swiper-img {
		width: 100%;
		height: 100%;
	}

	.h-swiper-indicator {
		width: 100%;
		height: auto;
		padding: 0 24rpx;
		box-sizing: border-box;
		position: absolute;
		bottom: 30upx;
		z-index: 1;
	}

	.h-indicator-item-round {
		width: 14rpx;
		height: 14rpx;
		margin: 0 6rpx;
		border-radius: 7rpx;
		background-color: rgba(0, 0, 0, 0.3);
		transition-property: width, height, background-color;
		transition-duration: 0.3s;
		transition-delay: 0s;
		transition-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1.0);
	}

	.h-indicator-item-round-active {
		width: 34rpx;
		background-color: rgba(255, 255, 255, 0.8);
	}
</style>