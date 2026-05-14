/**
	 * 将秒数转换为 "MM:SS" 格式的字符串
	 * @param seconds 要转换的总秒数
	 * @returns 格式化的时间字符串 "MM:SS"
	 */
export const secondsToTimeFormat = (seconds : number) : string => {
	// MM:SS 计算分钟和秒数
	const mins : number = Math.floor(seconds / 60);
	const secs : number = seconds % 60;

	// 格式化为两位数，不足补零
	const formattedMins : string = mins.toString().padStart(2, '0');
	const formattedSecs : string = secs.toString().padStart(2, '0');

	return `${formattedMins}:${formattedSecs}`;

	// HH:MM:SS
	// const hrs = Math.floor(seconds / 3600);
	// const mins = Math.floor((seconds % 3600) / 60);
	// const secs = seconds % 60;

	// const formattedHrs = hrs.toString().padStart(2, '0');
	// const formattedMins = mins.toString().padStart(2, '0');
	// const formattedSecs = secs.toString().padStart(2, '0');

	// return `${formattedHrs}:${formattedMins}:${formattedSecs}`;
}

/**
 * 开始倒计时
 * @param totalSeconds 倒计时总秒数
 * @param callback 每次更新时的回调函数，接收当前时间字符串
 * @param interval 更新间隔，默认为1000毫秒
 * @returns 返回计时器ID，可用于取消倒计时
 */
export const startCountdown = (
	totalSeconds : number,
	callback : (timeString : string) => void,
	interval : number = 1000
) => {
	let remainingSeconds : number = totalSeconds;

	// 立即显示初始时间
	callback(secondsToTimeFormat(remainingSeconds));

	// 设置定时器
	const timer = setInterval(() => {
		remainingSeconds--;

		if (remainingSeconds >= 0) {
			callback(secondsToTimeFormat(remainingSeconds));
		}

		if (remainingSeconds <= 0) {
			clearInterval(timer);
		}
	}, interval);

	return timer;
}