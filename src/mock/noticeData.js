/*
 * @Author: 王利
 * @Date: 2020-12-07 10:30:34
 * @LastEditors: 王利
 * @LastEditTime: 2020-12-07 10:48:51
 */
// 引入 Mock
import Mock from "mockjs";

export default Mock.mock({
  code: 1,
  msg: "",
  "data|5-10": [
    {
      "id|+1": 1,
      title: "@ctitle(10)"
    }
  ]
});
