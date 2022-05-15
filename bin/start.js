/*
 * @Author: 展小哥
 * @Date: 2021-01-01 12:00:00
 * @Desc: 调试编译
 */

const path = require('path');
const webpack = require('webpack');
const webpackLog = require('webpack-log');
const webpackMerge = require('webpack-merge');
const webpackServer = require('webpack-dev-server');
const webpackHtml = require('html-webpack-plugin');
const webpackHtmlInlineSource = require('inline-assets-html-plugin');
const webpackCSS = require('mini-css-extract-plugin');
const webpackTerserCSS = require('optimize-css-assets-webpack-plugin');
const webpackTerserJS = require('terser-webpack-plugin');
const webpackVConsole = require('vconsole-webpack-plugin');
const webpackPort = require('portfinder');
const terminal = require('./terminal.js');
const utils = require('./utils.js');
const file = require('./file.js');

class Index {
    constructor() {
        this.file = new file();
        this.terminal = new terminal();
        this.buildMode = !!(process.env.npm_config_ub);
        this.inlineMode = !!(process.env.npm_config_ui);
        this.noTerserMode = !!(process.env.npm_config_unt);
        this.noPresetMode = !!(process.env.npm_config_unp);
        this.envMode = process.env.NODE_ENV = this.buildMode ? 'production' : 'development';
        this.envHash = this.buildMode ? '[contenthash]' : '[hash]';
        this.envConfig = utils.getEnvConfig();
        this.envPath = utils.getProjectPath();
        this.entryData = utils.getEntryData(this.envPath);
        this.entryPath = utils.getEntryPath(this.entryData);
        this.entryHtml = utils.getEntryHtml(this.entryData, this.envPath.rootPath);
        this.entryPort = 9527;
        this.onStartInit();
    }
    async onStartInit() {
        if (this.entryHtml.length) {
            let envValue = Object.keys(this.envConfig);
            let envIndex = [...Array(envValue.length).keys()].map(item => item.toString());
            let envPoint = `${envValue.map((item, index) => `${item}(${index})`).join('/')}: `;
            if (envValue.length >= 2) {
                let result = await this.terminal.confirm({ title: '请你选择本次任务的运行环境?', desc: envPoint, options: envIndex });
                if (result.length) {
                    this.envConfig = this.envConfig[envValue[result]];
                }
                else {
                    return this.terminal.fail({ title: '你放弃了本次编译任务!\n' });
                }
            }
            else {
                this.envConfig = envValue.length ? this.envConfig[envValue.pop()] : this.envConfig;
            }
            webpackPort.getPort({ port: this.entryPort }, (error, port) => {
                if (!error) {
                    this.entryPort = port;
                    this[this.envMode]();
                }
                else {
                    this.terminal.fail({ title: '当前暂无可用端口号!\n' });
                }
            });
        }
        else {
            this.terminal.fail({ title: '未找到入口文件!\n' });
        }
    }
    development() {
        let webpackConfig = webpackMerge(this.getBasisConfig(), {
            plugins: [
                new webpack.HotModuleReplacementPlugin(),
                new webpackVConsole({ enable: true }),
            ],
            devServer: {
                publicPath: '/',
                contentBase: this.envPath.buildPath,
                compress: true,
                overlay: true,
                quiet: true,
                clientLogLevel: 'error',
                liveReload: false,
                hot: true,
                useLocalIp: true,
                host: '0.0.0.0',
                port: this.entryPort,
                before: (app, server, compiler) => {
                    let webpackHtml = this.entryHtml.map(item => item.template).filter(item => item.length);
                    compiler.hooks.done.tap('webpackDone', () => {
                        if (Object.keys(compiler.watchFileSystem.watcher.mtimes).some(item => webpackHtml.includes(item))) {
                            server.sockWrite(server.sockets, 'content-changed');
                        }
                    });
                }
            },
        });
        new webpackServer(webpack(webpackConfig), webpackConfig.devServer).listen(webpackConfig.devServer.port, webpackConfig.devServer.host, () => {
            this.entryData.forEach(item => {
                webpackLog({ name: 'wds' }).info(this.terminal.log({
                    color: 'green',
                    title: `http://localhost:${webpackConfig.devServer.port}/${item.name}.html`,
                }));
            });
        });
    }
    production() {
        let webpackConfig = webpackMerge(this.getBasisConfig(), {
            plugins: [
                new webpack.HashedModuleIdsPlugin({ hashDigest: 'hex' }),
                new webpackCSS({
                    filename: `[name].${this.envHash}.css`,
                    chunkFilename: `[name].${this.envHash}.css`,
                }),
                new webpackVConsole({ enable: !this.buildMode }),
            ],
            optimization: {
                minimize: !this.noTerserMode,
                minimizer: [
                    new webpackTerserJS({
                        exclude: /^utils(\\|\/)/,
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
                    new webpackTerserCSS({
                        cssProcessorPluginOptions: {
                            preset: ['default', {
                                cssDeclarationSorter: { order: 'smacss' },
                                normalizeUnicode: false,
                            }],
                        },
                    }),
                ],
            },
        });
        this.file.remove(this.envPath.buildPath);
        webpack(webpackConfig, (error, stats) => {
            let result = stats.toJson();
            if (error || stats.hasErrors()) {
                result.errors.forEach(item => console.error(`${item}\n`));
                process.exit();
            } else {
                result.assets.forEach(item => this.terminal.success({ title: `${item.name} (${this.file.sizeParse(item.size)})` }));
                this.terminal.info({ title: `本次耗时: ${result.time}毫秒\n` });
                process.exit();
            }
        });
    }
    getEntryTemplate(dataPath = []) {
        return dataPath.map(item => new webpackHtml(Object.assign(
            {
                title: item.name,
                filename: `${item.name}.html`,
                inject: true,
                chunksSortMode: 'auto',
                chunks: [item.name],
                minify: !this.noTerserMode,
            },
            item.template ? { template: item.template } : {},
        )));
    }
    getBasisConfig() {
        return {
            mode: this.envMode,
            entry: this.entryPath,
            output: {
                filename: `[name].${this.envHash}.js`,
                chunkFilename: `[name].${this.envHash}.js`,
                publicPath: this.buildMode ? path.join(this.envConfig.publicHost ?? '/', '/').split(path.sep).join('/').replace(':/', '://') : '/',
                path: this.envPath.buildPath,
            },
            externals: utils.getExternalsConfig(),
            plugins: [
                new webpack.DefinePlugin({ $env: JSON.stringify(this.envConfig) }),
                ...this.getEntryTemplate(this.entryHtml),
                ...((this.inlineMode && this.buildMode) ? [new webpackHtmlInlineSource({ test: /\.(css|js)$/ })] : []),
            ],
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        exclude: /(\\|\/)(node_modules|(src(\\|\/)(utils|(pages(\\|\/)(.+)(\\|\/)utils))))(\\|\/)/,
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
                    {
                        test: /\.(sass|scss|css)$/,
                        exclude: /(\\|\/)node_modules(\\|\/)/,
                        use: [
                            {
                                loader: this.buildMode ? webpackCSS.loader : 'style-loader',
                            },
                            {
                                loader: 'css-loader',
                            },
                            {
                                loader: 'postcss-loader',
                            },
                            {
                                loader: 'sass-loader',
                                options: {
                                    sassOptions: {
                                        outputStyle: 'nested',
                                    },
                                },
                            },
                        ],
                    },
                    {
                        test: /\.html$/,
                        exclude: /(\\|\/)node_modules(\\|\/)/,
                        loader: 'html-loader',
                        options: {
                            minimize: !this.noTerserMode,
                        },
                    },
                    {
                        test: /\.art$/,
                        exclude: /(\\|\/)node_modules(\\|\/)/,
                        loader: 'art-template-loader',
                        options: {
                            debug: !(this.buildMode),
                            minimize: false,
                            bail: false,
                            rules: [{
                                test: /<script type=("|')text\/template("|')[^>]*>([\w\W]*?)<\/script>/,
                                use: resource => {
                                    return {
                                        output: 'raw',
                                        code: JSON.stringify(`${resource}`),
                                    };
                                }
                            }],
                        },
                    },
                    {
                        test: /\.js$/,
                        issuer: /\.(?!(js)$)[^.]+$/,
                        include: /(\\|\/)src(\\|\/)(utils|(pages(\\|\/)(.+)(\\|\/)utils))(\\|\/)/,
                        exclude: /(\\|\/)node_modules(\\|\/)/,
                        loader: 'file-loader',
                        options: {
                            esModule: false,
                            name: `[name].${this.envHash}.[ext]`,
                            outputPath: (url, resourcePath) => utils.getResourcePath(url, resourcePath, this.envPath),
                        },
                    },
                    {
                        test: /\.(png|jpg|jpeg|gif|bmp|webp|svg|eot|ttf|woff|woff2|mp4|webm|ogg|mp3|wav|flac|aac)$/,
                        issuer: /\.(?!(sass|scss|css)$)[^.]+$/,
                        exclude: /(\\|\/)node_modules(\\|\/)/,
                        loader: 'file-loader',
                        options: {
                            esModule: false,
                            name: `[name].${this.envHash}.[ext]`,
                            outputPath: (url, resourcePath) => utils.getResourcePath(url, resourcePath, this.envPath),
                        },
                    },
                    {
                        test: /\.(png|jpg|jpeg|gif|bmp|webp)$/,
                        issuer: /\.(sass|scss|css)$/,
                        exclude: /(\\|\/)node_modules(\\|\/)/,
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            esModule: false,
                            name: `[name].${this.envHash}.[ext]`,
                            outputPath: (url, resourcePath) => utils.getResourcePath(url, resourcePath, this.envPath),
                        },
                    },
                ],
            },
        };
    }
}

module.exports = new Index();
