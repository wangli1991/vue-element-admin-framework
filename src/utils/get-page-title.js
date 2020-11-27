/*
 * @Author: 王利
 * @Date: 2020-10-26 15:09:10
 * @LastEditors: 王利
 * @LastEditTime: 2020-11-27 13:22:15
 */
import config from "@/config";

const title = config.systemName;

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`;
  }
  return `${title}`;
}
