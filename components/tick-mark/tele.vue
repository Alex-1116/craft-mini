<template>
	<!-- 旋转刻度盘 -->
	<view class="rotate-dial">
		<view class="rotate-title">旋转</view>
		<view class="dial-main">
			<view class="precision-line"></view>
			<view class="dial-scroll">
				<view class="dial-item" v-for="(t, index) in totalTicks" :key="index">
					<view class="scale-line"></view>
					<view class="text" v-if="tickValues.includes(t)">{{ `${t}°` }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
				dialRange: [-30, 30], // 刻度线取值范围
			}
		},
		computed: {
			// 计算总刻度数（61个点表示-30到30）
			totalTicks() {
				const [start, end] = this.dialRange; // 解构获取-30和30
				return Array.from({
						length: end - start + 1
					}, // 创建61个元素的空数组
					(_, index) => start + index // 填充-30到30的值
				);
			},
			// 计算能被10整除的刻度值（用于显示文本标签）
			tickValues() {
				const [min, max] = this.dialRange; // [-30, 30]
				const values = [];
			
				// 从min到max，找出所有能被10整除的数
				for (let i = min; i <= max; i++) {
					if (i % 10 === 0) {
						values.push(i);
					}
				}
			
				return values; // 结果: [-30, -20, -10, 0, 10, 20, 30]
			},
		}
	}
	
</script>

<style>
	
	.rotate {
		.rotate-title {
			width: 100%;
			height: 100rpx;
			font-size: 28rpx;
			color: #fafbfe;
			padding: 0 30rpx;
			@include d-flex-sb;
		}
	}
	
	.rotate-dial {
		position: relative;
	
		.rotate-title {
			width: 100%;
			height: 100rpx;
			font-size: 28rpx;
			color: #fafbfe;
			padding: 0 30rpx;
			@include d-flex-sb;
		}
	
		.dial-main {
			position: relative;
	
			.precision-line {
				width: 5rpx;
				height: 38rpx;
				background-color: #ea445a;
				border: 1rpx solid #ea445a;
				border-radius: 2rpx;
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				margin: auto;
			}
		}
	
		.dial-scroll {
			overflow-x: scroll;
			display: flex;
			align-items: center;
			flex-wrap: nowrap;
			gap: 12rpx;
	
			.dial-item {
				width: 6rpx;
				height: 50rpx;
				display: flex;
				@include d-flex-sb;
				flex-direction: column;
	
				.scale-line {
					width: 4rpx;
					height: 18rpx;
					background-color: #656566;
					border: 1rpx solid #656566;
					border-radius: 2rpx;
				}
	
				.text {
					font-size: 18rpx;
					color: #656566;
				}
			}
	
			.dial-item:nth-child(10n + 1) {
				.scale-line {
					background-color: #e7e7e7;
					border: 1rpx solid #e7e7e7;
				}
			}
		}
	}
	
</style>