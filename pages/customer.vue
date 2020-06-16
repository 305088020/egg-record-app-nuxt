<template>
  <div style="background:#eee;padding: 10px">
    <Card :bordered="false">
      <p slot="title">
        <Icon type="ios-people" />
        客户信息
      </p>
      <a href="#" slot="extra" @click.prevent="add">
        <Button type="primary" icon="md-add">新增</Button>
      </a>
      <Table border stripe :columns="columns8" :data="cards.data" @on-sort-change="sortChange($event)">
        <template slot-scope="{ row }" slot="customerName">
          {{ row.user.name }}
        </template>
        <template slot-scope="{ row }" slot="action">
          <Button type="primary" size="small" style="margin-right: 5px" @click="edit(row.id)">编辑</Button>
          <Button type="error" size="small" @click="remove(row.id)">删除</Button>
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
    <Modal v-model="modal1" width="800" :title="title" :okText="okText" :mask-closable="false" @on-cancel="cancel">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" inline>
        <FormItem label="患者姓名" prop="name">
          <Input v-model="formValidate.name" placeholder="患者姓名"></Input>
        </FormItem>
        <FormItem label="年龄" prop="age">
          <Input type="number" v-model="formValidate.age" placeholder="年龄"></Input>
        </FormItem>
        <FormItem label="地区" prop="address">
          <Select v-model="formValidate.province" style="width:200px" @on-change="provinceChange">
            <Option v-for="item in provinces" :value="item.id" :key="item.fullname">{{ item.fullname }}</Option>
          </Select>
          <Select v-model="formValidate.city" style="width:200px" @on-change="cityChange">
            <Option v-for="item in citys" :value="item.id" :key="item.fullname">{{ item.fullname }}</Option>
          </Select>
          <Select v-model="formValidate.community" clearable style="width:200px" v-if="hasCommunity">
            <Option v-for="item in communitys" :value="item.id" :key="item.fullname">{{ item.fullname }}</Option>
          </Select>
        </FormItem>
        <FormItem label="患者微信" prop="wechat">
          <Input v-model="formValidate.wechat" placeholder="患者微信"> </Input>
        </FormItem>
        <FormItem label="疾病" prop="disease">
          <Select v-model="formValidate.disease" style="width:200px">
            <Option v-for="item in diseaseList" :value="item.type" :key="item.id">{{ item.type }}</Option>
          </Select>
        </FormItem>
        <FormItem label="客服微信" prop="customer_wechat">
          <Select v-model="formValidate.customer_wechat" style="width:200px">
            <Option v-for="item in wechatList" :value="item.wechat" :key="item.id">{{ item.wechat }}</Option>
          </Select>
          <Button
            v-if="this.formValidate.user_id === this.$store.state.user.userId"
            icon="ios-add"
            shape="circle"
            type="primary"
            @click="addWechat"
          ></Button>
        </FormItem>
        <FormItem label="时间" prop="date">
          <DatePicker type="datetime" v-model="formValidate.date" placeholder="Select date" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem label="备注" prop="remark">
          <Input style="width:600px" :rows="4" type="textarea" v-model="formValidate.remark" placeholder="备注"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancel">取消</Button>
        <Button type="primary" @click="ok('formValidate')">确定</Button>
      </div>
    </Modal>
    <Modal v-model="wechatModel" title="添加微信" footer-hide>
      <Input v-model="newWechat">
        <Button slot="append" icon="ios-add" @click="addNewWechat"></Button>
      </Input>
      <br />
      <List border>
        <ListItem v-for="item in wechatList" :key="item.wechat"
          >{{ item.wechat }}
          <template slot="action">
            <Button type="error" ghost shape="circle" icon="ios-trash" @click="deleteWechat(item)"></Button>
          </template>
        </ListItem>
      </List>
    </Modal>
  </div>
</template>

