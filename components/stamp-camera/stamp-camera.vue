<template>
	<view class="stamp-camera-container">
		<view class="stamp-camera-window" :class="{ 'show': open }">
			<!-- top -->
			<view class="stamp-camera-top">
				<view class="iconfont icon-dituweizhixinxi_chahao"></view>
				<view class="iconfont icon-icon_shanguangdeng"></view>
			</view>
			<!--  -->
		</view>
	</view>
</template>

<script>
	export default {
		name:"stamp-camera",
		props: {
			open: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				
			};
		},
		mounted() {
			const platform = process.env.UNI_PLATFORM;
			if (platform === 'mp-weixin') {
				
			} else {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	.stamp-camera-container {
		
		.stamp-camera-window {
			width: 100vw;
			height: 100vh;
			background-color: black;
			box-sizing: border-box;
			position: fixed;
			bottom: 0;
			left: 0;
			z-index: 9999;
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
			
			&.show {
				transform: translate3d(0, 0, 0);
				-webkit-transform: translate3d(0, 0, 0);
				-ms-transform: translate3d(0, 0, 0);
				-moz-transform: translate3d(0, 0, 0);
				-o-transform: translate3d(0, 0, 0);
			}
			
			.stamp-camera-top {
				width: 100%;
				height: 100rpx;
				background-color: #ffffff;
			}
		}
	}
</style>