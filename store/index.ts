// @ts-ignore
import { createPinia } from 'pinia';
import { useUserStore } from './modules/user';
import { registerUserPersistPlugin } from './plugins/user-persist';

const pinia = createPinia();

registerUserPersistPlugin(pinia);

export { pinia, useUserStore };
export default pinia;
