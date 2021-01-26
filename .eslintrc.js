module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es6: true
    },
    extends: 'eslint:recommended',
    rules: {
        indent: ['error', 2],
        "linebreak-style": ['error', 'unix'],
        quotes: [1, 'single'],
        semi: ['error', 'never'],
        "no-var": ['error'],
        "no-useless-escape": "off"
    },
    parserOptions: {
        ecmaVersion: 2017,
        sourceType: 'module',
        ecmaFeatures: {
            experimentalObjectRestSpread: true
        }
    },
    globals: {
        wx: true,
        Component: true,
    },
}
