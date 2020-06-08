<template>
  <div style="background:#eee;padding: 10px">
    <Card :bordered="false">
      <p slot="title">
        <Icon type="md-person-add" />
        用户
      </p>
      <a href="#" slot="extra" @click.prevent="add">
        <Button type="primary" icon="md-add">新增</Button>
      </a>
      <Table border stripe :columns="columns8" :data="cards.data" @on-sort-change="sortChange($event)">
        <template slot-scope="{ row }" slot="action">
          <Button type="primary" size="small" style="margin-right: 5px" @click="edit(row.id)">编辑</Button>
          <Button type="error" v-if="row.username !== 'admin'" size="small" @click="remove(row.id)">删除</Button>
        </template>
      </Table>
      <br />
      <Row type="flex" justify="end" class="code-row-bg">
        <Col><Page :total="total" show-total show-sizer @on-change="onChange($event)" @on-page-size-change="onPageSizeChange($event)"/></Col>
      </Row>
    </Card>
    <Modal v-model="modal2" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>删除</span>
      </p>
      <div style="text-align:center">
        <p>确认要删除吗？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="modal_loading" @click="comfirmDel()">删 除</Button>
      </div>
    </Modal>
    <Modal v-model="modal1" :title="title" :okText="okText" :mask-closable="false" @on-cancel="cancel">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="用户名" prop="username">
          <Input v-model="formValidate.username" placeholder="用户名"></Input>
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input v-model="formValidate.password" placeholder="密码"></Input>
        </FormItem>
        <FormItem label="姓名" prop="name">
          <Input v-model="formValidate.name" placeholder="姓名"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancel">取消</Button>
        <Button type="primary" @click="ok('formValidate')">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { index, create, update, show, destroy } from '@/api/creditCard/users'
export default {
  async asyncData({ $axios }) {
    const cards = await index({ limit: 10, currentPage: 1, sort: 'id,desc' })

    return {
      cards,
      total: cards.count,
      columns8: [
        {
          title: '序号',
          key: 'id'
        },
        {
          title: '账户名',
          key: 'username',
          sortable: 'custom'
        },
        {
          title: '姓名',
          key: 'name',
          sortable: 'custom'
        },
        {
          title: '密码',
          key: 'password'
        },
        {
          title: '操作',
          slot: 'action',
          resizable: true,
          width: 350,
          align: 'center'
        }
      ]
    }
  },
  data() {
    return {
      modal2: false,
      modal_loading: false,
      currentDeleteId: '',
      pageIndex: 1,
      pageSize: 10,
      sort: 'id,desc',
      modal1: false,
      title: '',
      okText: '',
      type: '',
      formValidate: {
        username: '',
        password: '',
        name: ''
      },
      ruleValidate: {
        username: [{ required: true, message: '账户不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    async onChange(pageIndex) {
      this.pageIndex = pageIndex
      await this.loadData()
    },
    async onPageSizeChange(pageSize) {
      this.pageSize = pageSize
      if (this.pageIndex === 1) {
        await this.loadData()
      }
    },
    async sortChange(sort) {
      if (sort.order !== 'normal') {
        this.sort = [sort.key, sort.order]
      } else {
        this.sort = 'id,desc'
      }
      await this.loadData()
    },
    async loadData() {
      this.cards = await index({ limit: this.pageSize, currentPage: this.pageIndex, sort: this.sort })
      this.total = this.cards.count
    },
    add() {
      this.modal1 = true
      this.type = 'add'
      this.title = '新 增'
      this.okText = '保 存'
      this.formValidate.username = ''
      this.formValidate.password = ''
      this.formValidate.name = ''
    },
    edit(id) {
      this.type = 'edit'
      this.title = '更 新'
      this.okText = '保 存'
      this.modal1 = true
      //
      show(id).then(response => {
        this.formValidate.id = response.id
        this.formValidate.username = response.username
        this.formValidate.password = response.password
        this.formValidate.name = response.name
      })
    },
    comfirmDel() {
      this.modal_loading = true
      destroy(this.currentDeleteId).then(response => {
        if (response) {
          this.modal_loading = false
          this.modal2 = false
          this.loadData()
          this.$Message.success('删除成功！')
        }
      })
    },
    remove(id) {
      this.modal2 = true
      this.currentDeleteId = id
    },
    ok(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.type === 'add') {
            create(this.formValidate).then(response => {
              if (response) {
                this.loadData()
                this.$Message.success('新增成功!')
                this.modal1 = false
              }
            })
          } else if (this.type === 'edit') {
            update(this.formValidate.id, this.formValidate).then(response => {
              this.loadData()
              this.$Message.success('更新成功!')
              this.modal1 = false
            })
          }
        }
      })
    },
    cancel() {
      this.modal1 = false
      this.$refs.formValidate.resetFields()
    }
  }
}
</script>
