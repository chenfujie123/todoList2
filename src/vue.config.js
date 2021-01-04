module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:8081/finance_javaweb_02',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '' //规定请求地址以什么作为开头
                }
              },
        },
        port: 8082
    }
}