import Storage from '../../library/storage.js';
import Page2 from './page2.html';

const vue = window.Vue;
const vueRouter = window.VueRouter;

export default {
    template: Page2,
    setup() {
        console.log('你来到页面2');
        const text1 = vue.ref('等待点击按钮');
        function onClickButton1() {
            Storage.setStorage('Usine', 'Hello World', 'session');
            text1.value = Storage.getStorage('Usine', 'session');
        }
        const text2 = vue.ref('等待点击按钮');
        const useRoute = vueRouter.useRoute();
        function onClickButton2() {
            text2.value = useRoute.query.query || '没有链接参数';
        }
        const text31 = vue.ref('等待点击按钮');
        const text32 = vue.ref('等待点击按钮');
        function onClickButton3() {
            text31.value = $env.publicHost;
            text32.value = $env.text || '请运行development环境';
        }
        const text4 = vue.ref(0);
        function onClickButton4() {
            text4.value++;
        }
        return {
            text1,
            onClickButton1,
            text2,
            onClickButton2,
            text31,
            text32,
            onClickButton3,
            text4,
            onClickButton4,
        };
    },
};
