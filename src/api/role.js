/*
 * @Author: 王利
 * @Date: 2020-10-26 15:09:10
 * @LastEditors: 王利
 * @LastEditTime: 2020-12-07 11:07:27
 */
import request from "@/api/fetch";

export function getRoutes() {
  return request({
    url: "/vue-element-admin/routes",
    method: "get"
  });
}

export function getRoles() {
  return request({
    url: "/vue-element-admin/roles",
    method: "get"
  });
}

export function addRole(data) {
  return request({
    url: "/vue-element-admin/role",
    method: "post",
    data
  });
}

export function updateRole(id, data) {
  return request({
    url: `/vue-element-admin/role/${id}`,
    method: "put",
    data
  });
}

export function deleteRole(id) {
  return request({
    url: `/vue-element-admin/role/${id}`,
    method: "delete"
  });
}
