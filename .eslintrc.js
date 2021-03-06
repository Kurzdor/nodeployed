module.exports = {
    env: {
        browser: false,
        commonjs: true,
        node: true
    },
    extends: ['standard', 'plugin:prettier/recommended'],
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2017,
        ecmaFeatures: {
            experimentalObjectRestSpread: true
        }
    }
};
