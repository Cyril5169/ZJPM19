<template>
  <div>
    <div class="tbar">
      <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="searchDataFile"></el-button>
      <el-input size="small" @keyup.enter.native="refreshDataFile" placeholder="请输入资料类型" v-model="fileCondition"
        clearable style="width:250px;">
        <el-button size="small" @click="refreshDataFile" slot="append" icon="el-icon-search">搜索</el-button>
      </el-input>
      <el-button type="primary" size="small" style="margin-left:10px;" @click="addNewDataFileShow">上传文档
      </el-button>
      <el-button type="danger" size="small" :disabled="dataSelection.length==0" @click="deleteDataFileList">
        删除选中文档({{dataSelection.length}})
      </el-button>
    </div>

    <div class="gridTable" style="width:75%;">
      <el-table ref="dataFileTable" v-loading="loading" style="width:100%;" height="200" :data="dataFileList"
        tooltip-effect="dark" highlight-current-row border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column label="序号" type="index" width="55" align="center">
        </el-table-column>
        <el-table-column prop="ddt_name" label="资料类型" align="center" width="140">
        </el-table-column>
        <el-table-column prop="file_name" label="文档" align="center" width="200">
        </el-table-column>
        <el-table-column prop="note" label="备注" align="center" width="150"></el-table-column>
        <el-table-column label="操作" width="140" prop="handle">
          <template slot-scope="scope">
            <el-button type="info" icon="el-icon-download" size="mini" circle @click="downLoadOne(scope.row.file_path)">
            </el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteOneFile(scope.row)">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 上传输入文档 -->
    <el-dialog :width=" DataFileModelList.length? '935px':'565px'" title="新增输入文档" :close-on-click-modal="false"
      :visible.sync="addDataFileVisible">
      <div class="transferDiv">
        <div class="leftTransferItem">
          <div class="tbar">
            <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="searchDataList"></el-button>
            <el-select size="small" v-model="selectDataType" @change="refreshDataList" ref="selectDataType"
              style="width:180px;" placeholder="请选择资料类型">
              <el-option v-for="item in dataTpyeList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <el-input size="small" @keyup.enter.native="refreshDataList" placeholder="请输入资料名称"
              v-model="dataListCondition" clearable style="width:240px;">
              <el-button size="small" @click="refreshDataList" slot="append" icon="el-icon-search">搜索</el-button>
            </el-input>
          </div>
          <div>
            <span style="color:gray;font-size:12px;">*双击选择资料</span>
            <el-table ref="itemListTable" v-loading="loading2" style="width:160%;" height="300" :data="dataList"
              tooltip-effect="dark" @row-dblclick="handleRowDbClcik" border stripe>
              <el-table-column prop="td_name" label="资料名称" align="center" width="160"></el-table-column>
              <el-table-column prop="ddt_id" label="资料类型" align="center">
                <template slot-scope="scope">{{scope.row.ddt_id | renderFilter(dataTypeFilter)}}</template>
              </el-table-column>
              <el-table-column prop="td_quantity" label="需求数量" align="center" width="140">
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="rightTransferItem" v-if="DataFileModelList.length">
          <div style="margin-bottom:10px">
            <span style="color:gray;font-size:12px;">*一条记录只能上传一个文件</span>
          </div>
          <fieldset class="oneItem" v-for="(item,index) in DataFileModelList" :key="index">
            <legend>文档{{index+1}} <el-button type="danger" icon="el-icon-delete" size="mini" circle
                @click="deleteSelectFile(index)"></el-button>
            </legend>
            <el-form size="small" :model="item" label-width="80px" :rules="addItem_rules">
              <el-form-item label="资料类型" prop="ddt_id">
                <el-select v-model="item.ddt_id" placeholder="请选择需求类型">
                  <el-option v-for="item in dataTypeFilter" :key="item.value" :label="item.display" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="需求类型" prop="tdf_type">
                <el-select v-model="item.tdf_type" placeholder="请选择需求类型">
                  <el-option v-for="item in tdfType_options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="输入文档">
                <el-upload class="upload-de" action="#" list-type="text"
                  :on-change="function(file,fileList){return  handleChange(file,fileList,index)}"
                  :on-remove="function(file,fileList){return  handleRemove(file,fileList,index)}"
                  :file-list="item.fileList" :limit=1  :http-request="uploadFiles">   <!-- :auto-upload="false"-->
                  <i class="el-icon-upload2"> <span style="font-size:13px;">上传</span></i>
                </el-upload>
              </el-form-item>
              <el-form-item label="备注" prop="item_note">
                <el-input v-model="item.note" type="textarea" :rows="2" placeholder="备注信息">
                </el-input>
              </el-form-item>
            </el-form>
          </fieldset>
        </div>
        <div class="bottomButton" v-if="DataFileModelList.length">
          <el-button size="medium" @click="addDataFileVisible = false">取&nbsp;&nbsp;消</el-button>
          <el-button type="primary" size="medium" @click="onSaveDataFileListClick" style="margin-left:30px;">
            保&nbsp;&nbsp;存
          </el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 修改输入文档_暂时不用 -->
    <el-dialog v-if="selectDataVisible" v-dialogDrag width="450px" :title="addOrNot?'上传输入文档':'编辑输入文档'"
      :close-on-click-modal="false" :visible.sync="selectDataVisible">
      <zj-form size="small" :newDataFlag='selectDataVisible' :model="dataFileModel" label-width="100px"
        ref="dataFileForm" :rules="addItem_rules">
        <el-form-item label="资料类型" prop="ddt_id">
          <el-select v-model="dataFileModel.ddt_id" placeholder="请选择资料类型">
            <el-option v-for="item in dataTpyeList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="需求类型" prop="tdf_type">
          <el-select v-model="dataFileModel.tdf_type" placeholder="请选择需求类型">
            <el-option v-for="item in tdfType_options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="输入文档">
          <el-upload class="upload-de" action="#" list-type="text"
            :on-change="function(file,fileList){return  handleChange(file,fileList,index)}"
            :on-remove="function(file,fileList){return  handleRemove(file,fileList,index)}" :file-list="item.fileList"
            :http-request="uploadFiles">
            <i class="el-icon-upload2"> <span style="font-size:13px;">上传</span></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="备注">
          <el-input class="formItem" type="textarea" :rows="2" v-model="dataFileModel.note" placeholder="备注信息">
          </el-input>
        </el-form-item>
        <el-form-item style="text-align:center;margin-right:100px;">
          <el-button size="medium" @click="selectDataVisible = false">取&nbsp;&nbsp;消</el-button>
          <el-button type="primary" size="medium" @click="onSaveDataFileClick" style="margin-left:30px;">保&nbsp;&nbsp;存
          </el-button>
        </el-form-item>
      </zj-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ["currentRow"],
  data() {
    return {
      fileCondition: "", //搜索输入文档的关键字
      dataListCondition: "", //搜索该任务资料需求的关键字
      dataSelection: [], //选中的任务输入文档记录集合
      dataList: [], //某任务的资料需求记录集合
      dataFileList: [], //某任务的输入文档记录集合
      DataFileModelList: [], //待提交的输入文档集合
      dataFileModel: {}, //匹配资料需求的输入文档实体
      // uploadFileModel: {}, //上传的文件记录实例ist
      // uploadFileModelList: [], //上传的文件记录集合
      fileNameList: [], //输入文档名称集合
      addOrNot: false,
      addDataFileVisible: false,
      loading: false,
      loading2: false,
      selectDataVisible: false, //是否显示新增/编辑所需物料的弹出框
      dataTypeFilter: [],
      fileFilter: [],
      selectDataType: "", //新增输入文档中选中的资料类型
      dataTpyeList: [], //新增输入文档中资料类型的下拉框数据集合
      fileChange: false,
      deleteFile: [],
      dateStamp: "",
      tdfType_options: [
        {
          value: 1,
          label: "输入"
        },
        {
          value: 2,
          label: "输出"
        }
      ],
      addItem_rules: {}
    };
  },
  watch: {
    currentRow: {
      //当选中任务后，执行查询任务输入文档记录的方法
      deep: true,
      immediate: true,
      handler() {
        this.searchDataFile();
      }
    }
  },
  filters: {
    isDoneTrans(value) {
      switch (value) {
        case 0:
          return "未达成";
          break;
        case 1:
          return "达成";
          break;
      }
    }
  },
  methods: {
    //获取资料类型数据
    getDataTypeList() {
      this.dataTpyeList = [];
      this.z_get("api/document_data_type", {}, { loading: false })
        .then(res => {
          if (res.code == 0) {
            this.dataTpyeList = res.data;
            for (var i = 0; i < this.dataTpyeList.length; i++) {
              this.dataTpyeList[i].label = this.dataTpyeList[i].ddt_name;
              this.dataTpyeList[i].value = this.dataTpyeList[i].ddt_id;
            }
          }
        })
        .catch(res => {});
    },
    //刷新任务的输入文档
    refreshDataFile() {
      this.loading = true;
      this.dataFileList = [];
      this.z_get(
        "api/task_data_file/list",
        {
          t_id: this.currentRow.t_id,
          condition: this.fileCondition
        },
        { loading: false }
      )
        .then(res => {
          this.loading = false;
          this.dataFileList = res.data.dic;
        })
        .catch(res => {});
    },
    //刷新任务的资料需求
    refreshDataList() {
      this.loading2 = true;
      this.dataList = [];
      this.z_get(
        "api/task_data/forFile",
        {
          t_id: this.currentRow.t_id,
          condition: this.dataListCondition,
          ddt_id: this.selectDataType
        },
        { loading: false }
      )
        .then(res => {
          this.loading2 = false;
          this.dataTypeFilter = res.dict.ddt_id;
          this.dataList = res.data;
        })
        .catch(res => {});
    },
    //查询任务的输入文档
    searchDataFile() {
      this.fileCondition = "";
      this.refreshDataFile();
    },
    //查询任务的资料需求集合
    searchDataList() {
      this.dataListCondition = "";
      this.selectDataType = "";
      this.refreshDataList();
    },
    //当前选中的节点
    handleSelectionChange(val) {
      this.dataSelection = val;
    },
    //显示上传任务的输入文档界面
    addNewDataFileShow() {
      this.DataFileModelList = [];
      this.fileNameList = [];
      this.searchDataList();
      this.dateStamp = new Date().getTime();
      this.addOrNot = true;
      this.addDataFileVisible = true;
    },
    //双击选中物料
    handleRowDbClcik(row) {
      this.dataFileModel = {
        tdf_id: 0,
        t_id: this.currentRow.t_id,
        ddt_id: row.ddt_id,
        file_id: 0,
        note: "",
        tdf_type: "",
        c_id: 1, //暂时写死，之后用缓存
        fileList: []
      };
      // this.uploadFileModel = {
      //   file_id: 0,
      //   file_path: "",
      //   file_note: "",
      //   c_id: 1 //暂时写死，之后用缓存
      // };
      //新增
      this.DataFileModelList.push(
        JSON.parse(JSON.stringify(this.dataFileModel))
      );
      this.addOrNot = true;
    },
    //保存选中输入文档至待提交的输入文档集合/编辑任务输入文档
    onSaveDataFileClick() {
      this.$refs.dataFileForm.validate(valid => {
        if (valid) {
          //修改
          this.dataFileModel.UpdateColumns = this.$refs.dataFileForm.UpdateColumns;
          if (this.dataFileModel.UpdateColumns) {
            this.z_put("api/task_data_file", this.dataFileModel)
              .then(res => {
                this.$message({
                  message: "编辑成功!",
                  type: "success",
                  duration: 1000
                });
                this.refreshDataFile();
                this.selectDataVisible = false;
              })
              .catch(res => {
                this.$alert("编辑失败!", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
              });
          } else {
            this.selectDataVisible = false;
          }
        }
      });
    },
    //提交新增的输入文档集合
    onSaveDataFileListClick() {
      //判断每条记录是否都上传了文档
      for (var i = 0; i < this.DataFileModelList.length; i++) {
        if (this.DataFileModelList[i].fileList.length == 0) {
          this.$alert("每条记录都必须上传输入文档", "提示", {
            confirmButtonText: "确定",
            type: "warning"
          });
          return;
        }
      }
      this.z_post("api/task_data_file/list", this.DataFileModelList,{
            params: { fileNameList:this.fileNameList }
          })
        .then(res => {
          this.$message({
            message: "新增成功!",
            type: "success",
            duration: 1000
          });
          this.addDataFileVisible = false;
          this.refreshDataFile();
        })
        .catch(res => {
          this.$alert("新增失败!", "提示", {
            confirmButtonText: "确定",
            type: "error"
          });
        });
    },
    //删除待提交的输入文档集合中的元素
    deleteSelectFile(index) {
      this.DataFileModelList.splice(index, 1);
    },
    //显示编辑任务物料需求记录的框体
    editDataFileShow(row) {
      this.dataFileModel = JSON.parse(JSON.stringify(row));
      this.dateStamp = new Date().getTime();
      this.addOrNot = false;
      this.selectDataVisible = true;
    },
    //删除一个输入文档
    deleteOneFile(row) {
      var tdfIdList = [];
      tdfIdList.push(row.tdf_id);
      console.log(tdfIdList);
      this.onDeleteFileClick(tdfIdList);
      // var list = [];
      // list.push(row);
      // console.log(list);
      // this.onDeleteFileClick(list);
    },
    //删除多个资料需求
    deleteDataFileList() {
      if (this.dataSelection.length) {
        var tdfIdList = [];
        for (var i = 0; i < this.dataSelection.length; i++) {
          tdfIdList.push(this.dataSelection[i].tdf_id);
        }
        console.log(tdfIdList);
        this.onDeleteFileClick(tdfIdList);
      }
      // if (this.dataSelection.length) {
      //   this.onDeleteFileClick(this.dataSelection);
      // }
    },
    //确认删除物料需求
    onDeleteFileClick(list) {
      this.$confirm("是否删除选中的文档？", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          this.z_delete("api/task_data_file/byId", {
            data: list,
            loading: false
          })
            .then(res => {
              this.$message({
                message: "删除成功!",
                type: "success",
                duration: 1000
              });
              this.refreshDataFile();
            })
            .catch(res => {
              this.$alert("删除失败:" + res.msg, "提示", {
                confirmButtonText: "确定",
                type: "error"
              });
            });
        })
        .catch(() => {});
    },
    //上传文件
    uploadFiles(param) {
      const formData = new FormData();
      formData.append("file", param.file);
      this.fileNameList.push(param.file.name);
      this.z_post("api/file_manager/upload", formData).then(res => {});
      // const formData = new FormData();
      // formData.append("file", param.file);
      // this.fileNameList.push(param.file.name);
      // this.z_post("api/file_manager/upload", formData).then(res => {});
    },
    //下载文件
    downLoadOne(path) {
      this.downLoadFile(this.Global.baseUrl + `api/DownLoadAPI?path=${path}`);
    },
    handleChange(file, fileList, index) {
      this.DataFileModelList[index].fileList = fileList;
    },
    handleRemove(file, fileList, index) {
      this.DataFileModelList[index].fileList = fileList;
      if ((file.status = "success")) {
        this.deleteFile.push(file.url);
      }
    },
    handleSuccess(res, file, fileList, index) {
      var flag = true;
      for (let i = 0; i < this.DataFileModelList.length; i++) {
        if (
          this.DataFileModelList[i].fileList.filter(
            item => item.status == "uploading"
          ).length == 0 &&
          this.DataFileModelList[i].fileList.filter(
            item => item.status == "success"
          ).length == this.DataFileModelList[i].fileList.length
        ) {
          this.fileNameList.push(file.name);
        } else {
          flag = false;
          break;
        }
      }
      if (flag) {
        if (this.addOrNot) {
        }
      }
    }
  },
  created() {
    this.getDataTypeList();
  }
};
</script>

<style scoped>
.transferDiv {
  display: inline;
}
.leftTransferItem {
  display: inline-block;
  vertical-align: middle;
  width: 500px;
  height: 400px;
}
.rightTransferItem {
  display: inline-block;
  vertical-align: middle;
  margin-left: 20px;
  width: 350px;
  height: 400px;
  overflow-x: hidden;
  overflow-y: auto;
}
.oneItem {
  border: 1px solid #eee;
  margin-bottom: 10px;
}
.bottomButton {
  text-align: center;
  margin: 10px 0;
}
.upload-de .el-upload-dragger {
  height: 30px;
  width: 50px;
}
</style>