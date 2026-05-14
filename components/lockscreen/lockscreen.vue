<template>
	<transition name="slide-up">
		<LockScreenPage v-if="isMounted && open" @cancelLock="emit('update:open')" />
	</transition>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import LockScreenPage from './lockscreen-page.vue';

const props = defineProps({
	open: {
		type: Boolean,
		default: false
	}
})

const emit = defineEmits(['update:open']);

const isMounted = ref(false);
onMounted(() => {
	setTimeout(() => {
		isMounted.value = true;
	});
});
</script>

<style lang="less" scoped>
.slide-up-enter-active {
	animation: slide-up 0.5s;
}

.slide-up-leave-active {
	animation: slide-up 0.5s reverse;
}

@keyframes slide-up {
	0% {
		transform: translateY(-100%);
	}

	100% {
		transform: translateY(0);
	}
}
</style>
