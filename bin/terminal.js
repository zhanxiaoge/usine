/*
 * @Author: 展小哥
 * @Date: 2021-01-01 12:00:00
 * @Desc: 日志输出
 */

const ora = require('ora');
const chalk = require('chalk');
const readline = require('readline');

class Terminal {
    constructor(options = {}) {
        this.isExpertMode = process.platform !== 'win32' || process.env.CI || process.env.TERM === 'xterm-256color';
        this.symbolWin32 = { success: '>', fail: '>', info: '>', warn: '>' };
        this.symbolDarwin = { success: '✔', fail: '✘', info: '➜', warn: '➜' };
        this.symbolDefault = this.isExpertMode ? this.symbolDarwin : this.symbolWin32;
        this.symbolDefault = Object.assign(this.symbolDefault, options);
        this.ora = new ora();
    }
    log(options = {}) {
        options.title = options.title || '';
        options.desc = options.desc || '';
        options.type = options.type || '';
        options.color = options.color || 'white';
        options.symbol = chalk[options.color](this.symbolDefault[options.type] ?? '');
        options.content = `${chalk[options.color](options.title)}${options.title && options.desc ? ' ' : ''}${options.desc}`;
        options.read = options.read || false;
        if (options.type.length === 0 || options.read === true) {
            return `${options.symbol}${options.symbol && options.content ? ' ' : ''}${options.content}`;
        }
        else if (options.type === 'load') {
            return this.ora.start(options.content);
        }
        else {
            return this.ora.stopAndPersist({ symbol: options.symbol, text: options.content });
        }
    }
    confirm(options = {}) {
        return new Promise(resolve => {
            let readlineQuestion = this.log(Object.assign({ read: true, type: 'info', color: 'red', desc: '请输入(Y/N): ', options: [] }, options));
            let readlineInterface = readline.createInterface({ input: process.stdin, output: process.stdout });
            readlineInterface.question(readlineQuestion, result => {
                resolve(options.options.includes(result) ? result : '');
                readlineInterface.close();
            });
        });
    }
    load(options = {}) {
        return this.log(Object.assign({ type: 'load', color: 'cyan' }, options));
    }
    success(options = {}) {
        return this.log(Object.assign({ type: 'success', color: 'green' }, options));
    }
    fail(options = {}) {
        return this.log(Object.assign({ type: 'fail', color: 'red' }, options));
    }
    warn(options = {}) {
        return this.log(Object.assign({ type: 'warn', color: 'yellow' }, options));
    }
    info(options = {}) {
        return this.log(Object.assign({ type: 'info', color: 'blue' }, options));
    }
}

module.exports = Terminal;
