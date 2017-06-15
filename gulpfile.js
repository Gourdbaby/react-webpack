var gulp = require('gulp');
var gutil = require('gulp-util');
var clean = require('gulp-clean');
var webpack = require('webpack');
var webpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./webpack.config.js');


gulp.task('default',['webpack-dev-server'],function(callback){
    callback()
})

gulp.task('webpack-dev-server',function(callback){
    var port = webpackConfig.devServer.port;
    var host = webpackConfig.devServer.host;

    //由于inline模式只有通过webpack-dev-server命令启动时才会起作用，所以执行这个任务启动时无法实现自动刷新；
    //为了能够实现自动刷新，webpack官网给的方案就是为每个entry增加一个配置；
    for(var key in webpackConfig.entry){
        webpackConfig.entry[key].unshift("webpack-dev-server/client?http://"+host+":"+port);
    }

    new webpackDevServer(webpack(webpackConfig),webpackConfig.devServer).
        listen(port,host,function(err){
            if(err){
                console.log('gulpfile.js:::::'+err);
                return false;
            }
            gutil.log('[webpack-dev-server]', 'http://127.0.0.1:' + port + '/[your-page-name]');
            gutil.log('[webpack-dev-server]', 'or');
            gutil.log('[webpack-dev-server]', 'http://127.0.0.1:' + port + '/webpack-dev-server/[your-page-name]');
            callback();
        })
})

gulp.task('prod',['clean','webpack'],function(callback){
    callback();
})

gulp.task('webpack',function(callback){
    webpack(webpackConfig,function(err,stats){
        if(err){
            gutil.log("webpack:"+err);
            return false;
        }
        gutil.log('[webpack:build]', stats.toString({
            chunks: false, // Makes the build much quieter
            colors: true
        }));
        callback();
    })
})

gulp.task('clean',function(cb){
    gulp.src([webpackConfig.output.path]).pipe(clean({force:true}));
    cb();
})