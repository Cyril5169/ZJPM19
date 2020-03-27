import Vue from 'vue';
import { Form, Table } from 'element-ui';

/*
*带UpdateColumn的el-table
*/
Vue.component('zj-form', {
    mixins: [Form],
    props: {
        newDataFlag: {
            type: Boolean,
            default: false
        },
    },
    watch: {
        newDataFlag: {
            deep: true,
            immediate: true,
            handler(val) {
                if (val) {
                    this.comparativeData = JSON.parse(JSON.stringify(this.model));
                }
            }
        },
    },
    data() {
        return {
            comparativeData: [],
            updateColumns: null,
        }
    },
    computed: {
        UpdateColumns: {
            get: function () {
                return this.getUpdateColumns();
            }
        }
    },
    methods: {
        getUpdateColumns() {
            this.updateColumns = null;
            Object.keys(this.comparativeData).forEach(key => {
                if (key == 'children') return;
                if (key == 'UpdateColumns') return;
                if (this.model[key] == "" && this.comparativeData[key] == null) return;
                if (this.model[key] != this.comparativeData[key]) {
                    if (this.updateColumns == null) this.updateColumns = [];
                    this.updateColumns.push(key);
                }
            });
            return this.updateColumns;
        }
    }
})

/*
*外层flex布局下可以自动高度的el-table,必须定义height属性
*/
Vue.component('zj-table', {
    mixins: [Table],
    props: {
        autoHeight: {
            type: Boolean,
            default: false
        },
    },
    watch: {
        autoHeight: {
            deep: true,
            handler() {
                this.resizeTable();
            }
        },
    },
    methods: {
        resizeTable() {
            this.layout.setHeight(0);
            //this.doLayout();
            let that = this;
            this.$nextTick(function () {
                let h = that.$el.parentNode.offsetHeight;
                that.layout.setHeight(h - 1);//offsetHeight被取整了，这里多减去1
                //that.doLayout();
            });
        }
    },
    mounted() {
        this.resizeTable();
    }
})

Vue.component('zj-table-column', {
    template: '\
    <el-table-column :prop="prop" :label="label" :align="alignStyle" :width="width">\
        <template slot-scope="scope">\
           <div v-html="colorRenderFilter(scope.row[prop], dict[prop])"></div>\
        </template>\
    </el-table-column>\
    ',
    props: ['prop', 'label', 'align', 'width', "dict"],
    computed: {
        //默认居中
        alignStyle() {
            return this.align || 'center'
        }
    },
    data() {
        return {
            column_dict: this.dict
        }
    },
    watch: {
        dict: {
            immediate: true,
            deep: true,
            handler() {
                this.column_dict = this.dict;
            }
        }
    },
    methods: {
        colorRenderFilter(id, renderData) {
            var name = id;
            var bgcolor = "";
            var color = "";
            if (renderData) {
                var displayName = renderData.filter(item => item.value == id);
                if (displayName.length) {
                    name = displayName[0].display;
                    bgcolor = displayName[0].bgcolor;
                    color = bgcolor ? "#000" : "";
                }
            }
            return `<div style="color:${color};background:${bgcolor}">${name}<div>`;
        }
    }
})