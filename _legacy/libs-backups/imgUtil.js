export function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

/**
 * 压缩图片
 * @param {*} imgFile 
 * @param {*} quality 压缩质量，0～1
 * @param {*} isBlob 是否格式, blob 或者 base64
 */
export const imgZip = (imgFile, quality, isBlob) => new Promise((resolve, reject) => {
  getBase64(imgFile).then(_64 => {
    let img = new Image();
    img.src = _64;

    img.onload = () => {
      var canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
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
