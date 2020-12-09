/*
 * @Author: 王利
 * @Date: 2020-09-30 10:58:15
 * @LastEditors: 王利
 * @LastEditTime: 2020-12-07 15:03:51
 */
import axios from "@/api/fetch";
import SERVER from "../server";
export const getList = params =>
  axios.post(`${SERVER.SYS}/dictMain/list`, params);

export const del = dicts =>
  axios.post(`${SERVER.SYS}/dictMain/delete`, { dicts });

export const save = params => axios.post(`${SERVER.SYS}/dictMain/save`, params);

export const getSubList = params =>
  axios.post(`${SERVER.SYS}/dictionary/list`, params);

export const update = params =>
  axios.post(`${SERVER.SYS}/dictionary/update`, params);
