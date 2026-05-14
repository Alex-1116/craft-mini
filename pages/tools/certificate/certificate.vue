<template>
	<view class="certificate-container">
		<view class="loading" v-if="loading">
			<view class="loading-spinner"></view>
			<text>加载中...</text>
		</view>
		<view class="certificate-list" v-else>
			<view class="empty-tip" v-if="certData.length === 0">
				<text>暂无证书数据</text>
			</view>
			<view class="certificate-item" v-for="(item, index) in certData" :key="index">
				<view class="certificate-info">
					<text class="certificate-name">{{ item.name }}</text>
					<text class="certificate-type">{{ getCertTypeName(item.type) }}</text>
					<text class="certificate-expire">有效期至：{{ item.expireDate }}</text>
					<text class="certificate-status"
						:class="{'downloaded': item.isDownloaded}">{{ item.isDownloaded ? '已下载' : '未下载' }}</text>
				</view>
				<view class="certificate-actions">
					<!-- v-if="!item.isDownloaded" -->
					<button class="download-btn" @click="downloadCert(item)">下载证书</button>
					<!-- v-else -->
					<button class="operate-btn" @click="operateCert(item)">操作</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { ref } from 'vue';
	import type { Ref } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import { useCert } from '@/shared/composables/useCert';
	import Api from '@/services/api';
	type Uni = {
		base64ToArrayBuffer(base64: string): ArrayBuffer;
		// 其他 uni 的方法和属性
	} & UniApp.Uni;


	// 当前页面为用户已购买证书列表页，
	// 1. 如果用户在购买证书页面，购买证书之后提供下载操作，那么用户点击下载按钮，调用后端接口获取到密钥，然后进行保存动作，此时，还需要调用后端一个接口，把文件保存的路径传递给后端，保存到数据库，这样证书列表返回的信息就直接有保存到手机系统文件的路径以及下载状态日期等
	// 2. 如果购买证书页面没有提供下载操作，那么用户理论上就应该在证书列表页进行下载，用户点击下载按钮，调用后端接口获取到密钥，然后进行保存动作，此时也需要调用后端一个接口，update，把文件保存的路径传递给后端，之后再调用 getlist 刷新下列表以更新列表数据即状态日期等

	// 在哪购买证书，，你们的逻辑是下面 第一点还是 第二点 第一种
	// 需要把 保存的路径给 后端吗？ 不需要，点击证书时找手机里有没有存后端返回的名字，如果没有就证明没有下载，此时就需要下载，如果有就下载过来就不管了
	// 把 接口返回数据接口截图发我， 我先去 实现一下试试好, 你先盲点别的 我还没说完，好，，说吧  存的内容是
	// authId授权ID cert客户端证书份额 sign客户端证书签名 mobileFileName是返回来的名字，也要存，这个判断当前的证书有没有下载，就是这样
	// 这里是两个接口吧 一个接口 ，，点错了 但是存的还是这几个，，，，
	// 点击下载 /mobilecert/issuedCert 调用这个接口，，返回了上面的 几个字段 存起来 对吧  yes


	// 验证流程：
	// 1. 先执行下载方法，mock返回结果数据，，downloadCert 的 response 里面随便设置一个 key，，，
	// 2. 控制台拿到打印的路径，，，，把路径填写到 mockCertData 数据对应 id 数据的 filePath 上面
	// 3. 点击操作，拿到读取回来的 key，，，

	// mock证书列表数据
	const mockCertData = ref([
		{
			id: 'cert001',
			name: '个人数字证书',
			type: 'personal',
			expireDate: '2024-12-31',
			isDownloaded: false,
			filePath: 'http://usr/certificate_cert001_1751560773886.key'
		},
		{
			id: 'cert002',
			name: '企业数字证书',
			type: 'enterprise',
			expireDate: '2024-06-30',
			isDownloaded: false,
			filePath: 'http://usr/certificate_cert002_1751561216830.key'
		},
		{
			id: 'cert003',
			name: '签名证书',
			type: 'signature',
			expireDate: '2023-12-31',
			isDownloaded: true,
			filePath: 'mock/path/to/certificate_cert003.key'
		},
		{
			id: 'cert004',
			name: '加密证书',
			type: 'encryption',
			expireDate: '2024-03-31',
			isDownloaded: true,
			filePath: 'mock/path/to/certificate_cert004.key'
		},
		{
			id: 'cert005',
			name: 'SSL证书',
			type: 'ssl',
			expireDate: '2024-09-30',
			isDownloaded: false
		}
	]);

	// 证书类型映射
	const certTypes = {
		personal: '个人证书',
		enterprise: '企业证书',
		signature: '签名证书',
		encryption: '加密证书',
		ssl: 'SSL证书'
	};

	// 获取证书类型名称
	const getCertTypeName = (type) => {
		return certTypes[type] || type;
	};

	/**************************** 证书相关实现 --- start --- ****************************/
	// 使用证书hook
	const {
		saveCertToLocal,
		readCertFromLocal,
		checkPlatformSupport
	} = useCert();


	// 证书列表数据
	const certData = ref<any>([]);
	// 加载状态
	const loading = ref(false);

	// 获取证书列表
	const getCertList = async () => {
		try {
			loading.value = true;
			// const response = await getCertificates();
			// if (response.code === 200) {
			//	loading.value = true;
			// 	certData.value = response.data;
			// } else {
			// 	uni.showToast({
			// 		title: response.message || '获取证书列表失败',
			// 		icon: 'none'
			// 	});
			// }

			// 使用mock数据
			certData.value = mockCertData.value;
		} catch (error) {
			uni.showToast({
				title: '获取证书列表失败',
				icon: 'none'
			});
		} finally {
			loading.value = false;
		};
	};

	// 下载证书
	const downloadCert = async (certItem) => {
		try {
			if (!checkPlatformSupport()) {
				uni.showToast({
					title: '当前平台不支持证书下载',
					icon: 'none'
				});
				return;
			}
			// 调用 /mobilecert/issuedCert 接口
			// const response = await downloadCertificateKey(certItem.id);
			const response = {
				code: 200,
				msg: '下载成功',
				data: {
					certId: 'cert001',   // 证书id
					authId: 'auth001',   // 授权id
					cert: 'sakfhkjdfhajsdfhklasjdf',    // 证书字符
					sign: 'fahskfjdsflkgdlkjgslkjdfd',  // 证书签名
					signatureCertSn: '', // 证书SN
					mobileFileName: 'cert001.key',      // 保存证书份额的文件名
				}
			}

			if (response.code === 200) {
				const { authId, cert, sign, mobileFileName } = response.data;
				const certData = { authId, cert, sign, mobileFileName };

				// 将密钥保存到手机本地文件系统
				const filePath = await saveCertToLocal(certData);
				console.log("filePath------", filePath);

				// TODO：下方逻辑暂时无用 start
				// 更新证书状态和路径（暂时无用）
				// await updateCertStatus(response.data.certId, filePath, true);
				// end

				uni.showToast({
					title: '证书下载成功',
					icon: 'none'
				});

				// 刷新列表
				await getCertList();
			} else {
				uni.showToast({
					title: '下载证书失败',
					icon: 'none'
				});
			}
		} catch (error) {
			uni.showToast({
				title: '下载证书失败',
				icon: 'none'
			});
		}
	};

	// 更新证书状态
	const updateCertStatus = async (certId, filePath, isDownloaded) => {
		try {
			const response = await Api.cert.updateCertificateInfo({
				id: certId,
				filePath: filePath,
				isDownloaded: true
			});
			if (response.code !== 200) {
				uni.showToast({
					title: response.message || '更新证书状态失败',
					icon: 'none'
				});
				return;
			}
			// 刷新证书列表
			getCertList();
		} catch (error) {
			console.error('更新证书状态失败:', error);
		}
	};

	// 操作证书
	const operateCert = async (certItem) => {
		try {
			// 这里使用证书的时候 通过文件名去查找
			// const fileName = certItem.mobileFileName;
			const fileName = 'cert001.key';
			const certData = await readCertFromLocal(fileName);
			console.log('证书数据:', certData);
			console.log('证书cert-----:', certData.cert);
			// 这里可以使用证书数据进行后续操作
			return certData;
		} catch (error) {
			console.error('操作证书失败:', error);
		}
	};


	onLoad(() => {
		// 页面加载时获取证书列表
		getCertList();
	});
	/**************************** 证书相关实现 --- end --- ****************************/
