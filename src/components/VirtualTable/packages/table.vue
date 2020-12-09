<!--
 * @Author: 王利
 * @Date: 2020-08-10 14:28:54
 * @LastEditors: 王利
 * @LastEditTime: 2020-12-08 10:32:29
-->
<template>
  <div class="table-container">
    <div class="v-top-info">
      <div class="v-space">
        <div class="v-slot" :style="{ 'text-align': topSpaceAlign }">
          <slot />
        </div>
      </div>
      <div class="v-actions">
        <screenfull
          class="v-screenfull"
          :fullscreen="tableFullscreen"
          @change="screenfullChange"
        />
      </div>
    </div>
    <div ref="vTable" class="v-table">
      <el-scrollbar ref="tableScrollbar" :wrapStyle="wrapStyle">
        <el-table
          ref="table"
          v-loading="listLoading"
          :row-key="rowKey"
          :data="list"
          border
          fit
          highlight-current-row
          :row-class-name="rowClassName"
          style="width: 100%"
          :height="tableHeight"
          @selection-change="selectionChange"
          @row-click="rowClick"
          @cell-click="cellClick"
        >
          <template v-if="rowSelection">
            <el-table-column
              v-if="rowSelection.type === 'checkbox'"
              fixed
              type="selection"
              align="center"
              width="55"
              column-key="selection"
            ></el-table-column>
            <el-table-column
              v-if="rowSelection.type === 'radio'"
              fixed
              align="center"
              width="55"
              label="选择"
              column-key="selection"
            >
              <template slot-scope="scop">
                <el-radio
                  v-model="checked"
                  :label="scop.row[rowKey]"
                  @change="radioChange(scop.row)"
                  ><span class="table-radio-label"></span
                ></el-radio>
              </template>
            </el-table-column>
          </template>
          <template v-for="(tableColumn, index) in columns">
            <el-table-column
              v-if="tableColumn.dataIndex == 'pageIndex'"
              :key="index"
              fixed
              :label="tableColumn.title"
              align="center"
              :width="tableColumn.width ? tableColumn.width : 'auto'"
            >
              <template slot-scope="scop">
                {{ scop.$index + 1 + (pagination.page - 1) * pagination.limit }}
              </template>
            </el-table-column>
            <el-table-column
              v-else-if="tableColumn.dataIndex == '__action__'"
              :key="index"
              fixed
              column-key="__action__"
              :label="tableColumn.title"
              align="center"
              :min-width="tableColumn.width ? tableColumn.width : 'auto'"
              :formatter="tableColumn.render"
            >
            </el-table-column>
            <el-table-column
              v-else
              :key="index"
              :label="tableColumn.title"
              :prop="tableColumn.dataIndex"
              align="center"
              :min-width="tableColumn.width ? tableColumn.width : 'auto'"
            >
              <template slot-scope="{ row, column }">
                <template
                  v-if="
                    tableColumn.editRender && isFunction(tableColumn.editRender)
                  "
                >
                  <template
                    v-if="funFormat(tableColumn.editRender(row)).editable"
                  >
                    <template
                      v-if="
                        funFormat(tableColumn.editRender(row)).type === 'text'
                      "
                    >
                      <el-input v-model="row[tableColumn.dataIndex]"></el-input>
                    </template>
                    <template
                      v-if="
                        funFormat(tableColumn.editRender(row)).type === 'number'
                      "
                    >
                      <el-input
                        v-model.number="row[tableColumn.dataIndex]"
                      ></el-input>
                    </template>
                  </template>
                  <template v-else>
                    <template
                      v-if="
                        funFormat(tableColumn.editRender(row)).type === 'text'
                      "
                    >
                      <template
                        v-if="funFormat(tableColumn.editRender(row)).disabled"
                      >
                        <span
                          v-if="funFormat(tableColumn.editRender(row)).disabled"
                          >{{ row[tableColumn.dataIndex] }}</span
                        >
                      </template>
                      <template v-else>
                        <el-input
                          v-if="
                            editIndex === row[rowKey] &&
                              editProp === column.property
                          "
                          v-model="row[tableColumn.dataIndex]"
                          @blur="blurHandle"
                        ></el-input>
                        <span v-else>{{ row[tableColumn.dataIndex] }}</span>
                      </template>
                    </template>
                    <template
                      v-if="
                        funFormat(tableColumn.editRender(row)).type === 'number'
                      "
                    >
                      <template
                        v-if="funFormat(tableColumn.editRender(row)).disabled"
                      >
                        <span
                          v-if="funFormat(tableColumn.editRender(row)).disabled"
                          >{{ row[tableColumn.dataIndex] }}</span
                        >
                      </template>
                      <template v-else>
                        <el-input
                          v-if="
                            editIndex === row[rowKey] &&
                              editProp === column.property
                          "
                          v-model.number="row[tableColumn.dataIndex]"
                          @blur="blurHandle"
                        ></el-input>
                        <span v-else>{{ row[tableColumn.dataIndex] }}</span>
                      </template>
                    </template>
                  </template>

                  <el-checkbox
                    v-if="
                      funFormat(tableColumn.editRender(row)).type === 'checkbox'
                    "
                    v-model="row[tableColumn.dataIndex]"
                    :disabled="funFormat(tableColumn.editRender(row)).disabled"
                    :true-label="
                      funFormat(tableColumn.editRender(row)).extra.trueValue
                    "
                    :false-label="
                      funFormat(tableColumn.editRender(row)).extra.falseValue
                    "
                  ></el-checkbox>
                </template>
                <span v-else>{{ row[tableColumn.dataIndex] }}</span>
              </template>
            </el-table-column>
          </template>
        </el-table>
      </el-scrollbar>
      <pagination
        v-show="total > 0"
        v-if="fetch.api"
        :total="total"
        :page.sync="pagination.page"
        :limit.sync="pagination.limit"
        :rows-count="rowsCount"
        @pagination="getList"
        @clear="handleRefresh"
      />
    </div>
  </div>
