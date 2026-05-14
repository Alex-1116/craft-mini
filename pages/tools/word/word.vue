<template>
	<view class="container">
		<iframe :src="pdfUrl" width="100%" height="100%"></iframe>
	</view>
</template>

<script>
	// import mammoth from 'mammoth';
	// import html2canvas from 'html2canvas';
	// import jsPDF from 'jspdf';

	export default {
		data() {
			return {
				fileUrl: 'http://static.shanhuxueyuan.com/test6.docx',
				pdfUrl: 'https://signature-service.su.bcebos.com/租赁合同.pdf'
			};
		},

		onLoad() {
			// this.downloadWordFile()
		},

		methods: {
			// 下载word
			async downloadWordFile() {
				try {
					const response = await fetch(this.fileUrl);
					if (!response.ok) {
						throw new Error('下载文件失败');
					}
					// 获取二进制数据
					const arrayBuffer = await response.arrayBuffer();
					// 将 Word 文件转换为 HTML
					const htmlContent = await this.convertWordToHtml(arrayBuffer);
					// 将 HTML 转换为 PDF
					const pdfBlob = await this.convertHtmlToPDF(htmlContent);

					// 处理 PDF 文件
					this.handlePdf(pdfBlob);
				} catch (error) {
					console.error('下载文件失败:', error);
				}
			},

			// 转换html
			async convertWordToHtml(arrayBuffer) {
				try {
					const result = await mammoth.convertToHtml({
						arrayBuffer
					}); // 转换为 HTML
					return result.value; // 返回转换后的 HTML
				} catch (error) {
					console.error('转换失败:', error);
					throw error;
				}
			},

			// 转换pdf
			async convertHtmlToPDF(htmlContent) {
				const container = document.createElement('div');
				container.innerHTML = htmlContent;
				document.body.appendChild(container);

				const canvas = await html2canvas(container);
				const imgData = canvas.toDataURL('image/png');

				const pdf = new jsPDF();
				pdf.addImage(imgData, 'PNG', 0, 0, 210, 297); // A4 尺寸
				document.body.removeChild(container);

				return pdf.output('blob'); // 返回 PDF 文件
			},

			// 处理pdf文件
			handlePdf(pdfBlob) {
				// 生成 PDF 文件的 URL
				this.pdfUrl = URL.createObjectURL(pdfBlob);
				console.log('PDF 文件 URL:', this.pdfUrl);

				// 示例：下载 PDF 文件
				const link = document.createElement('a');
				link.href = this.pdfUrl;
				link.download = 'converted-document.pdf';
				link.click();
			},
		}
	}
</script>

<style lang="scss">
	page {
		width: 100%;
		height: 100%;
	}

	.container {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
	}
</style>