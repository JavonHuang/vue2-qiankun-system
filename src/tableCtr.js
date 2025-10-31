import ThTableExcel from './tableExcel'

export default {
  name: 'th-table-ctr',
  directive: {
    bind: function (el, binding) {
      binding.value.tableExcel = new ThTableExcel(el, binding.value.init)
    }
  }
}
