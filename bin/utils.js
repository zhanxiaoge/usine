/*
 * @Author: 展小哥
 * @Date: 2021-01-01 12:00:00
 * @Desc: 公共方法
 */

const path = require('path');
const file = require('./file.js');

// 获取编译环境配置
module.exports.getEnvConfig = function () {
    let fileSystem = new file();
    let configPath = path.join(__dirname, '..', 'package.json');
    let configData = Object.assign({}, fileSystem.readJson(configPath)?.envConfig ?? {});
    return configData;
};

// 获取排除打包列表
module.exports.getExternalsConfig = function () {
    let fileSystem = new file();
    let configPath = path.join(__dirname, '..', 'package.json');
    let configData = Object.assign({}, fileSystem.readJson(configPath)?.externalsConfig ?? {});
    return configData;
};

// 获取项目路径
module.exports.getProjectPath = function () {
    let result = {};
    result.taskPath = process.argv.filter((item, index) => index > 1).join('/');
    result.buildPath = path.join(__dirname, '..', 'build');
    result.rootPath = path.join(__dirname, '..', 'src');
    result.pagePath = path.join(result.rootPath, 'pages');
    return result;
};

// 获取入口数据
module.exports.getEntryData = function (dataPath = {}) {
    let fileSystem = new file();
    let taskPath = path.join(dataPath.pagePath, dataPath.taskPath);
    let globPath = path.join(taskPath, fileSystem.isDirectory(taskPath) ? '*.js' : '').split(path.sep).join('/');
    return fileSystem.glob(globPath).map(item => {
        let result = {};
        result.path = path.join(item);
        result.name = path.join(dataPath.pagePath, '/');
        result.name = result.path.replace(result.name, '');
        result.name = result.name.replace(path.extname(result.path), '');
        result.name = result.name.split(path.sep).join('/');
        return result;
    });
};

// 获取入口路径
module.exports.getEntryPath = function (dataPath = []) {
    let result = {};
    dataPath.forEach(item => { result[item.name] = item.path; });
    return result;
};

// 获取入口模版
module.exports.getEntryHtml = function (dataPath = [], rootPath = '') {
    let fileSystem = new file();
    return dataPath.map(item => {
        let defaultTemplate = path.join(rootPath, 'library', 'template', 'template.art');
        let entryTemplate1 = path.join(path.dirname(item.path), `${path.basename(item.path, '.js')}.art`);
        let entryTemplate2 = path.join(path.dirname(item.path), `${path.basename(item.path, '.js')}.html`);
        if (fileSystem.exists(entryTemplate1)) {
            return Object.assign(item, { template: entryTemplate1 });
        }
        else if (fileSystem.exists(entryTemplate2)) {
            return Object.assign(item, { template: entryTemplate2 });
        }
        else if (fileSystem.exists(defaultTemplate)) {
            return Object.assign(item, { template: defaultTemplate });
        }
        else {
            return item;
        }
    });
};

// 获取资源路径
module.exports.getResourcePath = function (fileName = '', filePath = '', dataPath = {}) {
    filePath = filePath.replace(path.join(dataPath.pagePath, '/'), '');
    filePath = filePath.replace(path.join(dataPath.rootPath, '/'), '');
    filePath = path.join(path.dirname(filePath), fileName);
    filePath = filePath.split(path.sep).join('/');
    return filePath;
};
