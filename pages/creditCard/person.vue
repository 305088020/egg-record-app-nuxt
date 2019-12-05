<template>
  <div>
    <Card>
      <div class="search-con search-con-top">
        <Row type="flex" justify="end" class="code-row-bg">
          <Col>
            <Button class="search-btn" type="primary" @click="add"><Icon type="search" />&nbsp;&nbsp;新 增</Button>
            <Modal v-model="modal12" :title="title" :okText="okText" :mask-closable="false">
              <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                <FormItem label="名 称：" prop="name">
                  <Input v-model="formValidate.name" placeholder="name" @keydown.native.enter.prevent="save('formValidate')"></Input>
                </FormItem>
              </Form>
              <div slot="footer">
                <Button type="primary" size="large" @click="save('formValidate')">保 存</Button>
              </div>
            </Modal>
          </Col>
        </Row>
      </div>
      <div>
        <Table stripe :columns="columns" :data="bank">
          <template slot-scope="{ row }" slot="action">
            <Button type="primary" size="small" style="margin-right: 5px" @click="edit(row.id)">编 辑</Button>
            <Button type="error" size="small" @click="remove(row.id)">删 除</Button>
          </template>
        </Table>
      </div>
    </Card>
  </div>
</template>

<script>
import { index, create, show, update, destroy } from '@/api/creditCard/person'
export default {
  components: {},
  data() {
    const validateuser = function(rule, value, callback) {
      if (value.trim() === '') {
        return callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    return {
      columns: [
        {
          title: 'Id',
          key: 'id'
        },
        {
          title: 'Name',
          key: 'name'
        },
        {
          title: '创建时间',
          key: 'created_at'
        },
        {
          title: '操作',
          slot: 'action',
          width: 150,
          align: 'center'
        }
      ],
      bank: [],
      modal12: false,
      title: '',
      okText: '',
      type: '',
      formValidate: {
        name: ''
      },
      ruleValidate: {
        name: [{ required: true, validator: validateuser, message: '名称不可为空！', trigger: 'blur' }]
      }
    }
  },
  async asyncData({ context }) {
    const bank = await index()
    return { bank }
  },
  methods: {
    add() {
      this.type = 'add'
      this.title = '新 增'
      this.okText = '保 存'
      this.modal12 = true
      this.formValidate.name = ''
    },
    edit(id) {
      this.type = 'edit'
      this.title = '更 新'
      this.okText = '保 存'
      this.modal12 = true
      //
      show(id).then(response => {
        this.formValidate.id = response.id
        this.formValidate.name = response.name
      })
    },
    remove(id) {
      destroy(id).then(response => {
        if (response) {
          this.show()
          this.$Message.success('删除成功！')
        }
      })
    },
    save(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          // 保存
          if (this.type === 'add') {
            create(this.formValidate.name.trim()).then(response => {
              if (response) {
                this.show()
                this.$Message.success('新增成功!')
                this.modal12 = false
              }
            })
          } else if (this.type === 'edit') {
            update(this.formValidate.id, this.formValidate.name.trim()).then(response => {
              this.show()
              this.$Message.success('更新成功!')
              this.modal12 = false
            })
          }
        }
      })
    },
    show() {
      index().then(response => {
        this.bank = response
      })
    }
  }
}
</script>
<style>
.search-con {
  padding: 10px 0;
  .search {
    &-col {
      display: inline-block;
      width: 200px;
    }
    &-input {
      display: inline-block;
      width: 200px;
      margin-left: 2px;
    }
    &-btn {
      margin-left: 2px;
    }
  }
}
</style>
