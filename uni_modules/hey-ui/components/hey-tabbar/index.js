import HeyTabbar from "./hey-tabbar.vue";
export default {
  install: async (vue) => {
    vue.component(HeyTabbar.name, HeyTabbar)
  },
};