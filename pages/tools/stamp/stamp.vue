<template>
	<view class="stamp-container">
		<!-- 印章拍摄 -->
		<view class="stamp-shoot">
			<view class="stamp-title">
				<view class="text">印章上传</view>
				<view class="example">印章扫描示例</view>
			</view>
			<view class="stamp-content">
				<view class="shoot" @click="onShoot">﹢</view>
				<view class="tips">（请确保印章图片背景透明）</view>
			</view>

		</view>

		<!-- 印章预览 -->
		<view class="stamp-preview">
			<view class="stamp-title">
				<view class="text">印章预览</view>
			</view>
			<view class="stamp-content">
				<view class="tips">请确保印章边缘对齐参考线边缘</view>
				<view class="picture-canvas">
					<canvas id="stampCanvas" canvas-id="stampCanvas" style="width: 200px; height: 200px;"></canvas>
				</view>
				<view class="picture-preview">
					<image :src="transparentStamp" mode="widthFix" style="width: 100%; height: 100%;"></image>
				</view>
			</view>
			<button class="btn-down btn-active" @click="downloadStamp">下载透明印章</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// canvas 绘制统一使用PX像素
				stampStampCtx: {},
				stampSrc: '', // 原始印章图片
				transparentStamp: '', // 处理后透明背景的图片
			};
		},
		onLoad() {
			// 监听事件
			uni.$on('update-crop-img', this.updateImgData);
		},
		onUnload() {
			// 移除监听
			uni.$off('update-crop-img', this.updateImgData);
		},

		methods: {
			updateImgData(data) {
				this.stampSrc = data;
				this.processStamp(200, 200)
			},

			chooseMedia() {
				return new Promise(resolve => {
					// uni.chooseMedia({
					// 	count: 1,
					// 	mediaType: ['image'],
					// 	sourceType: ['album', 'camera'],
					// 	maxDuration: 10,
					// 	camera: 'back',
					// 	success(res) {
					// 		resolve(res.tempFiles[0].tempFilePath)
					// 	}
					// })
					uni.chooseImage({
						count: 1,
						success(res) {
							resolve(res.tempFilePaths[0])
						}
					})
				})
			},

			onShoot() {
				this.chooseMedia().then(tempPath => {
					uni.navigateTo({
						url: `/pages/tools/clipper/clipper?src=${decodeURIComponent(tempPath)}`,

					})
				})
			},

			// ----- canvas start -----
			/**
			 * 处理印章图片，生成透明背景的印章
			 * @param {number} width - 画布宽度
			 * @param {number} height - 画布高度
			 */
			processStamp(width, height) {
				const ctx = uni.createCanvasContext('stampCanvas', this);
				this.stampStampCtx = ctx;
				try {
					// 1. 绘制透明背景
					ctx.setFillStyle('rgba(0,0,0,0)');
					ctx.fillRect(0, 0, width, height);

					// 2. 绘制原始印章图片
					ctx.drawImage(this.stampSrc, 0, 0, width, height);

					// 3. 执行绘制并处理像素
					ctx.draw(true, () => {
						console.log('图片绘制完成')
						this.processImageData(width, height);
					});
				} catch (error) {
					console.error('绘制印章出错:', error);
					uni.showToast({
						title: '印章处理失败',
						icon: 'none'
					});
				}
			},

			/**
			 * 处理图像数据，精确提取红色印章文字
			 * @param {number} width - 图像宽度
			 * @param {number} height - 图像高度
			 */
			processImageData(width, height) {
				//提取图像RGBA通道颜色值，每连续四个为一个像素点，分别代表RGBA
				uni.canvasGetImageData({
					canvasId: 'stampCanvas',
					x: 0,
					y: 0,
					width,
					height,
					success: (res) => {
						try {
							let pxData = res.data
							let yz = 150
							for (let i = 0; i < pxData.length; i += 4) {
								if (
									pxData[i] > yz &&
									pxData[i + 1] > yz &&
									pxData[i + 2] > yz
								) {
									pxData[i] = 255;
									pxData[i + 1] = 255;
									pxData[i + 2] = 255;
									pxData[i + 3] = 0;
								}
							}
							// TODO 先清空画布后再并绘制，否则使用同一个画布会导致重复绘制
							this.stampStampCtx.clearRect(0, 0, width, height)
							this.stampStampCtx.draw()
							//把处理好的像素点放回到画布中
							setTimeout(() => {
								this.putImageDataBack(width, height, pxData);
							}, 50)
						} catch (error) {
							console.error('处理图像数据出错:', error);
							uni.showToast({
								title: '图像处理失败',
								icon: 'none'
							});
						}
					},
					fail: (err) => {
						console.error('获取图像数据失败:', err);
						uni.showToast({
							title: '获取图像数据失败',
							icon: 'none'
						});
					}
				}, this);
			},

			/**
			 * 将处理后的图像数据放回画布
			 * @param {number} width - 图像宽度
			 * @param {number} height - 图像高度
			 * @param {Uint8ClampedArray} imageData - 图像数据
			 */
			putImageDataBack(width, height, imageData) {
				uni.canvasPutImageData({
					canvasId: 'stampCanvas',
					x: 0,
					y: 0,
					width,
					height,
					data: imageData,
					success: () => {
						this.canvasToTempFilePath();
					},
					fail: (err) => {
						console.error('回写图像数据失败:', err);
						uni.showToast({
							title: '图像处理失败',
							icon: 'none'
						});
					}
				}, this);
			},

			/**
			 * 将画布转换为临时文件路径
			 */
			canvasToTempFilePath() {
				uni.canvasToTempFilePath({
					canvasId: 'stampCanvas',
					success: (res) => {
						this.transparentStamp = res.tempFilePath;
						console.log('透明印章已生成:', res.tempFilePath);
						uni.showToast({
							title: '印章生成成功',
							icon: 'success'
						});
					},
					fail: (err) => {
						console.error('生成临时文件失败:', err);
						uni.showToast({
							title: '生成印章失败',
							icon: 'none'
						});
					}
				}, this);
			},

			/**
			 * 下载印章到相册
			 */
			downloadStamp() {
				if (!this.transparentStamp) {
					uni.showToast({
						title: '请先生成印章',
						icon: 'none'
					});
					return;
				}

				uni.saveImageToPhotosAlbum({
					filePath: this.transparentStamp,
					success: () => {
						uni.showToast({
							title: '保存成功',
							icon: 'success'
						});
					},
					fail: (err) => {
						console.error('保存图片失败:', err);

						// 处理iOS 14+相册权限问题
						if (err.errMsg.includes('auth')) {
							uni.showModal({
								title: '提示',
								content: '需要相册权限才能保存图片',
								confirmText: '去设置',
								success: (res) => {
									if (res.confirm) {
										uni.openSetting();
									}
								}
							});
						} else {
							uni.showToast({
								title: '保存失败',
								icon: 'none'
							});
						}
					}
				});
			},
			// ----- canvas end ----- 
		}
	}
