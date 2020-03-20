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
                if ((this.model[key] != "" && this.comparativeData[key] != null)
                    && this.model[key] != this.comparativeData[key]) {
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
                that.layout.setHeight(h);
                //that.doLayout();
            });
        }
    },
    mounted() {
        this.resizeTable();
    }
})