<template>
	<!-- 使用说明：关于hey-lunbo组件，使用时请在 App.vue 文件引入相关样式 -->
	<!-- @import url(./uni_modules/hey-ui/static/style/main.css); -->
	<view class="lunbo_container">
		<swiper 
			class="card-swiper" 
			:class="dotStyle ? 'square-dot' : 'round-dot'"
			:indicator-dots="indicatorDots" 
			:circular="circular" 
			:autoplay="autoplay" 
			:interval="interval" 
			:duration="duration" 
			:indicator-color="indicatorColor" 
			:indicator-active-color="indicatorActiveColor" 
			:previous-margin="previousMargin"
			:next-margin="nextMargin"
			@change="swiperChange"
		>
		  <swiper-item :class="{ 'cur': current === index }" v-for="(item, index) in lunboData" :key="index">
		    <view class="swiper-item">
		      <image :src="formatImgPath(item.img)" mode="aspectFill" @click.stop="onImageClick(item)"></image>
		    </view>
		  </swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		name: 'HeyLunbo',
		props: {
			lunboData: {
				type: Array,
				default: () => []
			},
			lunboOptions: {
				type: Object,
				default: () => ({
					indicatorDots: true,
					circular: true,
					autoplay: true, // 是否自动切换
					interval: 3000, // 自动切换时间间隔
					duration: 500, // 滑动动画时长
					indicatorColor: '#8799a3',
					indicatorActiveColor: '#0081ff',
					previousMargin: '35px',
					nextMargin: '35px',
				})
			}
		},
		data() {
			return {
				dotStyle: false,
				current: 0,
				...this.lunboOptions,
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
				this.current = e.detail.current;
			},
			
			onImageClick(item) {
				this.$emit('on-image-change', item)
			}
		}
	}
</script>

<style scoped>
	.lunbo_container{
		width: 100%;
		height: auto;
	}
</style>