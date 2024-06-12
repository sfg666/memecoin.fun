const webpack = require('webpack')
const { defineConfig } = require('@vue/cli-service')
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
module.exports = defineConfig({
    transpileDependencies: true,
    configureWebpack: {
        plugins: [
            new webpack.ProvidePlugin({
                Buffer: ['buffer', 'Buffer']
            }),
            new NodePolyfillPlugin()
        ],
        resolve: {
            fallback: {
                crypto: false,
                fs: false,
                assert: false,
                process: false,
                util: false,
                path: false,
                stream: false,
            }
        },
        // base: "",
    },
    // publicPath: '',
    devServer: {
        proxy: {
          '/api': {
            target: 'https://memecoin.fun/', // 代理的目标地址
            changeOrigin: true,
            pathRewrite: {
              '^/api': '/api' // 可选的路径重写
            }
          },
          '/api2': {
            target: 'https://memecoin.fun/', // 代理的目标地址
            changeOrigin: true,
            pathRewrite: {
              '^/api2': '' // 可选的路径重写
            }
          }
        }
      }
})