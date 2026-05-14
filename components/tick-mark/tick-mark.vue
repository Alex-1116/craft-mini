<template>
  <view class="slider-container">
    <!-- 刻度线背景 -->
    <view class="scale-background">
      <view 
        v-for="i in totalScales" 
        :key="i" 
        class="scale-mark" 
        :style="{
          left: `${(i-1) * scaleWidth}px`,
          height: i % 5 === 0 ? '20px' : '10px',
          background: i === centerScale ? '#f00' : '#999'
        }"
      ></view>
    </view>
    
    <!-- 可滑动区域 -->
    <movable-area class="movable-area" :style="{width: `${totalWidth}px`}">
      <movable-view 
        class="movable-view" 
        direction="horizontal" 
        :x="currentPosition" 
        @change="onSliderChange" 
        @touchend="onSliderEnd"
        :damping="10000"
        :disabled="false"
        :inertia="true"
      >
        <view class="slider-pointer"></view>
      </movable-view>
    </movable-area>
    
    <!-- 当前值显示 -->
    <view class="value-display">当前值: {{currentValue}}°</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      totalScales: 181, // 从-90到90共181个刻度
      scaleWidth: 2, // 每个刻度宽度(px)
      centerScale: 91, // 中心刻度(0度)
      currentPosition: 180, // 初始位置(对应0度)
      currentValue: 0, // 当前值
      minValue: -90, // 最小值
      maxValue: 90 // 最大值
    }
  },
  computed: {
    totalWidth() {
      return (this.totalScales - 1) * this.scaleWidth;
    }
  },
  methods: {
    // 位置转换为值
    positionToValue(pos) {
      const scale = Math.round(pos / this.scaleWidth);
      return scale - (this.centerScale - 1);
    },
    
    // 值转换为位置
    valueToPosition(val) {
      return (val + (this.centerScale - 1)) * this.scaleWidth;
    },
    
    // 滑动变化事件
    onSliderChange(e) {
      const newValue = this.positionToValue(e.detail.x);
      if (newValue !== this.currentValue) {
        this.currentValue = newValue;
      }
    },
    
    // 滑动结束事件
    onSliderEnd() {
      // 确保停在整数刻度位置
      this.currentPosition = this.valueToPosition(this.currentValue);
    }
  }
}
</script>

<style>
.slider-container {
  position: relative;
  width: 100%;
  height: 80px;
  margin-top: 40px;
  overflow: hidden;
}

.scale-background {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: calc(180 * 2px);
  height: 30px;
}

.scale-mark {
  position: absolute;
  bottom: 0;
  width: 1px;
  background: #999;
}

.movable-area {
  height: 50px;
  margin: 0 auto;
}

.movable-view {
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.slider-pointer {
  width: 30px;
  height: 30px;
  background: #007AFF;
  border-radius: 50%;
  position: relative;
}

.slider-pointer::after {
  content: '';
  position: absolute;
  top: -20px;
  left: 14px;
  width: 2px;
  height: 20px;
  background: #007AFF;
}

.value-display {
  text-align: center;
  margin-top: 20px;
  font-size: 16px;
}
</style>