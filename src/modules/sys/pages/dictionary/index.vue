<!--
 * @Author: 王利
 * @Date: 2020-07-20 06:38:17
 * @LastEditors: 王利
 * @LastEditTime: 2020-12-07 15:55:49
-->
<template>
  <div>
    <split-pane direction="column">
      <template v-slot:left>
        <virtual-table
          ref="table"
          :columns="columns"
          topSpaceAlign="left"
          :rowSelection="selection"
          rowKey="id"
          :fetch="fetch"
          @rowClick="handleRowClick"
          @dataChange="handleDataChange"
        >
          <el-button type="primary" icon="el-icon-edit" @click="handleCreate">
            新建
          </el-button>
        </virtual-table>
      </template>
      <template v-slot:right>
        <virtual-table
          ref="subTable"
          :columns="subColumns"
          rowKey="id"
          :fetch="subFetch"
        >
        </virtual-table>
      </template>
    </split-pane>
    <drawer
      width="80%"
      :visible.sync="actions.visible"
      :title="actions.title"
      @close="closeDrawerHandle"
    >
      <add-info
        :type="actions.type"
        :xhrAbort="actions.xhrAbort"
        :initialValue="actions.data"
        @close="closeDrawerHandle"
      />
    </drawer>
  </div>
</template>

<script>
import { getList, getSubList, del } from "@SYS/api/dictionary";
import SplitPane from "@/components/SplitPane";
import AddInfo from "./components/addInfo";
import { notifyAction, confirmAction, deepClone } from "@/utils";
let selectedDict;
export default {
  components: { SplitPane, AddInfo },
  data() {
    return {
      columns: this.createTableColumns(),
      subColumns: this.createTableSubColumns(),
      fetch: {
        api: getList,
        params: {},
        dataKey: "items",
        title: ""
      },
      subFetch: {
        api: getSubList,
        xhrAbort: true,
        params: { dict: "" },
        dataKey: "items"
      },
      selection: {
        type: "radio",
        selectedRowKeys: [],
        onChange: rows => {
          rows.length && this.handleSelectionChange(rows);
        }
      },
      actions: {
        type: "default",
        title: "",
        visible: false,
        xhrAbort: false,
        data: null
      }
    };
  },
  computed: {
    $table() {
      return this.$refs.table;
    },
    $subTable() {
      return this.$refs.subTable;
    }
  },
  mounted() {},
  methods: {
    // 创建表格列配置
    createTableColumns() {
      return [
        {
          title: "序号",
          dataIndex: "pageIndex",
          fixed: "left",
          width: 55,
          align: "center",
          sort: true,
          render: (row, column, cellValue, index) => index + 1
        },
        {
          title: "操作",
          dataIndex: "__action__", // 操作列的 dataIndex 的值不能改
          fixed: "left",
          width: 100,
          render: row => {
            return (
              <div>
                <el-button type="text" onClick={() => this.handleDataEdit(row)}>
                  编辑
                </el-button>
                <el-button
                  type="text"
                  onClick={() => this.handleDataDelete(row.dict)}
                >
                  删除
                </el-button>
              </div>
            );
          }
        },
        {
          title: "字典代码",
          dataIndex: "dict",
          width: 180
        },
        {
          title: "字典名称",
          dataIndex: "dictname",
          width: 180
        }
      ];
    },
    // 创建子表格列配置
    createTableSubColumns() {
      return [
        {
          title: "序号",
          dataIndex: "pageIndex",
          fixed: "left",
          width: 55,
          align: "center",
          sort: true,
          render: (row, column, cellValue, index) => index + 1
        },
        {
          title: "子项代码",
          dataIndex: "dictchild",
          sorter: true,
          filter: {
            type: "text"
          }
        },
        {
          title: "子项名称",
          dataIndex: "dictchildname",
          filter: {
            type: "text"
          }
        }
      ];
    },
    handleCreate() {
      this.actions = Object.assign({}, this.actions, {
        visible: true,
        title: "新增",
        data: null,
        type: "add"
      });
    },
    handleDataEdit(row) {
      this.actions = Object.assign({}, this.actions, {
        visible: true,
        title: "编辑",
        data: row,
        type: "edit"
      });
    },
    async handleDataDelete(dict) {
      try {
        await confirmAction();
        const { msg, status } = await del(dict);
        if (status === "S") {
          notifyAction(msg, "success");
          this.fetch.params = Object.assign({}, this.fetch.params);
        }
      } catch (err) {}
    },
    handleClose() {},
    // 主表选择 子表查询数据
    handleSelectionChange(rows) {
      selectedDict = rows[0].dict;
      this.subFetch.xhrAbort = false;
      this.subFetch.params = Object.assign({}, this.subFetch.params, {
        dict: selectedDict
      });
    },
    // 主表格数据变化触发
    handleDataChange(data) {
      if (data && data.length) {
        const isExit = data.findIndex(item => item.dict === selectedDict);
        if (isExit === -1) {
          this.selection.selectedRowKeys = [data[0].dict];
        }
      } else {
        selectedDict = "";
        this.selection.selectedRowKeys = [];
        this.$subTable.CLEAR_TABLE_DATA();
      }
    },
    // 主表行点击事件
    handleRowClick(row, column, event) {
      this.selection.selectedRowKeys = [row.dict];
    },
    // 关闭抽屉组件
    closeDrawerHandle(state, val) {
      console.log(state, val);
      // 重置 actions 的值
      this.actions = Object.assign(
        {},
        { type: "default", visible: state, xhrAbort: false, data: null }
      );
      if (val) {
        // 执行表格刷新
        this.fetch.params = Object.assign({}, this.fetch.params);
      }
    },
    closeDialogHandle(state, val) {
      // 重置 actions 的值
      this.actions = Object.assign(
        {},
        { type: "default", visible: state, xhrAbort: false, data: null }
      );
      if (val) {
        // 执行表格刷新
        this.fetch.params = Object.assign({}, this.fetch.params);
      }
    }
  }
};
</script>
<style lang="scss"></style>
