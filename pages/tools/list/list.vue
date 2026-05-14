<template>
	<view class="list_container padding-safe">
		<!-- tabs -->
		<view class="tabs-main">
			<view class="tabs">tabs</view>
		</view>
		<!-- list -->
		<view class="list-main">
			<view class="list-item" v-for="(item, index) in 20" :key="index">{{ `item - ${index}` }}</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	/**
	 * @description uniapp中fixed固定定位在app和h5中的差异bug解决办法
	 * 在uniapp中使用fixed固定顶部后，在h5端会直接与手机的顶部导航栏重合，而app端则不会，
	 * 这是因为h5端的定位参照是以屏幕实际顶部高度来算了的，而app端是以距导航栏的高度计算
	 * @description
	 * 方法1：直接在定位的css里属性top值改为：top: var(--window-top);
	 * 方法2：使用一个高度变量headerTop即可，this.headerTop = document.getElementsByTagName('uni-page-head')[0].offsetHeight+'px'; 算出与导航栏的距离，然后赋值top:headerTop
	 */
	
</script>

<style lang="scss" scoped>
	page {
		background-color: #f8f8f8;
	}
	
	.list_container{
		background-color: #f8f8f8;
		padding-top: 160rpx;
		
		.tabs-main{
			width: 100%;
			height: 160rpx;
			background-color: #f8f8f8;
			position: fixed;
			top: var(--window-top);
			left: 0;
			@include d-flex;
			
			.tabs{
				width: calc(100% - 60rpx);
				height: 100rpx;
				background-color: #ffffff;
				border-radius: 10rpx;
				@include d-flex;
			}
		}
		
		.list-main{
			padding: 0 30rpx;
			.list-item{
				width: 100%;
				height: 88rpx;
				background-color: #ffffff;
				border-radius: 10rpx;
				margin-bottom: 20rpx;
				@include d-flex;
			}
		}
	}
</style>
