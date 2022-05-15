import '../../styles/desktop.scss';
import './index.scss';

import Page1 from './page1.js';
import Page2 from './page2.js';

const vue = window.Vue;
const vueRouter = window.VueRouter;

class Index {
    constructor() {
        vue.createApp(this.onVueInit()).use(this.onVueRouterInit()).mount('#Usine');
    }
    onVueInit() {
        return {
            setup() {
                return {};
            },
        };
    }
    onVueRouterInit() {
        return vueRouter.createRouter({
            history: vueRouter.createWebHashHistory(),
            routes: [
                {
                    path: '/',
                    component: Page1,
                    alias: '/page1'
                },
                {
                    path: '/page2',
                    component: Page2,
                },
            ],
        });
    }
}

export default new Index();
