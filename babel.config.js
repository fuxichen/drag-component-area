module.exports = {
  "presets": [
    [
      "@babel/preset-env",
      {
        modules: false,
        useBuiltIns: 'usage',
        corejs: { version: 3, proposal: true },
      }
    ]
  ],
  assumptions: {
    setPublicClassFields: true,
    privateFieldsAsProperties: true,
  },
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        absoluteRuntime: false,
        // corejs: { version: 3, proposal: true },
        corejs: false,
        helpers: true,
        regenerator: false,
        useESModules: false,
        version: '7.21.0',
      },
    ],
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    '@babel/plugin-proposal-function-bind',
    ['@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }],
    '@babel/plugin-proposal-partial-application',
    '@babel/plugin-proposal-throw-expressions',
    "@babel/plugin-proposal-function-sent",
    "@babel/plugin-proposal-async-do-expressions",
    "@babel/plugin-proposal-do-expressions",
    "@babel/plugin-proposal-export-default-from",
    "@babel/plugin-proposal-record-and-tuple",
    "@babel/plugin-syntax-jsx"
  ],
  ignore: ['dist/**/*.umd.js'],
}
