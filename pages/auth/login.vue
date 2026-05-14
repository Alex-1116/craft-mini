<template>
	<view class="login_container">
		<view class="iconfont icon-close" @click="onClose"></view>
		<view class="login_main">
			<view class="title-box Lefted">
				<view class="FW500 title">登录/注册</view>
			</view>
			<view class="welcome Lefted"> Welcome！ </view>
			<view class="login_form ">
				<view class="form-item Lefted">
					<view class="icon-box Lefted">
						<view class="iconfont icon-iphone icon"></view>
					</view>
					<view class="input-box Lefted">
						<input class="input" type="number" :value="formState.phone" maxlength="11" placeholder="请输入手机号"
							placeholder-class="placeholder" @input="checkPhoneChange" />
					</view>
				</view>
				<view class="form-item Lefted" v-if="isCaptchaLogin">
					<view class="icon-box Lefted">
						<view class="iconfont icon-lock icon"></view>
					</view>
					<view class="input-box Lefted">
						<input class="input" type="password" :value="formState.password" maxlength="12" placeholder="请输入密码"
							placeholder-class="placeholder" />
					</view>
				</view>
				<view class="form-item Lefted" v-if="!isCaptchaLogin">
					<view class="icon-box Lefted">
						<view class="iconfont icon-key icon"></view>
					</view>
					<view class="input-box Lefted">
						<input class="input" type="number" :value="formState.captcha" maxlength="6" placeholder="请输入验证码"
							placeholder-class="placeholder" />
					</view>
					<button class="btn-captcha btn-active Centered" :class="!captchaClassStatus ? 'captcha-bg-1' : 'captcha-bg-2'"
						:disabled="captchaDisabled" @click="getCaptcha">
						{{ captchaTxt }}
					</button>
				</view>
				<view class="switch-pwd Betweened">
					<view class="pwd-txt" @click="onSwitchPwd">{{ !isCaptchaLogin ? '密码登录' : '验证码登录' }}</view>
					<view class="forget-txt" v-show="isCaptchaLogin">密码忘记了？</view>
				</view>
			</view>
			<button class="btn-login btn-active Centered" @click="phoneLoginLocal">登录</button>
			<view class="login_agreement Centered">
				<text>登录/注册代表您已同意</text>
				<text class="txt" @click="goUserServiceAgreement">《用户服务协议》</text>
				<text>和</text>
				<text class="txt" @click="goPrivacyAgreement">《隐私政策》</text>
			</view>
			<view class="login-cutline Betweened">
				<view class="line"></view>
				<view class="txt FW400 txt">or</view>
				<view class="line"></view>
			</view>
			<view class="login_third">
				<view class="Centered child" @click="wechatLoginLocal">
					<view class="iconfont icon-wechat-fill icon"></view>
				</view>
				<view class="Centered child" @click="qqLoginLocal">
					<view class="iconfont icon-qq-fill icon"></view>
				</view>
				<view class="Centered child" @click="appleLoginLocal">
					<view class="iconfont icon-apple-fill icon"></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { ref, watch } from 'vue';

	const formState = ref({
		phone: '',
		password: '',
		captcha: '',
	})
	const isCaptchaLogin = ref(false);
	const captchaDisabled = ref(false);
	const captchaClassStatus = ref(false);
	const captchaTxt = ref('获取验证码');
	const countdown = ref(0);

	watch(countdown, (newValue) => {
		captchaDisabled.value = newValue !== 0;
	});
	
	// 关闭页面
	const onClose = () => uni.navigateBack()
	// 校验手机号
	const checkPhoneChange = () => { };
	// 切换 验证码/密码 登录
	const onSwitchPwd = () => {
		isCaptchaLogin.value = !isCaptchaLogin.value;
	};
	// 获取验证码
	const getCaptcha = () => {
		if (countdown.value === 0) {
			// Start countdown
			countdown.value = 60;
			const timer = setInterval(() => {
				countdown.value--;
				if (countdown.value === 0) {
				clearInterval(timer);
				captchaTxt.value = '重新获取';
				} else {
				captchaTxt.value = `${countdown.value}s`;
				}
			}, 1000);
		}
	};
	// 手机号验证码登录
	const phoneLoginLocal = () => { };
	// 账号密码登录
	const pwdLoginLocal = () => { };
	// 微信登录
	const wechatLoginLocal = () => { };
	// QQ登录
	const qqLoginLocal = () => { };
	// Apple登录
	const appleLoginLocal = () => { };
	// 用户服务协议
	const goUserServiceAgreement = () => { };
	// 隐私政策
	const goPrivacyAgreement = () => { };
</script>

<style lang="scss">
	@import 'login.scss';

	page {
		background: $page-bg-white;
		box-sizing: border-box;
	}
</style>