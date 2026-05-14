/**
 * @description 对Date的扩展，将 Date 转化为指定格式的String
 * @description 年(Y)、月(m)、日(d)、时(H)、分(M)、秒(S) 可以用 1-2 个占位符，
 * @param fmt 
 * @param date 
 * @returns 例子：dateFormat('YYYY-mm-dd HH:MM:SS', new Date()) ==> 2020-01-01 08:00:00
 */
export const dateFormat = (fmt: string, date: Date): string => {
    const opt: { [key: string]: string } = {
        "Y+": date.getFullYear().toString(), // 年
        "m+": (date.getMonth() + 1).toString(), // 月
        "d+": date.getDate().toString(), // 日
        "H+": date.getHours().toString(), // 时
        "M+": date.getMinutes().toString(), // 分
        "S+": date.getSeconds().toString() // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    let ret: RegExpExecArray | null;
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")));
        };
    };
    return fmt;
}

/**
 * @description 对Date的扩展，将 Date 转化为时间戳
 * @param date 
 * @returns 
 */
export const dateToTimestamp = (date: Date): number => {
    if (!(date instanceof Date)) {
        throw new TypeError('Expected a Date object');
    }
    return date.getTime();
}

/**
 * @description 对Date的扩展，将 string格式的 Date 转化为时间戳
 * @param dateString 
 * @returns 
 */
export const dateStringToTimestamp = (dateString: string): number => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        throw new Error('Invalid date string');
    }
    return date.getTime();
}

/**
 * @description 关于消息时间处理
 * @param timestamp 
 * @returns 
 */
export const friendlyTimeFormat = (timestamp : string) => {
	const nowTime = new Date();
	// 确保传入的时间戳符合标准格式
	const validTimestamp = timestamp.replace(' ', 'T'); // 替换空格为 'T'，符合 ISO 8601 格式
	
	const agoTime = new Date(validTimestamp);
	
	const diff = nowTime.getTime() - agoTime.getTime();
	const diffMinutes = Math.floor(diff / (1000 * 60));
	const diffHours = Math.floor(diff / (1000 * 60 * 60));
	const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
	const diffWeeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
	const diffMonths = Math.floor(diff / (1000 * 60 * 60 * 24 * 30)); // 简化计算，一个月按30天算
	const diffYears = Math.floor(diff / (1000 * 60 * 60 * 24 * 365)); // 简化计算，一年按365天算
	const week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

	if (diffMinutes < 1) {
		return '刚刚';
	} else if (diffMinutes < 60) {
		return `${diffMinutes}分钟前`;
	} else if (agoTime.toDateString() === nowTime.toDateString()) {
		return `${agoTime.getHours()}:${agoTime.getMinutes().toString().padStart(2, '0')}`;
	} else if (diffDays === 1) {
		return `昨天 ${agoTime.getHours()}:${agoTime.getMinutes().toString().padStart(2, '0')}`;
	} else if (diffDays < 7) {
		return `${week[agoTime.getDay()]} ${agoTime.getHours()}:${agoTime.getMinutes().toString().padStart(2, '0')}`;
	} else if (diffWeeks < 52) {
		return `${agoTime.getMonth() + 1}月${agoTime.getDate()}日 ${agoTime.getHours()}:${agoTime.getMinutes().toString().padStart(2, '0')}`;
	} else {
		return `${agoTime.getFullYear()}年${agoTime.getMonth() + 1}月${agoTime.getDate()}日 ${agoTime.getHours()}:${agoTime.getMinutes().toString().padStart(2, '0')}`;
	}
}

interface TimeUnit {
    label: string;
    milliseconds: number;
}

class DateUtils {
    private static readonly UNITS: TimeUnit[] = [
        { label: '年', milliseconds: 31557600000 },
        { label: '月', milliseconds: 2629800000 },
        { label: '天', milliseconds: 86400000 },
        { label: '小时', milliseconds: 3600000 },
        { label: '分钟', milliseconds: 60000 },
        { label: '秒', milliseconds: 1000 }
    ];

    /**
     * 将毫秒数转换为人类可读的时间描述。
     * @param milliseconds 时间差，单位毫秒。
     * @returns 人类可读的时间描述字符串。
     */
    static humanize(milliseconds: number): string {
        for (const unit of DateUtils.UNITS) {
            if (milliseconds >= unit.milliseconds) {
                const value = Math.floor(milliseconds / unit.milliseconds);
                return `${value}${unit.label}前`;
            }
        }
        return '刚刚';
    }

    /**
     * 格式化日期字符串。
     * @param dateStr 字符串格式的日期时间。
     * @returns 格式化后的日期字符串。
     */
    static format(dateStr: string): string {
        const date = DateUtils.parse(dateStr);
        const diff = Date.now() - date.getTime();

        if (diff < DateUtils.UNITS[2].milliseconds) {
            return DateUtils.humanize(diff);
        }

        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    }

    /**
     * 解析特定格式的日期字符串为Date对象。
     * @param str 字符串格式的日期时间，格式为"yyyy-mm-dd HH:MM:ss"。
     * @returns 解析后的Date对象。
     */
    static parse(str: string): Date {
        const match = str.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
        if (!match) {
            throw new Error('Invalid date format');
        }

        // 使用解构和映射确保类型安全
        const [year, month, day, hour, minute, second] = match.slice(1).map(Number);
        return new Date(year, month - 1, day, hour, minute, second);
    }
}