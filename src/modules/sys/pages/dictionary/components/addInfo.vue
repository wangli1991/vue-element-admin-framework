<template>
  <div class="container">
    <form-panel
      ref="formPanel"
      :initial-value="formDefaultValue"
      :list="formList"
      :formType="type"
      label-width="90"
      :scrollContainer="$scrollNode"
    />
    <virtual-table
      v-if="isShowSubTable"
      ref="table"
      height="auto"
      :dataSource="list"
      :columns="subColumns"
      rowKey="id"
      :rowSelection="selection"
      :loading="loading"
      :columnsChange="columns => (this.columns = columns)"
      @dataChange="dataChangeHandle"
      @rowClick="handleRowClick"
    >
      <el-button type="primary" icon="el-icon-plus" @click="handleDataCreate"
        >新增</el-button
      >
      <el-button type="danger" icon="el-icon-delete" @click="handleDataRemove"
        >删除</el-button
      >
    </virtual-table>
    <div class="info-btn">
      <el-button @click="cancelHandle()">取 消</el-button>
      <el-button type="primary" @click="saveHandle">提 交</el-button>
    </div>
  </div>
</template>

<script>
import { save, getSubList, update } from "@SYS/api/dictionary";
import { notifyAction, confirmAction, createUidKey } from "@/utils";
let createData = [],
  updateData = [],
  deleteData = [],
  currentData;
export default {
  props: ["type", "initialValue"],
  data() {
    this.selectedKeys = [];
    return {
      formList: this.createFormList(),
      formDefaultValue: { ...this.initialValue },
      subColumns: this.createTableSubColumns(),
      isShowSubTable: false,
      list: [],
      loading: false,
      selection: {
        type: "checkbox",
        selectedRowKeys: this.selectedKeys,
        onChange: rows => {
          this.selectedKeys = rows;
        }
      }
    };
  },
  computed: {
    $formPanel() {
      return this.$refs.formPanel;
    },
    $scrollNode() {
      return this.$parent.$el.querySelector(".container");
    },
    $table() {
      return this.$refs.table;
    },
    isUpdate() {
      return this.initialValue && this.initialValue.id;
    }
  },
  mounted() {
    if (this.isUpdate) {
      this.isShowSubTable = true;
      this.findFormItem("dict").disabled = true;
      this.getSubList();
    } else {
      this.isShowSubTable = false;
    }
  },
  methods: {
    // 创建 form
    createFormList() {
      return [
        {
          type: "INPUT",
          label: "字典代码",
          fieldName: "dict",
          disabled: false,
          rules: [
            { required: true, message: "请输入字典代码", trigger: "blur" }
          ]
        },
        {
          type: "INPUT",
          label: "字典名称",
          fieldName: "dictname",
          rules: [
            { required: true, message: "请输入字典名称", trigger: "blur" }
          ]
        }
      ];
    },
    // 创建子表列
    createTableSubColumns() {
      return [
        {
          title: "子项代码",
          dataIndex: "dictchild",
          sorter: true,
          required: true,
          width: 160,
          filter: {
            type: "text"
          },
          editRender: row => {
            return {
              type: "text",
              disabled: this.isUpdate && !row.id.toString().startsWith("new-"),
              editable: row.id.toString().startsWith("new-"),
              rules: [{ required: true, message: "请输入子项代码" }]
            };
          }
        },
        {
          title: "子项名称",
          dataIndex: "dictchildname",
          required: true,
          width: 160,
          filter: {
            type: "text"
          },
          editRender: row => {
            return {
              type: "text",
              editable: row.id.toString().startsWith("new-"),
              rules: [{ required: true, message: "请输入子项名称" }]
            };
          }
        },
        {
          title: "序列号",
          dataIndex: "sort",
          width: 100,
          editRender: row => {
            return {
              type: "number",
              editable: row.id.toString().startsWith("new-")
            };
          }
        },
        {
          title: "停用标识",
          dataIndex: "stop",
          width: 100,
          editRender: row => {
            return {
              type: "checkbox",
              editable: row.id.toString().startsWith("new-"),
              extra: {
                trueValue: "0",
                falseValue: "1"
              }
            };
          },
          dictItems: [
            { text: "已停用", value: "0" },
            { text: "未停用", value: "1" }
          ]
        }
      ];
    },
    // 获取子表数据
    async getSubList() {
      this.loading = true;
      const { code, data } = await getSubList({
        dict: this.initialValue.dict
      });
      this.loading = false;
      if (code === 200) {
        this.list = data.items;
      }
    },
    // 提交前统一处理子表变化的数据
    getChildChangeData() {
      const childUpdate = updateData.filter(
        item => !deleteData.includes(item.id)
      );
      const childAdd = createData
        .filter(item => !deleteData.includes(item.id))
        .map(item => {
          const obj = { ...item };
          delete obj.id;
          return obj;
        });
      const childDel = deleteData
        .filter(id => !id.toString().startsWith("new-"))
        .join(",");
      return {
        childUpdate,
        childAdd,
        childDel
      };
    },
    // 提交表单
    async saveHandle() {
      let result;
      const [err, res] = await this.$formPanel.GET_FORM_DATA();
      if (err) return;
      if (this.isUpdate) {
        // 编辑时子表table验证
        // const { required, validate } = this.$table.FORM_VALIDATE();
        // if (required.length > 0 || validate.length > 0) {
        //   return;
        // }
        const data = {
          main: res,
          ...this.getChildChangeData()
        };
        result = await update(data);
      } else {
        result = await save(res);
      }
      if (result.status === "S") {
        notifyAction(result.msg, "success");
        this.cancelHandle("refresh");
      }
    },
    // 查找表单项元素
    findFormItem(val) {
      return this.formList.find(x => x.fieldName === val);
    },
    // 取消事件
    cancelHandle(val) {
      updateData = [];
      deleteData = [];
      createData = [];
      currentData = null;
      this.$emit("close", false, val);
    },
    // 新建数据
    handleDataCreate() {
      this.$table.INSERT_RECORDS(
        {
          id: createUidKey("new-"),
          sort: 0,
          stop: "1",
          dict: this.initialValue.dict
        },
        "top"
      );
    },
    // 子表数据改变
    dataChangeHandle(data) {
      console.log(data, currentData);
      if (currentData) {
        const type = currentData.id.toString().startsWith("new-")
          ? createData
          : updateData;
        const index = type.findIndex(item => item.id === currentData.id);
        if (index === -1) {
          type.push(currentData);
        } else {
          type[index] = currentData;
        }
      }
    },
    // 子表行点击
    handleRowClick(row, column, event) {
      console.log(row);
      currentData = row;
    },
    // 删除按钮
    async handleDataRemove() {
      if (!this.selectedKeys.length) {
        return notifyAction(`请选择数据！`, "warning");
      }
      try {
        await confirmAction();
        this.$table.REMOVE_RECORDS(this.selectedKeys);
        deleteData = deleteData.concat(this.selectedKeys.map(item => item.id));
      } catch (err) {}
    }
  }
};
</script>

<style lang="scss" scoped>
.info-btn {
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 9;
  border-top: 1px solid #d9d9d9;
  padding: 10px 15px;
  background: #fff;
  text-align: right;
}
</style>
