module.exports = {
  presets: ['@vue/app'],
  plugins: [
    // https://babeljs.io/docs/en/babel-plugin-transform-runtime/
    '@babel/plugin-transform-runtime',
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk',
      },
    ],
    [
      'import',
      {
        libraryName: 'vxe-table',
        style: true, // 样式是否也按需加载
      },
    ],
  ],
  exclude: ['./src/libs/vue-easy-tree.min.js'],
}
