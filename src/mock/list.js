/*
 * @Author: 王利
 * @Date: 2020-12-07 10:13:54
 * @LastEditors: 王利
 * @LastEditTime: 2020-12-07 10:22:06
 */
// 引入 Mock
const Mock = require("mockjs");
export default Mock.mock({
  code: 20000,
  data: {
    total: 20,
    "items|20": [
      {
        order_no: "@guid()",
        timestamp: +Mock.Random.date("T"),
        username: "@name()",
        price: "@float(1000, 15000, 0, 2)",
        "status|1": ["success", "pending"]
      }
    ]
  }
});
