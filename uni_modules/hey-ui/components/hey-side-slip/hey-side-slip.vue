<template>
	<movable-area class="side">
		<movable-view class="side__view" :inertia="true" :damping="10" :friction="5" @change="change" @touchend="touchend" direction="horizontal" :x="move">
			<view class="side__con"><slot></slot></view>
			<view id="movable_delete" class="side__del" @tap.stop="remove"><text class="txt">删除</text></view>
		</movable-view>
	</movable-area>
</template>

<script>
export default {
	name: 'HeySideSlip',
	props: {},
	data() {
		return {
			x: 0,
			move: 0,
			open: false
		}
	},
	watch: {},
	mounted() {
		let { windowWidth } = uni.getWindowInfo()
		this.deleteBtnWidth = ((windowWidth || 375) / 375) * 80
	},
	methods: {
		/**
		 * 删除事件
		 */
		remove() {
			this.move = 0
			this.open = false
			
			this.$emit('remove')
		},
		/**
		 * movable-view 滚动监听
		 */
		change(e) {
			this.x = e.detail.x
		},
		/**
		 * movable-view 触摸结束事件
		 */
		touchend() {
			let diff = this.x

			if (!this.open) {
				if (diff < -20) {
					this.move = -this.deleteBtnWidth
					this.open = true
				} else {
					this.move = 0
					this.open = false
				}
			} else {
				if (diff > -this.deleteBtnWidth + 20) {
					this.move = 0
					this.open = false
				} else {
					this.move = -this.deleteBtnWidth
					this.open = true
				}
			}
			
			this.$emit('closeOther')
		},
		
		close() {
			this.move = 0
			this.open = false
		}
	}
}
</script>

<style lang="scss" scoped>
.side {
	width: 100%;
	height: initial;
	position: relative;
	overflow: hidden;

	&__view {
		width: calc(100% + 160rpx);
		height: initial;
		display: flex;
		position: relative;
	}

	&__con {
		flex: 1;
	}

	&__del {
		position: relative;
		width: 160rpx;
		background: red;
		font-size: 30rpx;
		color: #ffffff;

		.txt {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
	}
}
</style>
