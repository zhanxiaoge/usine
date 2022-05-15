/*
 * @Author: 展小哥
 * @Date: 2021-01-01 12:00:00
 * @Desc: 压缩代码
 */

const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const webpackTerserJS = require('terser-webpack-plugin');
const terminal = require('./terminal.js');
const utils = require('./utils.js');
const file = require('./file.js');

class Index {
    constructor() {
        this.file = new file();
        this.terminal = new terminal();
        this.noTerserMode = !!(process.env.npm_config_unt);
        this.noPresetMode = !!(process.env.npm_config_unp);
        this.envMode = process.env.NODE_ENV = 'production';
        this.envConfig = utils.getEnvConfig();
        this.envPath = utils.getProjectPath();
        this.entryName = this.getEntryName();
        this.entryPath = this.getEntryData();
        this.onStartInit();
    }
    onStartInit() {
        if (Object.keys(this.entryPath).length) {
            let envValue = Object.keys(this.envConfig);
            let envIndex = [...Array(envValue.length).keys()];
            let envPoint = `${envValue.map((item, index) => `${item}(${index})`).join('/')}: `;
            if (envValue.length >= 2) {
                this.terminal.confirm({ title: '请你选择本次任务的运行环境?', desc: envPoint, options: envIndex }).then(result => {
                    this.envConfig = this.envConfig[envValue[result]];
                    this.onStartBuild();
                }).catch(() => this.terminal.fail({ title: '你放弃了本次编译任务!\n' }));
            }
            else {
                this.envConfig = envValue.length ? this.envConfig[envValue.pop()] : this.envConfig;
                this.onStartBuild();
            }
        }
        else {
            this.terminal.fail({ title: '未找到入口文件!\n' });
        }
    }
    onStartBuild() {
        this.file.remove(this.envPath.buildPath);
        webpack(webpackMerge(this.getBasisConfig(), {
            plugins: [
                new webpack.HashedModuleIdsPlugin({ hashDigest: 'hex' }),
            ],
            optimization: {
                minimize: !this.noTerserMode,
                minimizer: [
                    new webpackTerserJS({
                        cache: true,
                        sourceMap: false,
                        parallel: true,
                        extractComments: false,
                        terserOptions: {
                            output: {
                                comments: false,
                            },
                            compress: {
                                passes: 2,
                            },
                        },
                    }),
                ],
            },
        }), (error, stats) => {
            let result = stats.toJson();
            if (error || stats.hasErrors()) {
                result.errors.forEach(item => console.error(`${item}\n`));
                process.exit();
            }
            else {
                result.assets.forEach(item => this.terminal.success({ title: `${item.name} (${this.file.sizeParse(item.size)})` }));
                this.terminal.info({ title: `本次耗时: ${result.time}毫秒\n` });
                process.exit();
            }
        });
    }
    getEntryName() {
        return path.basename(this.envPath.taskPath, path.extname(this.envPath.taskPath));
    }
    getEntryData() {
        let filePath = {};
        let rootPath = path.join(this.envPath.rootPath, '/');
        let taskPath = path.join(this.envPath.rootPath, this.envPath.taskPath);
        if (this.file.isFile(taskPath) && path.extname(taskPath) === '.js') {
            rootPath = taskPath.replace(rootPath, '');
            rootPath = rootPath.replace(path.extname(taskPath), '');
            rootPath = rootPath.split(path.sep).join('/');
            filePath[rootPath] = taskPath;
        }
        return filePath;
    }
    getBasisConfig() {
        return {
            mode: this.envMode,
            entry: this.entryPath,
            output: {
                libraryTarget: 'umd',
                libraryExport: 'default',
                library: this.entryName,
                filename: `[name].js`,
                path: this.envPath.buildPath,
            },
            plugins: [
                new webpack.DefinePlugin({ $env: JSON.stringify(this.envConfig) }),
            ],
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        exclude: /(\\|\/)(node_modules)(\\|\/)/,
                        use: [
                            {
                                loader: 'babel-loader',
                                options: {
                                    cacheDirectory: true,
                                    presets: [].concat(
                                        this.noPresetMode ? [] : [['@babel/preset-env', {
                                            useBuiltIns: 'usage',
                                            corejs: 3,
                                        }]],
                                    ),
                                },
                            },
                            {
                                loader: 'eslint-loader',
                                options: {
                                    cache: true,
                                },
                            },
                        ],
                    },
                ],
            },
        };
    }
}

module.exports = new Index();
