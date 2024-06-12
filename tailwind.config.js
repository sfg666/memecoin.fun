module.exports = {
  content: [
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui"),
  ],
  server:{
    //hmr: { overlay: false },
    https: false, // 是否开启 https
    open: false, // 是否自动在浏览器打开
    port: 8888, // 端口号
    host: "0.0.0.0",
    // proxy: {
    //   "/api": {
    //     target: "", // Background interface
    //     changeOrigin: true,
    //     secure: false, 
    //     rewrite: (path) => path.replace(/^\/api/, ""),
    //   },
    // },
  },
}
