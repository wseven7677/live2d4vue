import Live2d from './Live2d.vue'

const live2d4vue = {
    install(Vue) {
        if (typeof window !== 'undefined' && window.Vue) {
            Vue = window.Vue;
        }
        Vue.component('Live2d', Live2d);
    }
};

export default live2d4vue;
