<template>
	<view>
		<button @click="handleGet">GET</button>
		<button @click="handlePost">POST</button>
		<button @click="handlePut">PUT</button>
		<button @click="handleDelete">DELETE</button>
		<button @click="handleDebounce">测试防抖</button>
		<button @click="handleThrottle">测试节流</button>
		<button @click="handleToast">测试toast</button>
		<button @click="handleModal">测试modal</button>
		<button @click="handleCustomModal">测试customModal</button>
		<button>测试网络：{{ online ? '网络正常' : '网络错误' }}</button>
		<button>time：{{ `${year}-${month}-${day} ${hour}:${minute}:${second}` }}</button>
		<button @click="handleActionSheet">测试ActionSheet</button>
		<!-- #ifndef MP-WEIXIN -->
		<button @click="handleLocked">点击锁屏</button>
		<lockscreen v-model:open="lockVisible"></lockscreen>
		<!-- #endif -->
		<button @click="handleCamera">访问相机</button>
		<button @click="handleBase64">生成base64格式图片</button>
		<button @click="handleList">列表</button>
		<button @click="handleWord">word</button>
		<button @click="handleStamp">印章取图</button>
		<button @click="handleCert">保存密钥</button>
	</view>
</template>

<script lang="ts" setup>
	import { ref } from 'vue';
	import tool from '@/shared/utils/tool';
	import { useOnline } from '@/shared/composables/useOnline';
	import { useTime } from '@/shared/composables/useTime';
	import Api from '@/services/api';
	
	const { online } = useOnline();
	const { year, month, day, hour, minute, second, week } = useTime();

	const handleGet = async () => {
		try{
			const res = await Api.home.testGetApi();
			if (res.code === 200) {
				
			} else {
				
			}
		}catch(e){
			//TODO handle the exception
		}
		console.log('点击了GET------');
	}
	const handlePost = async () => {
		try{
			const res = await Api.home.testPostApi();
			if (res.code === 200) {
				
			} else {
				
			}
		}catch(e){
			//TODO handle the exception
		}
		console.log('点击了POST------');
	}
	const handlePut = async () => {
		try{
			const res = await Api.home.testPutApi();
			if (res.code === 200) {
				
			} else {
				
			}
		}catch(e){
			//TODO handle the exception
		}
		console.log('点击了PUT------');
	}
	const handleDelete = async () => {
		try{
			const res = await Api.home.testDeleteApi();
			if (res.code === 200) {
				
			} else {
				
			}
		}catch(e){
			//TODO handle the exception
		}
		console.log('点击了DELETE------');
	}
	
	const handleDebounce = tool.debounce(() => {
		uni.showToast({
			icon: 'none',
			title: '测试防抖函数输出'
		})
	}, 1000);
	const handleThrottle = tool.throttle(() => {
		uni.showToast({
			icon: 'none',
			title: '测试节流函数输出'
		})
	}, 1000);
	const handleToast = () => {
		const options = {
			title: '111'
		}
		tool.toastTip(options);
	};
	const handleModal = () => {
		const options = {
			title: '111',
			content: '111test'
		}
		tool.showModal(options).then(res => {
			console.log(res);
		}).catch(err => {
			console.log(err);
		});
	};
	const handleCustomModal = () => {
		const options = {
			title: '222',
			content: '222test'
		}
		tool.showCustomModal(options, handleDebounce)
	};
	const handleActionSheet = () => {
		// 弹出系统选择按钮框
		// #ifdef APP-PLUS
		safeActionSheet({
		    title: '提示',
		    cancel: '取消',
		    buttons: [
		        { title: '选项1' },
		        { title: '选项2' },
		        { title: '选项3' }
		    ]
		}, (e) => {
		    console.log('用户选择了:', e.index);
		});
		// #endif
		// #ifndef APP-PLUS
		uni.showActionSheet({
		    itemList: ['选项1', '选项2', '选项3'],
		    success: function (res) {
		        console.log('调用成功', res);
		    },
		    fail: function (err) {
		        console.log('调用失败', err);
		    }
		});
		// #endif
	}
	
	// #ifdef APP-PLUS
	// 定义 actionSheet 参数的类型
	interface ActionSheetOptions {
	    title?: string;
	    cancel?: string;
	    buttons: Array<{ title: string }>;
	}
	
	// 定义 actionSheet 回调函数的类型
	type ActionSheetCallback = (e: { index: number }) => void;
	
	// 创建一个类型安全的 actionSheet 函数
	const safeActionSheet = (options: ActionSheetOptions, callback: ActionSheetCallback): void => {
	    plus.nativeUI.actionSheet({
	        title: options.title,
	        cancel: options.cancel,
	        buttons: options.buttons,
	    }, (e) => {
	        callback({ index: e.index });
	    });
	}
	// #endif
	
	// #ifndef MP-WEIXIN
	const lockVisible = ref(false);
	const handleLocked = () => {
		lockVisible.value = true;
	}
	// #endif
	
	const handleCamera = () => {
		uni.navigateTo({
			url: '/pages/tools/camera/camera'
		})
	}
	
	const handleBase64 = () => {
		uni.navigateTo({
			url: '/pages/tools/base64/base64'
		})
	}
	
	const handleList = () => {
		uni.navigateTo({
			url: '/pages/tools/list/list'
		})
	}
	
	const handleWord = () => {
		uni.navigateTo({
			url: '/pages/tools/word/word'
		})
	}
	
	const handleStamp = () => {
		uni.navigateTo({
			url: '/pages/tools/stamp/stamp'
		})
	}
	
	const handleCert = () => {
		uni.navigateTo({
			url: '/pages/tools/certificate/certificate'
		})
	}
</script>

<style lang="scss">

</style>
