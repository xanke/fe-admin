import Fetch from '@/utils/fetch'

export default {
  data() {
    return {
      columns: [],
      actions: {},
      Fetch,
      loading: true,
      list: []
    }
  },

  created() {
    this.initTable(`/${this.apiName}`)
  },

  methods: {
    init(params) {
      this.updateList(`/${this.apiName}`, params)
    },

    handleAction(e) {
      if (typeof e === 'string') {
        this[`handle${e}`]()
      } else {
        const { mode = 'Row' } = e
        this[`handle${mode}Action`](e)
      }
    },

    handleMultipleAction(action) {
      this.$confirm('确认执行?', '提示', {
        type: 'warning'
      }).then(() => {
        if (action === 'Delete') {
          const ids = this.multipleSelection.map(_ => _.id).join(',')
          this.handleDelete(ids)
        }
      })
    },

    confirmAction(fn) {
      return this.$confirm('确认执行?', '提示', {
        type: 'warning'
      }).then(() => {
        fn()
      })
    },

    async initTable(url) {
      this.loading = true
      const data = await this.Fetch.get(url, { resources: 'table' })
      this.columns = data.columns
      this.actions = data.actions
    },
    // 读取数据
    async updateList(url, params) {
      this.loading = true
      const { list, total } = await this.Fetch.get(url, params)
      this.$refs.DmConsole.updateTotal(total)

      setTimeout(() => {
        this.list = list
        this.loading = false
      }, 300)
    },

    updateApi(url, form) {
      const mode = form._mode
      if (mode === 'EDIT') {
        return this.Fetch.put(`${url}/${form.id}`, form)
      } else {
        return this.Fetch.post(url, form)
      }
    },

    actionSuccess() {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
    }
  }
}
