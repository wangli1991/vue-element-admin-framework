/*
 * @Author: 王利
 * @Date: 2020-10-26 15:09:28
 * @LastEditors: 王利
 * @LastEditTime: 2020-12-01 15:29:48
 */
import { setSession, getSession, removeSession } from "@/utils";
const TokenKey = "jwt";

export const getToken = () => getSession(TokenKey);

export const setToken = token => setSession(TokenKey, token);

export const removeToken = () => removeSession(TokenKey);

export const getUser = () => getSession("username");

export const setUser = name => setSession("username", name);

export const removeUser = () => removeSession("username");

export const getUserId = () => getSession("userId");

export const setUserId = userId => setSession("userId", userId);

export const removeUserId = () => removeSession("userId");

export const getLoginTimestamp = () => getSession("loginTimestamp");

export const setLoginTimestamp = loginTimestamp =>
  setSession("loginTimestamp", loginTimestamp);

export const removeLoginTimestamp = () => removeSession("loginTimestamp");

export const getUserInfo = () => getSession("userInfo");

export const setUserInfo = info => setSession("userInfo", JSON.stringify(info));

export const removeUserInfo = () => removeSession("userInfo");

export const getAvatar = () => getSession("avatar");

export const setAvatar = name => setSession("avatar", name);

export const removeAvatar = () => removeSession("avatar");