</script>

<style lang="scss">
	page {
		width: 100%;
		height: 100%;
		background-color: #f8f8f8;
	}

	.stamp-container {
		width: 100%;
		height: 100%;
		padding: 30rpx 0;

		.stamp-shoot,
		.stamp-preview {
			width: 100%;
			height: auto;
			background-color: #ffffff;
			margin-bottom: 30rpx;
			@include d-flex;
			flex-direction: column;

			.stamp-title {
				width: 100%;
				height: 88rpx;
				padding: 0 30rpx;
				position: relative;
				@include d-flex-sb;

				.text {
					font-size: 28rpx;
					font-weight: bold;
					color: #333333;
				}

				.example {
					font-size: 24rpx;
					color: blue;
				}
			}

			.stamp-title::after {
				content: '';
				position: absolute;
				left: 30rpx;
				bottom: 0;
				width: calc(100% - 30rpx);
				height: 2rpx;
				background-color: #eeeeee;
			}

			.stamp-content {
				width: 100%;
				height: auto;
				padding: 100rpx 0;
				@include d-flex;
				flex-direction: column;
				gap: 20rpx;

				.shoot {
					width: 200rpx;
					height: 200rpx;
					background-color: rgba(238, 238, 238, .5);
					font-size: 80rpx;
					color: #999999;
					border: 4rpx dashed #eeeeee;
					border-radius: 10rpx;
					@include d-flex;
				}

				.tips {
					font-size: 22rpx;
					color: red;
				}

				.picture-canvas {
					width: 200px;
					height: 200px;
					border: 5rpx solid #ff0000;
					box-sizing: content-box;
				}

				.picture-preview {
					width: 200px;
					height: 200px;
					background-image: url('/static/images/transparent-bg.png');
					background-size: 100% 100%;
					background-repeat: no-repeat;
					background-position: center;
					border: 5rpx solid #ff0000;
					box-sizing: content-box;
				}
			}

			.btn-down {
				width: 300rpx;
				height: 88rpx;
				font-size: 28rpx;
				font-weight: bold;
				color: #ffffff;
				background-color: #1c1d21;
				border: 2rpx solid #313235;
				border-radius: 20rpx;
				margin-bottom: 100rpx;
				@include d-flex;
			}
		}
	}
</style>