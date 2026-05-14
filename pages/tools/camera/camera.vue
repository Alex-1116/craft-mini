<template>
	<view>
		<camera device-position="back" flash="off" @error="error" style="width: 100%; height: 300px;"></camera>
		<button type="primary" @click="takePhoto">拍照</button>
		<view>预览</view>
		<image mode="widthFix" :src="previewImage"></image>
	</view>
</template>

<script lang="ts" setup>
	import { ref } from 'vue';
	import { uploadFilePromise } from '@/services/http/upload';
	
	const previewImage = ref('');
	
	const takePhoto = async () => {
	    uni.showLoading({
	        title: '识别中..'
	    });
		
	    const ctx = uni.createCameraContext();
	    ctx.takePhoto({
	        quality: 'high',
	        success: async (res) => {
	            uni.hideLoading();
				previewImage.value = res.tempImagePath
	            try {
	                // 使用 await 等待 uploadFilePromise 完成
	                const result = await uploadFilePromise(res.tempImagePath);
	                console.log('result', result);
	            } catch (error) {
	                console.error('上传图片失败:', error);
	            }
	        },
	        fail: (err) => {
	            uni.hideLoading();
	            console.error('拍照失败:', err);
	        }
	    });
	};
	
	const error = (e: { detail: any; }) => {
		console.log(e.detail);
	}
</script>

<style lang="scss">

</style>
