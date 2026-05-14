<script lang="ts" setup>
	import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';

	// 定义全局数据结构类型
	interface IGlobalData {
		statusBarHeight?: number; // 状态栏高度
		navigateHeight?: number; // 导航栏高度
		screenHeight?: number; // 屏幕高度
		safeAreaInsetsBottom?: number; // iphone底部虚拟键安全区
		capsuleWidth?: number; // 胶囊宽度
		capsuleHeight?: number; // 胶囊高度
		capsuleMarginTopByStatusBar?: number; // 胶囊距离状态栏的距离
	}

	// 声明一个全局变量来保存全局数据对象
	let app: IGlobalData = {};

	// 初始化全局数据
	onLaunch(async () => {
		console.log('App Launch')
		
		console.log('***********************************************************')
		console.log("******** ╔ ╗ ╔ ╗		╔ ═══╗		╔ ╗ ╔ ╗ ********");
		console.log("******** ║ ║ ║ ║		║ ╔══╝		║ ║ ║ ║ ********");
		console.log("******** ║ ╚ ╝ ║		║ ╚══╗		║ ╚ ╝ ║ ********");
		console.log("******** ║ ╔ ╗ ║		║ ╔══╝		╚ ╗ ╔ ╝ ********");
		console.log("******** ║ ║ ║ ║		║ ╚══╗		║ ║ ║ ║ ********");
		console.log("******** ╚ ╝ ╚ ╝		╚ ═══╝		╚ ╝ ╚ ╝ ********");
		console.log('***********************************************************')
		console.log('``````````````` Uni-Basic-App Beta ```````````````')
		console.log(`About Plugin     %cVersion%cv1.0.0`,
			'background-color: #5ffcef; padding: 7px; color: #fff;',
			'background-color: #ea7ded; color: #fff; padding: 7px;');
		console.log(`About Alex       %c浙江-杭州%c学识尚浅，阅历如初。`,
			'background-color: #5ffcef; padding: 7px; color: #fff;',
			'background-color: #ea7ded; color: #fff; padding: 7px;');
		console.log(`My WeChat        %cWeChat%cfour_this`, 
			'background-color: #5ffcef; padding: 7px; color: #fff;',
			'background-color: #ea7ded; color: #fff; padding: 7px;');
		console.log(`My Github        %chttps://github.com/Alex-1116`,
			'background-color: #5ffcef; color: #fff; padding: 7px;');
		
		await fetchSystemInfo();
		// 如果是微信小程序且需要胶囊按钮信息
		if (process.env.UNI_PLATFORM === 'mp-weixin') {
			await fetchCapsuleInfo();
		}
		getApp().globalData = app;
	});
	onShow(() => {
		console.log('App Show')
	});
	onHide(() => {
		console.log('App Hide')
	});

	// 获取系统宽高
	const fetchSystemInfo = async () => {
		try {
			const systemInfo = uni.getWindowInfo();
			app.statusBarHeight = systemInfo.statusBarHeight;
			// 网上此计算方式存在误差
			// this.navigateHeight =  (this.menuInfo.top - this.systemInfo.statusBarHeight) * 2 + this.menuInfo.height; //导航栏高度
			// 采用原始计算方式
			// 参考【https://developers.weixin.qq.com/community/develop/article/doc/000a8c989307888cbe1abbf675f413】
			// 计算公式：原生header整体高度 = 状态栏高度 + 44。
			app.navigateHeight = 44; //导航栏高度
			app.screenHeight = systemInfo.screenHeight; //屏幕高度
			app.safeAreaInsetsBottom = systemInfo?.safeAreaInsets?.bottom; // iphone底部虚拟键安全区
		} catch (error) {
			console.error('Failed to fetch system info:', error);
		}
	};
	// 获取微信小程序胶囊宽高
	const fetchCapsuleInfo = async () => {
		try {
			const menuInfo = uni.getMenuButtonBoundingClientRect();
			app.capsuleWidth = menuInfo.width; // 胶囊宽度
			app.capsuleHeight = menuInfo.height; // 胶囊高度
			app.capsuleMarginTopByStatusBar = menuInfo.top - (app.statusBarHeight || 0); // 胶囊距离状态栏的距离
		} catch (error) {
			console.error('Failed to fetch system info:', error);
		}
	};
	
	// export default {
	// 	onLaunch: function() {
	// 		console.log('App Launch')
			
	// 		var app = this.globalData;
	// 		// 使用 async/await 处理异步操作，确保在使用结果前已完成获取
	// 		async function initSystemInfo() {
	// 			const res = await uni.getSystemInfo();
				
	// 			app.statusBarHeight = res.statusBarHeight; // 状态栏高度
	// 			app.navigateHeight = 44; // 导航栏高度
	// 			app.screenHeight = res.screenHeight; // 屏幕高度
	// 			app.safeAreaInsetsBottom = res.safeAreaInsets?.bottom; // iPhone底部虚拟键安全区
	// 		}
		
	// 		// 调用异步初始化函数
	// 		initSystemInfo();
			
	// 		// #ifdef MP-WEIXIN
	// 		// 在微信环境中获取胶囊按钮信息
	// 		uni.getMenuButtonBoundingClientRect({
	// 			success(menuInfo) {
	// 				app.capsuleWidth = menuInfo.width; // 胶囊宽度
	// 				app.capsuleHeight = menuInfo.height; // 胶囊高度
	// 				app.capsuleMarginTopByStatusBar = menuInfo.top - app.statusBarHeight; // 胶囊距离状态栏的距离
	// 			}
	// 		});
	// 		// #endif
	// 	},
	// 	onShow: function() {
	// 		console.log('App Show')
	// 		console.log('***********************************************************')
	// 		console.log("******** ╔ ╗ ╔ ╗		╔ ═══╗		╔ ╗ ╔ ╗ ********");
	// 		console.log("******** ║ ║ ║ ║		║ ╔══╝		║ ║ ║ ║ ********");
	// 		console.log("******** ║ ╚ ╝ ║		║ ╚══╗		║ ╚ ╝ ║ ********");
	// 		console.log("******** ║ ╔ ╗ ║		║ ╔══╝		╚ ╗ ╔ ╝ ********");
	// 		console.log("******** ║ ║ ║ ║		║ ╚══╗		║ ║ ║ ║ ********");
	// 		console.log("******** ╚ ╝ ╚ ╝		╚ ═══╝		╚ ╝ ╚ ╝ ********");
	// 		console.log('***********************************************************')
	// 		console.log('``````````````` Uni-Basic-App Beta ```````````````')
	// 		console.log(`About Plugin     %cVersion%cv1.0.0`,
	// 			'background-color: #5ffcef; padding: 7px; color: #fff;',
	// 			'background-color: #ea7ded; color: #fff; padding: 7px;');
	// 		console.log(`About Alex       %c浙江-杭州%c学识尚浅，阅历如初。`,
	// 			'background-color: #5ffcef; padding: 7px; color: #fff;',
	// 			'background-color: #ea7ded; color: #fff; padding: 7px;');
	// 		console.log(`My WeChat        %cWeChat%cfour_this`, 
	// 			'background-color: #5ffcef; padding: 7px; color: #fff;',
	// 			'background-color: #ea7ded; color: #fff; padding: 7px;');
	// 		console.log(`My Github        %chttps://github.com/Alex-1116`,
	// 			'background-color: #5ffcef; color: #fff; padding: 7px;');
	// 	},
	// 	onHide: function() {
	// 		console.log('App Hide')
	// 	}
	// }
</script>

<style lang="scss">
	/* #ifndef APP-NVUE */
	@import url('uni_modules/hey-ui/static/style/main.css');
	@import './static/fonts/iconfont.css';
	@import './static/styles/global.css';
	/* #endif */

	/*每个页面公共css */
	page {
		width: 100%;
		height: 100%;
		margin: 0;
		padding: 0;
		background-color: #ffffff;
	}

	view,
	text,
	image,
	input,
	textarea {
		box-sizing: border-box;
	}
</style>