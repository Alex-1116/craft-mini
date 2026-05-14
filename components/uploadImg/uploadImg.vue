<template>
	<view>
		<up-upload
			 v-if="defaultImg"
			:fileList="fileList"
			@afterRead="afterRead"
			@delete="deletePic"
			name="1"
			multiple
			:maxCount="1"
			:beforeRead="beforeUpload"
		>
			<image :style="{ width: `${props.width }rpx`, height: `${props.height}rpx` }" :src="defaultImg"></image>
		</up-upload>
		<up-upload
			v-else
			:fileList="fileList"
			@afterRead="afterRead"
			@delete="deletePic"
			name="1"
			multiple
			:maxCount="1"
			:beforeRead="beforeUpload"
			:width="props.width"
			:height="props.height"
		></up-upload>
	</view>
</template>

<script setup>
	import { ref, computed } from 'vue';
	import { getBase64, imgZip, getBase64Mini } from '@/shared/utils/imgUtil'
	
	defineOptions({
		name: 'Upload',
	});
	
	const props = defineProps({
		defaultImg: {
			type: String,
			default: false
		},
		width: {
			type: Number,
			default: 74
		},
		height: {
			type: Number,
			default: 74
		}
	})
	const isCustom = computed(() => props.isCustom)
	
	// 子传父
	const emit = defineEmits(['updateFileList']);
	const fileList = ref([])
	
	// 图片上传相关操作
	// 删除图片
	const deletePic = (event) => {
		fileList.value.splice(event.index, 1);
	};
	// 新增图片
	const afterRead = async (event) => {
		// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
		let item = event.file;
		// console.log('111111',item)
		let fileListLen = fileList.value.length;
		fileList.value.push({
			...item,
			status: 'uploading',
			message: '上传中',
		});
		
		try {
			const platform = process.env.UNI_PLATFORM;
			let compressedResult
			if (platform === 'mp-weixin') {
				compressedResult = await getBase64Mini(item[0]);
				console.log(compressedResult);
			} else {
				compressedResult = await imgZip(item[0].file, 0.5, false);
				console.log(compressedResult);
			}
			// const compressedResult = isCustom ? await getBase64(item[0].file) : await imgZip(item[0].file, 0.5, false);
			// console.log('compressedResult',compressedResult)
			let itemToUpdate = fileList.value[fileListLen];
			console.log('itemToUpdate',itemToUpdate)
			fileList.value.splice(fileListLen, 1, {
				...itemToUpdate,
				status: 'success',
				message: '',
				url: compressedResult,
			});
			
			// 此处通过up-upload组件上传成功后，拿到压缩后的图片，通知到父组件
			emit('updateFileList', fileList);
		} catch (error) {
			console.error('压缩错误:', error);
			fileList.value[fileListLen].status = 'failed';
			fileList.value[fileListLen].message = '压缩失败';
		}
	};
	// 图片校验
	const beforeUpload = (file) =>{
		// console.log('filefilefile',file)
		// 检查文件大小
		if(file[0].size > 1 * 1024 * 1024){
			uni.showToast({
				title: '文件大小不能超过1MB',
				icon: 'none',
			});
			return false; // 阻止上传
		}
		// 检查文件类型
		if(!file[0].type.startsWith('image')){
			uni.showToast({
				title: '请上传图片文件',
				icon: 'none',
			});
			return false; // 阻止上传
		}
		return true; // 允许上传
	}
</script>

<style lang="scss">

</style>