</script>

<style lang="scss">
	.certificate-container {
		padding: 20rpx;

		.loading {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 60rpx 0;

			.loading-spinner {
				width: 60rpx;
				height: 60rpx;
				border: 6rpx solid #f3f3f3;
				border-top: 6rpx solid #007AFF;
				border-radius: 50%;
				animation: spin 1s linear infinite;
				margin-bottom: 20rpx;
			}

			text {
				color: #999;
				font-size: 28rpx;
			}
		}

		@keyframes spin {
			0% {
				transform: rotate(0deg);
			}

			100% {
				transform: rotate(360deg);
			}
		}

		.empty-tip {
			text-align: center;
			padding: 60rpx 0;

			text {
				color: #999;
				font-size: 28rpx;
			}
		}

		.certificate-list {
			.certificate-item {
				background-color: #fff;
				border-radius: 12rpx;
				padding: 20rpx;
				margin-bottom: 20rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.certificate-info {
					.certificate-name {
						font-size: 32rpx;
						color: #333;
						margin-bottom: 10rpx;
						display: block;
						font-weight: bold;
					}

					.certificate-type {
						font-size: 24rpx;
						color: #666;
						margin-bottom: 8rpx;
						display: block;
						text-transform: capitalize;
					}

					.certificate-expire {
						font-size: 24rpx;
						color: #999;
						margin-bottom: 8rpx;
						display: block;
					}

					.certificate-status {
						font-size: 24rpx;
						color: #ff9900;

						&.downloaded {
							color: #4CD964;
						}
					}
				}

				.certificate-actions {

					.download-btn,
					.operate-btn {
						font-size: 24rpx;
						padding: 5rpx 20rpx;
						border-radius: 30rpx;
					}

					.download-btn {
						background-color: #007AFF;
						color: #fff;
					}

					.operate-btn {
						background-color: #4CD964;
						color: #fff;
					}
				}
			}
		}
	}
</style>