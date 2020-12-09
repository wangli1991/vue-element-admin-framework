/*
 * @Author: wangli
 * @Date: 2020-07-19 13:23:29
 * @LastEditors: 王利
 * @LastEditTime: 2020-12-01 14:35:50
 */

import axios from "axios";
import qs from "qs";
import config from "@/config/serverMap";
import {
  getToken,
  getUserId,
  getUser,
  getLoginTimestamp
} from "@/utils/cookies";
import { MessageBox, Message } from "element-ui";
import store from "@/store";
import { notifyAction } from "@/utils";

// 多次401只验证1此
let isError401 = false;

// 请求异常提示信息
const codeMessage = {
  200: "服务器成功返回请求的数据。",
  201: "新建或修改数据成功。",
  202: "一个请求已经进入后台排队（异步任务）。",
  204: "删除数据成功。",
  400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
  401: "用户没有权限（令牌、用户名、密码错误）。",
  403: "用户得到授权，但是访问是被禁止的。",
  404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
  406: "请求的格式不可得。",
  410: "请求的资源被永久删除，且不会再得到的。",
  412: "客户端请求信息的先决条件错误。",
  422: "当创建一个对象时，发生一个验证错误。",
  500: "服务器发生错误，请检查服务器。",
  502: "网关错误。",
  503: "服务不可用，服务器暂时过载或维护。",
  504: "网关超时。"
};

// 自定义扩展 header 请求头
const getConfigHeaders = () => {
  return {
    jwt: getToken() || "", // token
    Authorization: `Bearer ${getToken()}` || "", // token
    userAgent: "pc", // 设备
    appId: "JDMC",
    userId: getUserId(),
    userName: encodeURIComponent(getUser() || ""),
    loginTimestamp: getLoginTimestamp() || ""
  };
};
// 创建 axios 实例
const instance = axios.create({
  baseURL: config.host,
  timeout: 1000 * 100,
  withCredentials: true, // 跨域请求时是否需要使用凭证
  paramsSerializer: params => {
    // 序列化 GET 请求参数 -> a: [1, 2] => a=1&a=2
    return qs.stringify(params, { arrayFormat: "repeat" });
  }
});
// 异常处理程序
const errorHandler = error => {
  const { response = {} } = error;
  const { data = {} } = response;
  const errortext =
    data.msg || codeMessage[response.status] || response.statusText;
  if (data.code === 401 && !isError401) {
    isError401 = true;
    MessageBox({
      title: "提示",
      message: `${errortext},请重新登陆`,
      type: "error",
      showClose: false,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      closeOnHashChange: false
    }).then(() => {
      store.dispatch("app/createLogout");
    });
  } else if (data.code !== 401) {
    notifyAction(errortext, "error");
  }

  return Promise.reject(error);
};
// 请求拦截
instance.interceptors.request.use(config => {
  // 请求头信息，token 验证
  config.headers = {
    ...config.headers,
    ...getConfigHeaders()
  };
  // 处理 IE 缓存
  config.params = {
    ...config.params,
    _t: +new Date().getTime()
  };
  return config;
}, errorHandler);

// 响应拦截
instance.interceptors.response.use(response => {
  let { config, headers, data } = response;
  isError401 = false;
  // 请求异常提示信息
  if (data.code !== 200) {
    // token 过期，需要重新登录
    if (data.code === 401) {
      store.dispatch("user/logout");
    }
    data.msg && notifyAction(data.msg, "error");
  }
  return data;
}, errorHandler);

export { getConfigHeaders };
export default instance;
