<template>
	<view class="steps__container">
		<view class="steps Lefted" ref="stepsRef">
			<view class="step-item animation-slide-bottom PR" :class="{
					'five-sided-shape-1': item.isFinish && index == 0,
					'five-sided-shape-2': item.isFinish && index > 0 && index < useData.length - 1,
					'five-sided-shape-3': item.isFinish && index == useData.length - 1,
					'five-sided-shape-line-1': !item.isFinish && index == 0,
					'five-sided-shape-line-2': !item.isFinish && index > 0 && index < useData.length - 1,
					'five-sided-shape-line-3': !item.isFinish && index == useData.length - 1
				}" :style="{
					'margin-left': index == 0 ? '0' : '-3px',
					'padding': `0 ${padding}px`,
					'animation-delay': `${index * 0.1}s`
				}" v-for="(item, index) in useData" :key="index" @click.stop="onStepClick(item)">
				<view class="PA" :class="{
					'fss-line-block-1': !item.isFinish && index == 0,
					'fss-line-block-2': !item.isFinish && index > 0 && index < useData.length - 1,
					'fss-line-block-3': !item.isFinish && index == useData.length - 1
				}"></view>
				<view class="step-item-name Centered">{{ item.label }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "HeyProgressSteps",
		props: {
			stepsData: {
				type: Array,
				default: () => []
			}
		},
		data() {
			return {
				// 基础数据模板demo
				defaultData: [{
					label: "内审",
					value: 1,
					isFinish: true
				}, {
					label: "出版社反馈",
					value: 2,
					isFinish: true
				}, {
					label: "省局审核",
					value: 3,
					isFinish: true
				}, {
					label: "总局",
					value: 4,
					isFinish: false
				}, {
					label: "版号下发",
					value: 5,
					isFinish: false
				}],
				padding: 0, // 动态计算padding，使元素充满父级div
			};
		},
		computed: {
			useData() {
				return this.stepsData.length ? this.stepsData : this.defaultData;
			}
		},
		mounted() {
			this.calculatePadding();
		},
		methods: {
			calculatePadding() {
				this.$nextTick(async () => {
					// 创建选择器
					const query = uni.createSelectorQuery().in(this);

					// 获取类名为.steps父容器宽度
					const parentBoxWidth = await new Promise(resolve => {
						query.select('.steps').boundingClientRect(stepsRect => {
							resolve(stepsRect.width);
						}).exec();
					});

					// 计算所有step-item的margin 总和，此单位为px单位
					// const allStepMarginTotal = this.useData.slice(1).length * 3;
					const allStepMarginTotal = this.useData.reduce((total, item, index) => {
						if (index > 0) {
							return total + 3;
						} else {
							return total;
						}
					}, 0);

					// 计算所有类名为.steps-item-name的元素的width 总和，此单位为px单位
					const allTitleWidthTotal = await new Promise(resolve => {
						query.selectAll('.step-item-name').boundingClientRect(titleRects => {
							// 计算所有标题的宽度总和
							const totalWidth  = titleRects.reduce((total, rect) => total + rect.width, 0);
							resolve(totalWidth);
						}).exec();
					});
					
					// 计算padding, 单位px, 由于margin是负数，所以此处需要做加法运算
					this.padding = ((parentBoxWidth - allTitleWidthTotal + allStepMarginTotal) / this.useData.length) / 2;
				})
			},
			
			onStepClick(item) {
				this.$emit('on-step-change', item)
			},
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
	.steps__container {
		width: 100%;
		height: auto;
	}

	.steps {
		width: 100%;
		height: auto;
	}

	.step-item {
		width: auto;
		height: 40upx;
		box-sizing: border-box;
	}

	.step-item-name {
		width: 100%;
		height: 100%;
		font-size: 20upx;
		color: #3887FF;
		font-weight: 500;
		white-space: nowrap;
	}

	.five-sided-shape-1 {
		width: auto;
		height: 40upx;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: rgba(56, 135, 255, 0.3);
		clip-path: polygon(0% 0%, calc(100% - 8upx) 0%, 100% 50%, calc(100% - 8upx) 100%, 0% 100%);
	}

	.five-sided-shape-2 {
		width: auto;
		height: 40upx;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: rgba(56, 135, 255, 0.3);
		clip-path: polygon(0% 0%, calc(100% - 8upx) 0%, 100% 50%, calc(100% - 8upx) 100%, 0% 100%, 8upx 50%);
	}

	.five-sided-shape-3 {
		width: auto;
		height: 40upx;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: rgba(56, 135, 255, 0.3);
		clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 8upx 50%);
	}

	.five-sided-shape-line-1 {
		width: auto;
		height: 40upx;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: rgba(56, 135, 255, 0.3);
		clip-path: polygon(0% 0%, calc(100% - 8upx) 0%, 100% 50%, calc(100% - 8upx) 100%, 0% 100%);
	}

	.fss-line-block-1 {
		width: calc(100% - 4upx);
		height: calc(100% - 4upx);
		background-color: #ffffff;
		clip-path: polygon(0% 0%, calc(100% - 8upx) 0%, 100% 50%, calc(100% - 8upx) 100%, 0% 100%);
	}

	.five-sided-shape-line-2 {
		width: auto;
		height: 40upx;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: rgba(56, 135, 255, 0.3);
		clip-path: polygon(0% 0%, calc(100% - 8upx) 0%, 100% 50%, calc(100% - 8upx) 100%, 0% 100%, 8upx 50%);
	}

	.fss-line-block-2 {
		width: calc(100% - 4upx);
		height: calc(100% - 4upx);
		background-color: #ffffff;
		clip-path: polygon(0% 0%, calc(100% - 8upx) 0%, 100% 50%, calc(100% - 8upx) 100%, 0% 100%, 8upx 50%);
	}

	.five-sided-shape-line-3 {
		width: auto;
		height: 40upx;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: rgba(56, 135, 255, 0.3);
		clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 8upx 50%);
	}

	.fss-line-block-3 {
		width: calc(100% - 4upx);
		height: calc(100% - 4upx);
		background-color: #ffffff;
		clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 8upx 50%);
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