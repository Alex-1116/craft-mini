<template>
	<view>
		<button @click="onChoose">选择图片</button>
		<uploadImg @updateFileList="(val) => {updateFileList(val, item)}"></uploadImg>
	</view>
</template>

<script lang="ts" setup>
	import { imgZip } from "@/shared/utils/imgUtil"
	
	const onChoose = () => {
		uni.chooseImage({
			count: 1, //默认9
			sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album'], // 从相册选择
			success: async function (res) {
				console.log(JSON.stringify(res.tempFilePaths));
				const tempFile = await fetchTempFile(res.tempFilePaths[0])
				if (tempFile) {
					imgZip(tempFile, 0.5, false).then(res => {
						console.log("res-----------", res);
					}).catch(err => {
						console.log(err);
					})
				}
			}
		});
	}
	
	const fetchTempFile = async (tempFilePath: string) => {
	  try {
		const response = await fetch(tempFilePath);
		const blob = await response.blob();
		// 创建 File 对象，假设图片类型为 image/jpeg
		const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
		return file;
	  } catch (error) {
		console.error('从临时路径创建 File 对象失败:', error);
		return null;
	  }
	}
	
	
	const updateFileList = (value, item) => {}
</script>

<style lang="scss">

</style>