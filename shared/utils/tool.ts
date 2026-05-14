type DebouncedFunction<T extends unknown[]> = (...args: T) => void;
type ThrottledFunction<T extends unknown[]> = (...args: T) => void;
type ModalCallback = (arg?: any) => void;
interface ModalOptions {
	title: string; // 标题
	content: string; // 文本内容
	cancelText?: string; // 取消按钮文字
	confirmText?: string; // 确定按钮文字
	showCancel?: boolean; // 是否展示取消按钮
	cancelColor?: string; // 取消按钮颜色
	confirmColor?: string; // 确定按钮颜色
}
interface ToastOptions {
	title?: string;
	icon?: 'none' | 'success' | 'loading' | 'error' | 'fail' | 'exception';
	duration?: number;
}

const tool = {
	/**
	 * @description 校验手机号码格式
	 * @param phone 
	 * @returns 
	 */
	isPhoneAvailable(phone: string) {
		const phonePattern = /^[1][3-9][0-9]{9}$/;
		return phonePattern.test(phone);
	},

	/**
	 * @description 判断字符串是否是base64
	 * @param {string} str
	 */
	isBase64(str: string): boolean {
		if (str === '' || str.trim() === '') {
			return false;
		}
		try {
			return btoa(atob(str)) == str;
		} catch (err) {
			return false;
		}
	},

	/**
	 * @description 随机生成颜色
	 * @param {string} type
	 * @return {string}
	 */
	randomColor(type: 'rgb' | 'hex' | 'hsl'): string {
		switch (type) {
			case 'rgb':
				return window.crypto.getRandomValues(new Uint8Array(3)).toString();
			case 'hex':
				return `#${Math.floor(Math.random() * 0xffffff)
					.toString(16)
					.padStart(6, `${Math.random() * 10}`)}`;
			case 'hsl':
				// 在25-95%范围内具有饱和度，在85-95%范围内具有亮度
				return [360 * Math.random(), `${100 * Math.random()}%`, `${100 * Math.random()}%`].toString();
		}
	},

	/**
	 * @description 复制文本
	 * @param text
	 */
	copyText(text: string): void {
		const copyInput = document.createElement('input'); //创建一个input框获取需要复制的文本内容
		copyInput.value = text;
		document.body.appendChild(copyInput);
		copyInput.select();
		document.execCommand('copy');
		copyInput.remove();
	},



	/**
	 * @description 将一维数组转成树形结构数据
	 * @param items 一维数组数据
	 * @param parentId 父级ID，默认为0，表示根节点
	 * @param idKey 数据中ID的键名，默认为'id'
	 * @param parentKey 数据中父ID的键名，默认为'parent_id'
	 * @returns 树形结构数据
	 */
	generateTree<T extends { [key: string]: any }>(
		items: T[],
		parentId: number = 0,
		idKey: keyof T = 'id',
		parentKey: keyof T = 'parent_id'
	): T[] {
		return items
			.filter((item) => item[parentKey] === parentId)
			.map((item) => ({
				...item,
				// 假设slots是为了某种UI框架准备的，如果这不是你的用例，请忽略或调整这部分
				// slots: { title: 'name' }, // 这行可以根据实际情况调整或移除
				children: this.generateTree(items, item[idKey], idKey, parentKey),
			}));
	},

	/**
	 * @description 函数防抖，通过延迟执行事件处理函数来限制事件的连续触发，只有等待一定的时间间隔后，才会执行最后一次触发的操作。
	 * @param fn 
	 * @param delay 
	 * @returns 
	 */
	debounce<T extends unknown[]>(fn: DebouncedFunction<T>, delay: number): DebouncedFunction<T> {
		let timer: number | null = null;

		return function (this: ThisParameterType<DebouncedFunction<T>>, ...args: T) {
			if (timer) {
				clearTimeout(timer);
			}
			timer = setTimeout(() => {
				fn.apply(this, args);
			}, delay);
		} as DebouncedFunction<T>;
	},

	/**
	 * @description 函数节流，通过限制事件处理函数的执行频率来避免频繁触发事件而导致的性能问题。节流函数确保在一定的时间间隔内，事件处理函数最多执行一次。
	 * @param fn 
	 * @param delay 
	 * @returns 
	 */
	throttle<T extends unknown[]>(fn: ThrottledFunction<T>, delay: number): ThrottledFunction<T> {
		let lastExecutionTime = 0; // 记录上次执行时间
		let timer: number | null = null;

		return function (this: ThisParameterType<ThrottledFunction<T>>, ...args: T) {
			const now = Date.now();
			const timeSinceLastExecution = now - lastExecutionTime; // 计算间隔时间

			if (!timer && timeSinceLastExecution >= delay) {
				lastExecutionTime = now;
				fn.apply(this, args);
			} else if (!timer) {
				timer = setTimeout(() => {
					lastExecutionTime = now;
					fn.apply(this, args);
					timer = null;
				}, delay - timeSinceLastExecution);
			}
		} as ThrottledFunction<T>;
	},

	/**
	 * @description 显示模态弹窗
	 * @param options 参数
	 * @returns 
	 */
	showModal(options: ModalOptions): Promise<boolean> {
		return new Promise((resolve, reject) => {
			uni.showModal({
				...options,
				success: (res: any) => {
					resolve(res.confirm);
				},
				fail: (err: any) => {
					reject(err);
				},
			});
		});
	},

	/**
	 * @description 自定义模态弹窗
	 * @param options 参数
	 * @param fn 回调
	 * @param arg 形式参数
	 */
	showCustomModal(options: ModalOptions, fn: ModalCallback, arg?: any) {
		uni.showModal({
			...options,
			success: (res: any) => {
				if (res.confirm) {
					fn(arg);
				} else {
					uni.showToast({
						title: '您已取消操作!',
						icon: 'none',
						duration: 1000,
					});
				}
			},
		});
	},

	/**
	 * @description toast提示
	 * @param options 参数
	 */
	toastTip(options?: ToastOptions): void {
		uni.showToast({
			title: options?.title || '网络连接超时，请稍后重试!',
			icon: options?.icon || 'none',
			duration: options?.duration || 1500,
		});
	}
}

export default tool;