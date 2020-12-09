/*
 * @Author: 王利
 * @Date: 2020-10-29 06:06:50
 * @LastEditors: 王利
 * @LastEditTime: 2020-10-29 06:07:54
 */
const config = {
  dev: {
    host: '/'
  },
  tst: {
    host: '//tst.xxx.com'
  },
  uat: {
    host: '//uat.xxx.com'
  },
  pre: {
    host: '//pre.xxx.com'
  },
  prod: {
    host: '/'
  }
};

export default config[process.env.ENV_CONFIG] || config[`prod`];
