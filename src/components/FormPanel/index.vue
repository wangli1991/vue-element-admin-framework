<!--
 * @Author: 王利
 * @Date: 2020-09-18 06:47:17
 * @LastEditors: 王利
 * @LastEditTime: 2020-10-14 09:48:24
-->
<template>
  <div>
    <el-form ref="form" :model="form" :label-width="labelWidth === 'auto' ? 'auto' : labelWidth + 'px'" class="form-container">
      <template v-for="(item, index) in list">
        <el-col :key="index" :span="col">
          <el-form-item :label="item.label" :prop="item.fieldName" :rules="item.rules">
            <template v-if="item.type == 'INPUT'">
              <el-input v-model="form[item.fieldName]" :placeholder="placeholder" :clearable="clearable" :disabled="item.disabled" :readonly="item.readonly"></el-input>
            </template>
            <template v-if="item.type == 'INPUT_NUMBER'">
              <el-input-number v-model="form[item.fieldName]" :min="1" :max="10" label="描述文字"></el-input-number>
            </template>
            <template v-if="item.type == 'TEXTAREA'">
              <el-input v-model="form[item.fieldName]" type="textarea"></el-input>
            </template>
            <template v-if="item.type == 'SELECTION'">
              <el-select v-model="formList.region" placeholder="请选择活动区域">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </template>
            <template v-if="item.type == 'RANGE_DATE'">
              <el-col :span="11">
                <el-form-item prop="date1">
                  <el-date-picker v-model="formList.date1" type="date" placeholder="选择日期" style="width: 100%"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-form-item prop="date2">
                  <el-time-picker v-model="formList.date2" placeholder="选择时间" style="width: 100%"></el-time-picker>
                </el-form-item>
              </el-col>
            </template>
            <template v-if="item.type == 'SWITCH'">
              <el-switch v-model="formList.delivery"></el-switch>
            </template>
            <template v-if="item.type == 'CHECKBOX'">
              <el-checkbox-group v-model="formList.type">
                <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
                <el-checkbox label="地推活动" name="type"></el-checkbox>
                <el-checkbox label="线下主题活动" name="type"></el-checkbox>
                <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
              </el-checkbox-group>
            </template>
            <template v-if="item.type == 'RADIO'">
              <el-radio-group v-model="formList.resource">
                <el-radio label="线上品牌商赞助"></el-radio>
                <el-radio label="线下场地免费"></el-radio>
              </el-radio-group>
            </template>
          </el-form-item>
        </el-col>
      </template>
    </el-form>
  </div>
</template>
<script>
import { get, set, xor, transform, cloneDeep, isEqual, isObject, isFunction } from 'lodash';
export default {
  name: 'FormPanel',
  props: {
    title: {
      type: String,
    },
    labelWidth: {
      type: String,
      default: 'auto',
    },
    visible: {
      type: Boolean,
      default: false,
    },
    list: {
      type: Array,
    },
    initialValue: {
      type: Object,
    },
    col: {
      type: Number,
    },
    placeholder: {
      type: String,
      default: '请输入...',
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  computed: {
    form: {
      get() {
        return this.initialValue;
      },
      set(val) {
        this.$emit('update:initialValue', val);
      },
    },
  },
  mounted() {},
  methods: {
    submitForm() {
      console.log(this.initialValue);
    },
    resetForm() {
      this.$refs.form.resetFields();
    },
    // 处理 from 数据
    excuteFormValue(form) {
      this.formItemList
        .filter((x) => ['RANGE_DATE', 'RANGE_INPUT_NUMBER'].includes(x.type))
        .map((x) => x.fieldName)
        .forEach((fieldName) => {
          if (form[fieldName].length > 0) {
            let isEmpty = form[fieldName].every((x) => {
              let val = x ?? '';
              return val === '';
            });
            if (isEmpty) {
              form[fieldName] = [];
            }
          }
        });
      for (let attr in form) {
        if (form[attr] === '' || form[attr] === null) {
          form[attr] = undefined;
        }
        if (attr.includes('|') && Array.isArray(form[attr])) {
          let [start, end] = attr.split('|');
          form[start] = form[attr][0];
          form[end] = form[attr][1];
        }
      }
    },
    // 对返回数据进行格式化
    formatFormValue(form) {
      const formData = {};
      for (let key in form) {
        if (typeof form[key] !== 'undefined') continue;
        // formData[key] = '';
      }
      return cloneDeep(Object.assign({}, form, formData));
    },
    // 获取表单组件的值
    getFormData() {
      // this.excuteFormValue(this.form);
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
    // 外部通过组件实例调用的方法
    SUBMIT_FORM() {
      const err = this.submitForm();
      return !err ? this.formatFormValue(this.form) : null;
    },
    RESET_FORM() {
      this.resetForm();
    },
    // 设置表单项的值，参数是表单值得集合 { fieldName: val, ... }
    SET_FIELDS_VALUE(values = {}) {
      for (let key in values) {
        if (this.fieldNames.includes(key)) {
          let item = this.formItemList.find((x) => x.fieldName === key);
          this.form[key] = this.getInitialValue(item, values[key]);
        }
      }
    },
    SET_FORM_VALUES(values = {}) {
      for (let key in values) {
        if (this.fieldNames.includes(key)) {
          this.SET_FIELDS_VALUE({ [key]: values[key] });
        } else {
          this.form[key] = values[key];
        }
      }
    },
    CREATE_FOCUS(fieldName) {
      const formItem = this.formItemList.find((x) => x.fieldName === fieldName);
      if (!formItem) return;
      this.$refs[`${formItem.type}-${fieldName}`]?.focus();
    },
    async GET_FORM_DATA() {
      try {
        const res = await this.getFormData();
        return [false, this.formatFormValue(res)];
      } catch (err) {
        return [true, null];
      }
    },
    GET_FIELD_VALUE(fieldName) {
      return this.form[fieldName];
    },
  },
};
</script>
<style lang="scss">
.form-container {
  padding: 10px 15px;
  &::after {
    content: '';
    clear: both;
    display: block;
  }
}
</style>
