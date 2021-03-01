/*
 * @Descripttion: 
 * @Author: Duanlinpeng
 * @Date: 2020-10-20 10:40:13
 * @LastEditTime: 2020-10-21 14:41:11
 * @FilePath: /bm-oa-components/.eslintrc.js
 */
module.exports = {
  "env": {
    "browser": true,
    "commonjs": true,
    "es6": true,
    "node": true
  },
  "parser": "vue-eslint-parser",
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "always"
    ],
    "no-console": "off"
  }
};