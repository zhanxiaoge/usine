import '../../../styles/desktop.scss';
import './index.scss';
import logo from '../../../assets/logo.png';

class Index {
    constructor() {
        document.getElementById('Usine').innerHTML = `
            <img class="logo" src="${logo}">
            <h1 class="title">感谢使用Usine多页面开发脚手架</h1>
            <h2 class="desc">当前是JavaScript原生开发场景 - 页面3</h2>
            <a class="button" href="./index.html">进入页面1</a>
        `;
    }
}

export default new Index();
