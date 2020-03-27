<template>
  <div>
    <zj-form ref="form" :newDataFlag='newdata' label-position="top" :model="model" :rules="form_rules"
      hide-required-asterisk>
      <el-form-item prop="c_name" size="large">
        <span slot="label" style="font-size:16px;font-weight:bold;">
          公司名称
          <span style="font-size:13px;color:#E6A23C">
            （公司名称与《部门管理》中的顶级部门名称保持同步）
          </span>
        </span>
        <el-input style="width:700px;" v-model="model.c_name"></el-input>
      </el-form-item>
      <el-form-item prop="c_eng_name" size="large">
        <span slot="label" style="font-size:16px;font-weight:bold;">公司英文名称</span>
        <el-input style="width:700px;" v-model="model.c_eng_name"></el-input>
      </el-form-item>
      <el-form-item size="large">
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </zj-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      model: {},
      form_rules: {
        c_name: [
          { required: true, message: "公司名称不能为空", trigger: "blur" }
        ],
        c_eng_name: [{ validator: this.validator.isAlpha, trigger: "blur" }]
      },
      newdata: false
    };
  },
  methods: {
    onSubmit() {
      let form = this.$refs.form;
      form.validate(valid => {
        if (valid) {
          this.model.UpdateColumns = form.UpdateColumns;
          if (this.model.UpdateColumns) {
            this.z_put("api/company", this.model)
              .then(res => {
                this.newdata = false;
                setTimeout(() => {
                  this.newdata = true;
                }, 1000);
                this.$message({
                  message: "保存成功",
                  type: "success",
                  duration: 1000
                });
              })
              .catch(res => {
                this.$alert("保存失败" + res.msg, "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
              });
          } else {
            this.$message("无更改");
          }
        }
      });
    }
  },
  mounted() {
    this.z_get("api/company", { c_id: 1 })
      .then(res => {
        this.model = res.data;
        this.newdata = true;
      })
      .catch(res => {
        this.$alert("加载失败：" + res.msg, "提示", {
          confirmButtonText: "确定",
          type: "error"
        });
      });
  }
};
</script>

<style scoped>
</style>