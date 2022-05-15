/*
 * @Author: 展小哥
 * @Date: 2021-01-01 12:00:00
 * @Desc: 文件操作
 */

const glob = require('glob');
const crypto = require('crypto');
const fs = require('fs-extra');

class FileSystem {
    glob(filePath = '', options = { ignore: ['**/Thumbs.db'] }) {
        return glob.sync(filePath, Object.assign({ nodir: true }, options));
    }
    exists(filePath = '') {
        return fs.pathExistsSync(filePath);
    }
    empty(filePath = '') {
        return fs.emptyDirSync(filePath);
    }
    remove(filePath = '') {
        return fs.removeSync(filePath);
    }
    copy(filePath = '', newFilePath = '', callback = () => { }) {
        return fs.copySync(filePath, newFilePath, { filter: callback });
    }
    lstat(filePath = '') {
        return fs.lstatSync(filePath);
    }
    size(filePath = '') {
        return this.exists(filePath) ? this.lstat(filePath).size : 0;
    }
    sizeParse(fileSize = 0) {
        let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        let index = Math.floor(Math.log(fileSize) / Math.log(1024));
        return parseFloat((fileSize / Math.pow(1024, index)).toFixed(2)) + ' ' + sizes[index];
    }
    hash(filePath = '') {
        return crypto.createHash('md5').update(this.read(filePath, '')).digest('base64');
    }
    isFile(filePath = '') {
        return this.exists(filePath) && this.lstat(filePath).isFile();
    }
    isDirectory(filePath = '') {
        return this.exists(filePath) && this.lstat(filePath).isDirectory();
    }
    read(filePath = '', encoding = 'UTF8') {
        return this.exists(filePath) && this.isFile(filePath) ? fs.readFileSync(filePath, encoding) : '';
    }
    readJson(filePath = '', encoding = 'UTF8') {
        return fs.readJsonSync(filePath, { throws: false, encoding: encoding }) ?? {};
    }
    write(filePath = '', fileData = '') {
        return fs.outputFileSync(filePath, fileData, 'UTF8');
    }
    writeJson(filePath = '', fileData = {}) {
        return fs.outputJsonSync(filePath, fileData, { spaces: '\t', encoding: 'UTF8' });
    }
}

module.exports = FileSystem;
