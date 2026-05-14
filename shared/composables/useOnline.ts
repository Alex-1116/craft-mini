import { ref, onMounted, onUnmounted } from 'vue';

/**
 * @description 用户网络是否可用
 */
export function useOnline() {
    const online = ref<boolean>(true); // 设置初始值类型为布尔型
    let networkCallback: (res: { isConnected: boolean }) => void;

    const showStatus = (val: boolean | { isConnected: boolean }) => {
        online.value = typeof val === 'boolean' ? val : val.isConnected; // 如果是布尔型直接赋值，如果是对象取 isConnected 属性
    };

    // 在页面加载后，设置正确的网络状态
    uni.getNetworkType({
        success(res: { networkType: string }) {
            showStatus(res.networkType !== 'none');
        }
    });

    onMounted(() => {
        // 开始监听网络状态的变化
        networkCallback = (res: { isConnected: boolean }) => {
            showStatus(res.isConnected);
        };
        uni.onNetworkStatusChange(networkCallback);
    });

    onUnmounted(() => {
        // 移除监听网络状态的变化
        if (networkCallback) {
            uni.offNetworkStatusChange(networkCallback);
        }
    });

    return { online };
}