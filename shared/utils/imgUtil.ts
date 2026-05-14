/**
 * 读取文件并返回其 base64 编码
 * 仅 App & H5 支持，mini不支持
 * @param {File} file - 需要读取的文件对象
 * @returns {Promise<string>} - 文件的 base64 编码字符串
 */
export const getBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

/**
 * 压缩图片
 * @param {*} imgFile 
 * @param {*} quality 压缩质量，0～1
 * @param {*} isBlob 是否格式, blob 或者 base64
 */
export const imgZip = (imgFile: File, quality: number, isBlob: boolean) => new Promise((resolve, reject) => {
  getBase64(imgFile).then(_64 => {
    let img = new Image();
    img.src = _64;

    img.onload = () => {
      var canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
	  if (!ctx) {
		reject(new Error('Failed to get 2D rendering context.'));
		return;
	  }
      // canvas.width = 1000 //压缩宽度
      canvas.width = img.width;
      canvas.height = img.height / img.width * canvas.width;

      //利用canvas进行绘图
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      //将img绘制到画布上
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      if (!isBlob) {
        //data url的形式
        resolve(canvas.toDataURL('image/jpeg', quality))
      } else {
        // 返回 Blob 对象
        canvas.toBlob((blob) => {
          resolve(blob)
        }, 'image/jpeg', quality)
      }
    }
  })
})

/**
 * 读取文件并返回其 base64 编码
 * @param {File} file - 需要读取的文件对象
 * @returns {Promise<string>} - 文件的 base64 编码字符串
 */
export const getBase64Mini = (file) => {
  return new Promise((resolve, reject) => {
    const fs = wx.getFileSystemManager();
    const filePath = file.url; // 获取文件路径

    // 读取文件并转换为 base64
    fs.readFile({
      filePath: filePath,
      encoding: 'base64',
      success(res) {
        resolve(`data:image/gif;base64, ${res.data}`);
      },
      fail(error) {
        reject(error);
      }
    });
  });
}

/**
 * 读取文件并返回其 base64 编码
 * @description getFileSystemManager 在移动端需要 uni-appx 才支持
 * @param {File} file - 需要读取的文件对象
 * @returns {Promise<string>} - 文件的 base64 编码字符串
 */
export const getBase64App = (file) => {
	return new Promise((resolve, reject) => {
		const filePath = file.url; // 获取文件路径

		// 压缩图片
		uni.compressImage({
			src: filePath,
			quality: 80, // 压缩质量，范围 0~100
			success: (compressRes) => {
				const compressedFilePath = compressRes.tempFilePath;

				plus.io.resolveLocalFileSystemURL(compressedFilePath, (entry) => {
					// 可通过entry对象操作test.html文件 
					entry.file((file) => {
						let fileReader = new plus.io.FileReader();
						fileReader.onloadend = (evt) => {
							const base64 = evt.target.result;
							resolve(base64)
						}
						fileReader.readAsDataURL(file);
					});
				}, (error) => {
					reject(error)
				});
			},
			fail: (error) => {
				reject(error);
			}
		});
	});
};