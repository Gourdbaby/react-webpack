
var path = require('path');
var webpack = require('webpack');
var extractTextPlugin = require('extract-text-webpack-plugin');  //单独出来文件
var htmlWebpackPlugin = require('html-webpack-plugin');
var glob = require('glob');

var extractCss = new extractTextPlugin('css/[name].css');

var config = {
    entry:{},
    output:{
        path:path.join(__dirname,'build'),
        filename:'js/[name].js'
    },
    module:{
        rules:[{
            test: /\.jsx?$/,
            exclude: path.resolve(__dirname,'node_modules/'),
            use: {
                loader:'babel-loader',
                options:{
                    presets: ['es2015','react']
                }
            }
        },{
            test:/\.less$/,
            use:extractCss.extract({
                use: [{
                    loader: "css-loader",
                    options:{
                        minimize: true
                    }
                }, {
                    loader: "less-loader"
                }]
            })
        }]
    },
    plugins: [
        extractCss,
        new webpack.ProvidePlugin({
            //一般如果我们要在某个模块中使用jquery这个模块的话要这样写：var $=require('jquery');
            //某些第三方库可能也直接依赖了jquery；
            //而我们通过ProvidePlugin这个插件的话就不需要自己引用jquery模块了，插件会自动帮我们引用;
            //ProvidePlugin插件将会把jquery模块的module.exports赋值给$;
            //所以，我们直接在模块中使用$就行了。
            '$': 'jquery',
            'React': 'react',
            'ReactDOM': 'react-dom',
        })
    ],
    devServer: {
        inline: true,
        host: '0.0.0.0',
        port: 8080,
        publicPath: '/',
        stats: {
            colors: true
        }
    }
}

var entrys = path.join(__dirname,'pages/');
var entries = glob.sync(entrys + '*').map(function(entry) {
    return {
        name: path.basename(entry),
        path: entry
    }
});
console.log(entries)
entries.forEach(function(entry) {
    //添加entry
    config.entry[entry.name] = [entry.path];

    //生成html
    config.plugins.push(new htmlWebpackPlugin({
        filename: entry.name + '.html',
        template: entry.path + '/index.html',
        chunks: [entry.name,'common'],
        hash: true,
        minify: {
            removeComments: true,
            collapseWhitespace: true
        }
    }));
});

module.exports = config;