</template>
<script>
import Screenfull from "./screenFull";
import Pagination from "./Pagination";
import { isEqual, isFunction, isObject } from "lodash";
export default {
  name: "VirtualTable",
  components: { Screenfull, Pagination },
  props: {
    fetch: {
      type: Object,
      default() {
        return {
          api: "",
          params: {},
          xhrAbort: false,
          dataKey: "items"
        };
      }
    },
    dataSource: {
      type: Array,
      default() {
        return [];
      }
    },
    columns: {
      type: Array,
      default() {
        return [];
      }
    },
    rowSelection: {
      type: Object,
      default() {
        return {
          type: "",
          selectedRowKeys: [],
          onChange: null
        };
      }
    },
    rowKey: {
      type: [String, Function],
      default: "id"
    },
    loading: {
      type: Boolean,
      default: true
    },
    topSpaceAlign: {
      type: String,
      default: "right"
    }
  },
  data() {
    return {
      wrapStyle: {
        width: "100%",
        height: "100%"
      },
      tableHeight: 250,
      list: [
        {
          id: "1"
        }
      ],
      total: 0,
      listLoading: this.loading,
      pagination: {
        page: 1,
        limit: 10
      },
      rowsCount: 0,
      selectedRowKeys: [],
      checked: null,
      tableFetch: { ...this.fetch },
      tableFullscreen: false,
      editIndex: "",
      editProp: ""
    };
  },
  computed: {},
  watch: {
    fetch: {
      handler(val) {
        this.tableFetch.params = Object.assign(
          {},
          this.tableFetch.params,
          this.fetch.params
        );
        this.getList();
      },
      deep: true
    },
    list: {
      handler(val) {
        this.$emit("dataChange", val);
        if (val && val.length > 0 && this.rowSelection.type == "radio") {
          this.checked = val[0][this.rowKey];
          this.$refs.table.setCurrentRow(val[0]);
          this.rowsCount = 1;
          this.rowSelection.onChange([val[0]]);
        }
      },
      deep: true
    },
    loading(val) {
      this.listLoading = val;
    },
    dataSource(val) {
      this.list = val;
    }
  },
  mounted() {},
  created() {
    if (this.fetch.api) {
      this.tableFetch.params = Object.assign({}, this.tableFetch.params, {
        platform: "PC"
      });
      this.getList();
    }
  },
  methods: {
    async getList(val) {
      if (!!val) {
        this.tableFetch.params = Object.assign({}, this.tableFetch.params, {
          currentPage: val.currentPage,
          pageSize: val.pageSize
        });
      } else {
        this.tableFetch.params = Object.assign({}, this.tableFetch.params, {
          currentPage: this.pagination.page,
          pageSize: this.pagination.limit
        });
      }
      if (this.fetch.xhrAbort) {
        return;
      }
      this.listLoading = true;
      const { status, data } = await this.tableFetch.api(
        this.tableFetch.params
      );
      if (status === "S") {
        this.list = data[this.tableFetch.dataKey];
        this.total = data.total;
      }
      // 设置table高度
      this.tableHeight = this.$refs.vTable.offsetHeight - 40;
      // 隐藏loading
      this.listLoading = false;
    },
    selectionChange(rows) {
      this.rowsCount = rows.length;
      this.selectedRowKeys = [];
      rows.map(item => {
        this.selectedRowKeys.push(item[this.rowKey]);
        this.$refs.table.toggleRowSelection(item, true);
      });
      this.rowSelection.onChange(rows);
    },
    rowClick(row, column, event) {
      let flag = true;
      const columnIndex = column.property;
      const columnCell = this.columns.filter(
        x => x.dataIndex === columnIndex
      )[0];
      let columnRender;
      if (columnCell) {
        if (columnCell.editRender && isFunction(columnCell.editRender)) {
          columnRender = this.funFormat(columnCell.editRender(row));
          if (!columnRender.disabled) {
            flag = false;
          }
        }
      }
      if (columnRender) {
        this.$emit("rowClick", row, column, event);
      }
      if (column && column.columnKey === "__action__") {
        flag = false;
      }
      if (!flag) {
        return;
      }
      if (this.rowSelection) {
        if (this.rowSelection.type == "checkbox") {
          this.$refs.table.toggleRowSelection(row);
          this.$refs.table.setCurrentRow();
        }
        if (this.rowSelection.type == "radio") {
          this.rowSelection.onChange([row]);
          this.checked = row[this.rowKey];
        }
      }
      this.$emit("rowClick", row, column, event);
    },
    cellClick(row, column, cell, event) {
      this.editIndex = row[this.rowKey];
      this.editProp = column.property;
    },
    blurHandle() {
      this.editIndex = "";
      this.editProp = "";
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.table.toggleRowSelection(row);
        });
      } else {
        this.$refs.table.clearSelection();
      }
    },
    radioChange(row) {
      this.rowsCount = 1;
      this.rowSelection.onChange([row]);
    },
    rowClassName({ row, rowIndex }) {
      if (this.selectedRowKeys.includes(row[this.rowKey])) {
        return "current-row";
      }
    },
    handleRefresh(val) {
      this.$refs.table.clearSelection();
      this.$refs.table.setCurrentRow();
      this.$refs.table.clearSort();
      this.$refs.table.clearFilter();
      this.getList(val);
    },
    screenfullChange(e) {
      this.tableFullscreen = e.isFullscreen;
    },
    isFunction(val) {
      return isFunction(val);
    },
    funFormat(fun) {
      return fun;
    },
    // 对返回数据进行格式化
    formatFormValue(form) {
      const formData = {};
      for (let key in form) {
        if (typeof form[key] !== "undefined") continue;
        // formData[key] = '';
      }
      return cloneDeep(Object.assign({}, form, formData));
    },
    // 获取表单组件的值
    getFormData() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate((valid, fields) => {
          if (!valid) {
            reject(fields);
          } else {
            resolve(this.initialValue);
          }
        });
      });
    },
    async GET_FORM_DATA() {
      try {
        const res = await this.getFormData();
        return [false, this.formatFormValue(res)];
      } catch (err) {
        return [true, null];
      }
    },
    // 表单校验
    FORM_VALIDATE() {
      const editableColumns = this.flattenColumns.filter(column =>
        isFunction(column.editRender)
      );
      tableDataFlatMap(this.tableFullData).forEach(record => {
        editableColumns.forEach(column => {
          const { dataIndex, editRender } = column;
          const options = editRender(record);
          if (!options) return;
          const { rules = [], disabled } = options;
          if (!disabled && rules.length) {
            this.createFieldValidate(
              rules,
              getCellValue(record, dataIndex),
              this.getRowKey(record, record.index),
              dataIndex
            );
          }
        });
      });
      const { required, validate } = this.GET_LOG();
      const result = [...required, ...validate];
      // 定位未通过校验的字段
      if (result.length) {
        this.$$tableBody.scrollYToRecord(result[0].rowKey);
      }
      return { required, validate };
    },
    INSERT_RECORDS(records, dir = "bottom") {
      const rows = (Array.isArray(records) ? records : [records]).filter(x =>
        isObject(x)
      );
      if (dir === "top") {
        this.list.unshift(rows[0]);
      }
      if (dir === "bottom") {
        this.list.push(rows[0]);
      }
    },
    REMOVE_RECORDS(val) {
      this.list = this.list.filter(item => {
        return !val.includes(item);
      });
    },
    CLEAR_TABLE_DATA() {
      this.list = [];
      this.listLoading = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.table-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
::v-deep .v-top-info {
  width: 100%;
  display: flex;
  margin-bottom: 10px;
  .v-space {
    flex: 1;
    display: flex;
    justify-content: space-between;
    .v-slot {
      flex: 1;
      display: inline-table;
      height: 100%;
      margin-right: 10px;
    }
  }
  .v-actions {
    .v-screenfull {
      height: 28px;
      padding: 3px;
      display: flex;
      align-items: center;
    }
  }
}
::v-deep .v-table {
  width: 100%;
  flex: 1;
  // display: flex;
  // flex-direction: column;
  // .el-scrollbar {
  //   flex: 1;
  //   .el-scrollbar__view {
  //     height: 100%;
  //     .el-table {
  //       height: 100%;
  //       display: flex;
  //       flex-direction: column;
  //       .el-table__body-wrapper {
  //         flex: 1;
  //         overflow-x: auto;
  //       }
  //     }
  //   }
  // }
  .el-radio__label {
    display: none;
  }
}
</style>
