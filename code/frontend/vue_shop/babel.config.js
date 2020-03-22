// 这是项目发布阶段要用到的babel插件
const prodPlugins = []

// 当process.env.NODE_ENV值为production为发布，为development
if (process.env.NODE_ENV === 'production') {
  prodPlugins.push('transform-remove-console')
}
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    // 发布商品时插件数组
    ...prodPlugins,
    '@babel/plugin-syntax-dynamic-import'
  ]
}
