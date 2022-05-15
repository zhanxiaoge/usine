import '../../../styles/desktop.scss';
import './index.scss';
import Storage from '../../../library/storage.js';
import { getDecodeUrl } from '../../../library/utils.js';
import Template from 'template';
import $ from 'jquery';

class Index {
    constructor() {
        console.log('你来到页面2');
        document.getElementById('Button1').addEventListener('click', this.onClickButton1);
        document.getElementById('Button2').addEventListener('click', this.onClickButton2);
        document.getElementById('Button3').addEventListener('click', this.onClickButton3);
    }
    onClickButton1() {
        Storage.setStorage('Usine', 'Hello World', 'session');
        document.getElementById('Text1').innerText = Storage.getStorage('Usine', 'session');
    }
    onClickButton2() {
        document.getElementById('Text2').innerText = getDecodeUrl('query') || '没有链接参数';
    }
    onClickButton3() {
        $('#Text3').html(Template('TemplateContent', $env));
    }
}

export default new Index();
