<template>
  <div class="hello">
    子应用首页HelloWorld
    <el-button v-on:click="open">开启</el-button>
    <el-button v-on:click="close">关闭</el-button>
    <el-table :data="tableData" v-th-table-ctr="tableCtr" border style="width: 100%">
      <el-table-column v-for="(item, index) in columns" :key="index" :prop="item.prop" :label="item.label">
         <template slot-scope="scope">
            <div>{{scope.row[item.prop]}}</div>
         </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data () {
    return {
      tableCtr: {
        init: false,
        tableExcel: null,
        onPaste: this.paste
      },
      columns: [
        { prop: 'date', label: '日期' },
        { prop: 'name', label: '姓名' },
        { prop: 'address', label: '地址' },
        { prop: 'age', label: '年龄' },
        { prop: 'heig', label: '身高' },
        { prop: 'tzhong', label: '体重' }
      ],
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        age: 67890,
        heig: 134678,
        tzhong: 9078678
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄',
        age: 32,
        heig: 565,
        tzhong: 7878
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄',
        age: 4343,
        heig: 3334,
        tzhong: 5677
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄',
        age: 98,
        heig: 456,
        tzhong: 12
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄',
        age: 98,
        heig: 456,
        tzhong: 12
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄',
        age: 98,
        heig: 456,
        tzhong: 12
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄',
        age: 98,
        heig: 456,
        tzhong: 12
      }]
    }
  },
  // computed: {
  //   // 通过global获取user的信息
  //   ...mapState('global', {
  //     user: state => state.user
  //   })
  // },
  mounted () {
  },
  methods: {
    open () {
      this.tableCtr.tableExcel.openSwitch()
    },
    close () {
      this.tableCtr.tableExcel.closeSwitch()
    },
    gotoSubReact () {
      window.rootRouter.push({ path: '/portal/personal/home', query: { name: '黄玉超', age: '290' } })
    },
    paste (e) {
      const oldData = _.cloneDeep(this.tableData)
      const newData = _.cloneDeep(this.tableData)
      e.forEach(item => {
        newData[item.targetPoint.rowIndex][this.columns[item.targetPoint.cellIndex].prop] = oldData[item.sourePoint.rowIndex][this.columns[item.sourePoint.cellIndex].prop]
      })
      this.tableData = newData
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.hello {
  width: 100%;
  padding: 10px;
}

img {
  width: 100%;
  // height: 1000px;
}
</style>
