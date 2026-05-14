<template>
	<view class="clipper-container">
		<!-- 操作区域 -->
		<view class="clip-main">
			<hey-cropper v-if="imageSrc" ref="cropper" :ratio="ratio" :dWidth="400" :rotate="rotate" fileType="png"
				showGrid @change="onChange" :imageSrc="imageSrc" :mask="mask">
			</hey-cropper>
		</view>

		<!-- 属性区域 -->
		<view class="attr-main">
			<!-- title -->
			<view class="attr-title">裁剪</view>

			<!-- 旋转 -->
			<view class="rotate">
				<view class="rotate-title">旋转</view>
				<slider :min="-30" :max="30" :show-value="true" @changing="onRotate"></slider>
			</view>

			<!-- 裁剪比例 -->
			<view class="ratio">
				<view class="ratio-title">裁剪比例</view>
				<view class="scroller-main">
					<view class="scroller-item" :class="{ active: ratio == 0 }" @click="ratio = 0">
						<view class="item-icon">
							<!-- <view class="icon ratio-1-1"></view> -->
							<view class="iconfont icon-cropfree"></view>
						</view>
						<view class="item-txt">自由</view>
					</view>
					<view class="scroller-item" :class="{ active: activeIndex === index && ratio !== 0 }"
						v-for="(item,index) in ratioList" :key="index" @click="chooseRatio(index)">
						<view class="item-icon">
							<view :class="'icon ratio-' + item.width + '-' + item.height"></view>
						</view>
						<view class="item-txt">{{item.width}}:{{item.height}}</view>
					</view>
				</view>
			</view>

			<!-- btns -->
			<view class="btns">
				<view class="btns-left">
					<button class="btn-class btn-active" @click="onUndo">
						<view class="iconfont icon-zhongzhi"></view>
						<view class="txt">撤销</view>
					</button>
					<button class="btn-class btn-active" @click="chooseImage">
						<view class="iconfont icon-reset"></view>
						<view class="txt">选择</view>
					</button>
				</view>
				<button class="btn-class btn-active" @click="onCrop">
					<view class="iconfont icon-queding1"></view>
					<view class="txt">裁剪</view>
				</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imageSrc: "",
				mask: "", // 蒙版，非黑色区域会裁剪为透明
				// mask: "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-a3b890b4-7cb2-4b29-aa78-e652572bdef6/d6bc69ee-cdc0-4a13-a744-d79db42e0dbe.png",
				dWidth: 500, // 生成的图片的宽度
				rotate: 0, // 旋转角度
				ratio: 1 / 1, // 输出的宽高比例

				activeIndex: 0,
				ratioList: [{
					width: 1,
					height: 1,
				}, {
					width: 9,
					height: 16,
				}, {
					width: 16,
					height: 9,
				}, {
					width: 3,
					height: 4,
				}, {
					width: 4,
					height: 3,
				}, {
					width: 2,
					height: 3,
				}, {
					width: 3,
					height: 2,
				}]
			};
		},
		onLoad(options) {
			this.imageSrc = decodeURIComponent(options.src)
		},

		methods: {
			// 旋转
			onRotate(ev) {
				this.rotate = 360 * (ev.detail.value / 100)
			},

			// 选择比例
			chooseRatio(index) {
				this.activeIndex = index
				let item = this.ratioList[index]
				this.ratio = item.width / item.height
			},

			// 选则图片
			chooseImage() {
				uni.chooseImage({
					count: 1,
					sizeType: ['original'],
					success: (res) => {
						let tempFilePaths = res.tempFilePaths[0]
						this.imageSrc = tempFilePaths
					}
				})
			},

			// 裁剪回调
			onChange(ev) {
				console.log(ev)
			},

			// 重做
			onResume() {
				this.$refs.cropper.resume();
			},

			// 撤销
			onUndo() {
				this.$refs.cropper.undo();
			},

			// 裁剪
			onCrop(cb) {
				this.$refs.cropper.crop().then(path => {
					// 返回上一页并传递参数
					uni.navigateBack({
						delta: 1,
						success() {
							// 通过事件总线传递数据
							uni.$emit('update-crop-img', path);
						}
					});
				})
			},
		}
	}
</script>

<style lang="scss">
	.clipper-container {
		width: 100%;
		height: 100%;
		background-color: #151517;

		.clip-main {
			width: 100%;
			height: 660rpx;
			background-color: #101010;
			flex: 1;
		}

		.attr-main {
			.attr-title {
				position: relative;
				width: 100%;
				height: 100rpx;
				font-size: 28rpx;
				color: #fafbfe;
				border-bottom: 2rpx solid #191b21;
				padding: 0 30rpx;
				@include d-flex-sb;
			}

			.attr-title::after {
				content: '';
				position: absolute;
				left: 30rpx;
				bottom: 0;
				width: 56rpx;
				height: 4rpx;
				background-color: #e9445a;
			}

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

			.ratio {
				.ratio-title {
					width: 100%;
					height: 100rpx;
					font-size: 28rpx;
					color: #fafbfe;
					padding: 0 30rpx;
					@include d-flex-sb;
				}

				.scroller-main {
					width: auto;
					height: 180rpx;
					padding: 0 30rpx;
					overflow-x: scroll;
					display: flex;
					align-items: center;
					flex-wrap: nowrap;
					gap: 30rpx;

					.scroller-item {
						width: auto;
						height: auto;
						@include d-flex;
						flex-direction: column;
						flex-shrink: 0;
						gap: 20rpx;

						.item-icon {
							position: relative;
							width: 110rpx;
							height: 110rpx;
							color: #FFFFFF;
							background-color: #2a2a2d;
							border-radius: 20rpx;
							@include d-flex;

							.icon {
								border-radius: 10rpx;
								border: 4px solid #FFFFFF;
								transform: scale(0.35);
							}

							.ratio-1-1 {
								width: 70%;
								height: 70%;
							}

							.ratio-9-16 {
								width: 56.25%;
								height: 100%;
							}

							.ratio-16-9 {
								width: 100%;
								height: 56.25%;
							}

							.ratio-3-4 {
								width: 75%;
								height: 100%;
							}

							.ratio-4-3 {
								width: 100%;
								height: 75%;
							}

							.ratio-2-3 {
								width: 66.66%;
								height: 100%;
							}

							.ratio-3-2 {
								width: 100%;
								height: 66.66%;
							}
						}

						.item-txt {
							font-size: 22rpx;
							color: #96979f;
						}

						&.active {
							.item-icon::after {
								content: '';
								position: absolute;
								// top: -9rpx;
								// left: -9rpx;
								width: 122rpx;
								height: 122rpx;
								border: 3rpx solid #ffffff;
								border-radius: 26rpx;
							}

							.item-txt {
								font-size: 22rpx;
								font-weight: bold;
								color: #fcfcff;
							}
						}
					}
				}
			}

			.btns {
				padding: 30rpx;
				@include d-flex-sb;

				.btns-left {
					display: flex;
					justify-content: flex-start;
					gap: 20rpx;
				}

				.btn-class {
					width: 120rpx;
					height: 60rpx;
					font-size: 24rpx;
					font-weight: bold;
					color: #ffffff;
					background-color: #1c1d21;
					border: 2rpx solid #313235;
					border-radius: 10rpx;
					@include d-flex;
					gap: 10rpx;
				}
			}
		}
	}
</style>