<script>
import { index, create, update, show, destroy } from '@/api/customer'
import { list } from '@/api/disease'
import { index as wechatIndex, create as addWechat, destroy as deleteWechat } from '@/api/wechat'
export default {
  async asyncData({ $axios, store }) {
    console.log(store.state.user.role)
    let userId
    if (store.state.user.role !== 'admin') {
      userId = store.state.user.userId
    }
    const cards = await index({ limit: 10, currentPage: 1, sort: 'id,desc', user_id: userId })
    return {
      cards,
      total: cards.count,
      columns8: [
        // {
        //   title: '序号',
        //   key: 'id'
        // },
        {
          title: '患者姓名',
          key: 'name',
          resizable: true,
          width: 100
        },
        {
          title: '年龄',
          key: 'age',
          resizable: true,
          width: 100
        },

        {
          title: '地区',
          key: 'address',
          resizable: true,
          width: 100
        },
        {
          title: '疾病类型',
          key: 'disease',
          resizable: true,
          width: 120,
          sortable: 'disease'
        },
        {
          title: '患者微信',
          key: 'wechat',
          resizable: true,
          width: 100
        },
        {
          title: '客服微信',
          key: 'customer_wechat',
          resizable: true,
          width: 100,
          sortable: 'customer_wechat'
        },
        {
          title: '客服姓名',
          slot: 'customerName',
          resizable: true,
          width: 100,
          sortable: 'user_id'
        },
        {
          title: '备注',
          key: 'remark'
        },
        {
          title: '登记时间',
          key: 'date',
          resizable: true,
          width: 180,
          sortable: 'date'
        },
        {
          title: '操作',
          slot: 'action',
          width: 140,
          resizable: true,
          align: 'center',
          fixed: 'right'
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
      diseaseList: [],
      wechatList: [],
      provinces: [],
      citys: [],
      communitys: [],
      provincesMap: [],
      citysMap: [],
      communitysMap: [],
      hasCommunity: true,
      wechatModel: false,
      newWechat: '',
      addButtonFlag: true,
      formValidate: {
        name: '',
        age: '',
        customer_wechat: '',
        address: '',
        disease: '',
        wechat: '',
        remark: '',
        date: '',
        user_id: ''
      },
      ruleValidate: {
        // name: [{ required: true, message: '账户不能为空', trigger: 'blur' }],
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
      let userId
      if (this.$store.state.user.role !== 'admin') {
        userId = this.$store.state.user.userId
      }
      this.cards = await index({ limit: this.pageSize, currentPage: this.pageIndex, sort: this.sort, user_id: userId })
      this.total = this.cards.count
    },
    async loadDiseaseList() {
      this.diseaseList = await list()
    },
    async loadWechatList(id) {
      if (id) {
        this.wechatList = await wechatIndex({ userId: id })
      } else {
        this.wechatList = await wechatIndex({})
      }
    },
    async loadCityData(id) {
      // const province = await loadCity()
      const query = {
        key: 'ZBABZ-SNM3R-SP4WE-WWDUX-6H4UH-PSBT7',
        output: 'jsonp'
      }
      if (id) {
        query.id = id
      }
      return await this.$jsonp('http://apis.map.qq.com/ws/district/v1/getchildren', query).then(json => {
        return json.result[0]
      })
    },
    async provinceChange(id) {
      this.citys = await this.loadCityData(id)
      this.citysMap = this.citys
    },
    async cityChange(id) {
      if (id == null) {
        return
      }
      if (id.length > 6) {
        this.hasCommunity = false
        this.communitys = []
        this.communitysMap = []
      } else {
        this.communitys = await this.loadCityData(id)
        this.communitysMap = this.communitys
      }
    },

    loadCity() {},
    async add() {
      this.loadDiseaseList()
      this.loadWechatList(this.$store.state.user.userId)
      this.provinces = await this.loadCityData()
      this.provincesMap = this.provinces
      this.modal1 = true
      this.type = 'add'
      this.title = '新 增'
      this.okText = '保 存'
      this.formValidate.name = ''
      this.formValidate.age = ''
      this.formValidate.customer_wechat = ''
      this.formValidate.address = ''
      this.formValidate.province = ''
      this.formValidate.city = ''
      this.formValidate.community = ''
      this.formValidate.disease = ''
      this.formValidate.wechat = ''
      this.formValidate.remark = ''
      this.formValidate.date = new Date()
      this.formValidate.user_id = this.$store.state.user.userId
      this.addButtonFlag = true
    },
    async edit(id) {
      this.type = 'edit'
      this.title = '更 新'
      this.okText = '保 存'
      this.modal1 = true
      this.loadDiseaseList()
      this.provinces = await this.loadCityData()
      this.provincesMap = this.provinces
      //
      const vm = this
      show(id).then(async response => {
        this.formValidate.id = response.id
        this.formValidate.name = response.name
        this.formValidate.age = response.age
        this.formValidate.address = response.address
        this.formValidate.disease = response.disease
        this.formValidate.wechat = response.wechat
        this.formValidate.remark = response.remark
        this.formValidate.date = response.date
        this.formValidate.user_id = response.user_id
        if (response.user_id !== this.$store.state.user.userId) {
          this.addButtonFlag = false
        }
        const addressArray = response.address.split('/')
        if (addressArray) {
          this.formValidate.province = await this.getMapId(this.provincesMap, addressArray[0])
          await this.provinceChange(this.formValidate.province)
          this.formValidate.city = await this.getMapId(this.citysMap, addressArray[1])
          await this.cityChange(this.formValidate.city)
          this.formValidate.community = vm.getMapId(vm.communitysMap, addressArray[2])
        }
        await this.loadWechatList(response.user_id)
        this.formValidate.customer_wechat = response.customer_wechat
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
    getMapValue(list, id) {
      const item = list.find(k => {
        return k.id === id
      })
      if (item) {
        return item.fullname
      } else {
        return ''
      }
    },
    getMapId(list, fullname) {
      const item = list.find(k => {
        return k.fullname === fullname
      })
      if (item) {
        return item.id
      } else {
        return ''
      }
    },
    ok(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.formValidate.address = [
            this.getMapValue(this.provincesMap, this.formValidate.province),
            this.getMapValue(this.citysMap, this.formValidate.city),
            this.getMapValue(this.communitysMap, this.formValidate.community)
          ].join('/')
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
      console.log(this.$store.state.user.token)
      this.modal1 = false
      this.$refs.formValidate.resetFields()
    },
    addWechat() {
      this.wechatModel = true
    },
    addNewWechat() {
      // 新增微信
      if (this.newWechat == null || this.newWechat === '') {
        this.$Message.info('填写微信号')
        return
      }
      const newWechat = {
        wechat: this.newWechat,
        user_id: this.$store.state.user.userId
      }
      addWechat(newWechat).then(response => {
        if (response) {
          this.newWechat = ''
          this.loadWechatList(this.$store.state.user.userId)
        }
      })
    },
    deleteWechat(wechat) {
      deleteWechat(wechat.id).then(response => {
        if (response) {
          this.loadWechatList(this.$store.state.user.userId)
        }
      })
    }
  }
}
</script>
<style scoped>
table tbody tr td {
  text-align: center;
}
</style>
