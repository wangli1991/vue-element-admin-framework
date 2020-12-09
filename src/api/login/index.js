/*
 * @Author: 王利
 * @Date: 2020-11-06 12:33:56
 * @LastEditors: 王利
 * @LastEditTime: 2020-12-07 08:46:44
 */
import axios from "@/api/fetch";

// 执行登录
export const doLogin = params => axios.post(`/api/user/login`, params);

// 获取菜单
export const getNavList = params =>
  axios.post(`/api/sys/menu/getAllMenus`, params);

// 获取所有数据字典值
export const getAllDict = () => axios.get(`/api/sys/dictionary/getAllDict`);

// 获取收藏导航
export const getStarMenuList = params =>
  axios.get(`/api/sys/sysLogin/test`, { params });

// 获取常用导航
export const getCommonMenuList = params =>
  axios.get(`/api/sys/sysLogin/test`, { params });
