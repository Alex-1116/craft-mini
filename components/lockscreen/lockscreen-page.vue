<template>
	<div class="lockscreen" @mousedown.stop @contextmenu.prevent>
		<div class="lock-box">
			<div class="lock">
				<span class="lock-icon" title="解锁屏幕" @click="cancelLock">
					<div class="iconfont icon-lock"></div>
				</span>
			</div>
			<div class="tips">点击解锁</div>
		</div>
		<!-- 小米 / 华为 充电 -->
		<!-- <component :is="BatteryComp" :battery="battery" :battery-status="batteryStatus"
			:calc-discharging-time="calcDischargingTime" /> -->
		<HuaweiCharge v-if="isHuawei" :battery="battery" :battery-status="batteryStatus"
			:calc-discharging-time="calcDischargingTime" />
		<XiaomiCharge v-else :battery="battery" :battery-status="batteryStatus"
			:calc-discharging-time="calcDischargingTime" />
		<div class="local-time">
			<div class="time">{{ hour }}:{{ minute }}</div>
			<div class="date">{{ month }}月{{ day }}号，星期{{ week }}</div>
		</div>
		<div class="computer-status">
			<span :class="{ offline: !online }" class="network">
				<div class="iconfont icon-wifi-outlined"></div>
			</span>
			<div class="iconfont icon-api-outlined"></div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, defineAsyncComponent } from 'vue';
import { useOnline } from '@/shared/composables/useOnline';
import { useTime } from '@/shared/composables/useTime';
import { useBattery } from '@/shared/composables/useBattery';
import HuaweiCharge from './huawei-charge.vue';
import XiaomiCharge from './xiaomi-charge.vue';

const emit = defineEmits(['cancelLock']);
// 获取本地网络状态
const { online } = useOnline();
// 获取本地时间
const { month, day, hour, minute, week } = useTime();
// 获取电池状态
const { battery, batteryStatus, calcDischargingTime } = useBattery();

// TODO 由于小程序不支持动态组件以及jsx、tsx语法，所以需要条件渲染
const BatteryComp = defineAsyncComponent(() => {
	return Math.random() > 0.49 ? import('./huawei-charge.vue') : import('./xiaomi-charge.vue');
});

const isHuawei = ref(Math.random() > 0.49);
/** 取消锁屏 */
const cancelLock = () => {
	emit('cancelLock');
};

</script>

<style lang="scss" scoped>
.lockscreen {
	display: flex;
	position: fixed;
	z-index: 9999;
	inset: 0;
	overflow: hidden;
	background: #000;
	color: white;

	&.unLockLogin {
		background-color: rgb(25 28 34 / 78%);
		backdrop-filter: blur(7px);
	}

	.setting-box,
	.login-box {
		display: flex;
		position: absolute;
		top: 45%;
		left: 50%;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 260px;
		transform: translate(-50%, -50%);

		.username {
			font-size: 22px;
			font-weight: 700;
		}
	}

	.lock-box {
		position: absolute;
		top: 12vh;
		left: 50%;
		transform: translateX(-50%);
		font-size: 34px;

		.tips {
			font-size: 28upx;
			color: white;
			cursor: text;
		}

		.lock {
			display: flex;
			justify-content: center;

			.lock-icon {
				cursor: pointer;

				.anticon-unlock {
					display: none;
				}

				&:hover .anticon-unlock {
					display: initial;
				}

				&:hover .anticon-lock {
					display: none;
				}
			}
		}
	}

	.local-time {
		position: absolute;
		bottom: 60upx;
		left: 60upx;
		font-family: helvetica;

		.time {
			font-size: 70upx;
		}

		.date {
			font-size: 40upx;
		}
	}

	.computer-status {
		position: absolute;
		right: 60px;
		bottom: 60px;
		font-size: 24px;

		.network {
			position: relative;

			&.offline::before {
				content: '';
				position: absolute;
				z-index: 10;
				top: 50%;
				left: 50%;
				width: 2px;
				height: 28px;
				transform: translate(-50%, -50%) rotate(45deg);
				background-color: red;
			}
		}
	}
}
</style>