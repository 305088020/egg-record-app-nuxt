<template>
  <div style="background:#eee;padding: 10px">
    <Card :bordered="false">
      <p slot="title">
        <Icon type="ios-people" />
        客户信息
      </p>
      <a href="#" slot="extra">
        <Button type="primary" icon="md-add" @click="add()">新增</Button>
        <Button type="info" icon="md-download" @click="exportExcel()">导出</Button>
      </a>
      <Form ref="formInline" inline>
        <FormItem prop="user">
          <Input type="text" v-model="searchCustomer" placeholder="患者姓名/微信"> </Input>
        </FormItem>
        <FormItem>
          <Select v-model="searchDisease" clearable style="width:200px" placeholder="疾病类型">
            <Option v-for="item in diseaseList" :value="item.type" :key="item.id">{{ item.type }}</Option>
          </Select>
        </FormItem>
        <FormItem v-if="this.$store.state.user.role == 'admin'">
          <Select v-model="searchUserName" clearable style="width:200px" placeholder="客服姓名" @on-change="searchUserNameChange">
            <Option v-for="item in searchUserNameList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Select v-model="searchUserWechat" clearable style="width:200px" placeholder="客服微信">
            <Option v-for="item in searchUserWechatList" :value="item.wechat" :key="item.id">{{ item.wechat }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Select v-model="searchDeal" style="width:150px" clearable placeholder="成交/未成交">
            <Option value="成交" key="成交">成交</Option>
            <Option value="未成交" key="未成交">未成交</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Input type="text" v-model="searchRemark" placeholder="备注"> </Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit()">搜索</Button>
        </FormItem>
      </Form>
      <Table border stripe :columns="columns8" :data="cards.data" @on-sort-change="sortChange($event)">
        <template slot-scope="{ row }" slot="customerName">
          {{ row.user && row.user.name }}
        </template>
        <template slot-scope="{ row }" slot="datesolt">
          {{ row.date }}
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
          <Input v-model="formValidate.name" placeholder="患者姓名" style="width:200px"></Input>
        </FormItem>
        <FormItem label="年龄" prop="age">
          <Input type="number" v-model="formValidate.age" placeholder="年龄" style="width:200px"></Input>
        </FormItem>
        <br />
        <FormItem label="患者微信" prop="wechat">
          <Input v-model="formValidate.wechat" placeholder="患者微信" style="width:200px"> </Input>
        </FormItem>
        <FormItem label="疾病" prop="disease">
          <Select v-model="formValidate.diseaseArray" multiple style="width:200px">
            <Option v-for="item in diseaseList" :value="item.type" :key="item.id">{{ item.type }}</Option>
          </Select>
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
        <FormItem label="客服微信" prop="customer_wechat">
          <Select v-model="formValidate.customer_wechat" style="width:170px">
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
        <FormItem label="成交" prop="deal">
          <Select v-model="formValidate.deal" style="width:200px">
            <Option value="成交">成交</Option>
            <Option value="未成交">未成交</Option>
          </Select>
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
import { index, create, update, show, destroy, exportExcel } from '@/api/customer'
import { list } from '@/api/disease'
import { list as userList } from '@/api/creditCard/users'
import { index as wechatIndex, create as addWechat, destroy as deleteWechat } from '@/api/wechat'
export default {
  async asyncData({ $axios, store }) {
    console.log(store.state.user.role)
    let userId
    let searchUserWechatList
    if (store.state.user.role !== 'admin') {
      userId = store.state.user.userId
      searchUserWechatList = await wechatIndex({ userId: userId })
    } else {
      searchUserWechatList = await wechatIndex({})
    }
    const cards = await index({ limit: 10, currentPage: 1, sort: 'id,desc', user_id: userId })
    const diseaseList = await list()
    const searchUserNameList = await userList()

    return {
      diseaseList,
      searchUserNameList,
      searchUserWechatList,
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
          width: 100,
          fixed: 'left'
        },
        {
          title: '年龄',
          key: 'age',
          resizable: true,
          width: 70
        },

        {
          title: '地区',
          key: 'address',
          resizable: true,
          width: 220
        },
        {
          title: '疾病类型',
          key: 'disease',
          resizable: true,
          width: 120,
          sortable: true
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
          width: 120,
          sortable: true
        },
        {
          title: '客服姓名',
          key: 'user_id',
          slot: 'customerName',
          resizable: true,
          width: 120,
          sortable: true
        },
        {
          title: '成交',
          key: 'deal',
          resizable: true,
          width: 100,
          sortable: true
        },
        {
          title: '备注',
          key: 'remark'
        },
        {
          title: '登记时间',
          key: 'date',
          slot: 'datesolt',
          resizable: true,
          width: 120,
          sortable: true
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
      searchCustomer: null,
      searchDisease: null,
      searchUserName: null,
      searchUserWechat: null,
      searchDeal: null,
      searchRemark: null,
      formValidate: {
        name: '',
        age: '',
        customer_wechat: '',
        address: '',
        disease: '',
        diseaseArray: [],
        wechat: '',
        deal: '',
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
      const query = this.setQuery()
      this.cards = await index(query)
      this.total = this.cards.count
    },
    setQuery() {
      const query = { limit: this.pageSize, currentPage: this.pageIndex, sort: this.sort }
      if (this.$store.state.user.role !== 'admin') {
        query.user_id = this.$store.state.user.userId
      }
      if (this.searchCustomer != null && this.searchCustomer.trim() !== '') {
        query.searchCustomer = this.searchCustomer
      }
      if (this.searchDisease != null && this.searchDisease.trim() !== '') {
        query.searchDisease = this.searchDisease
      }
      if (this.searchUserName != null) {
        query.searchUserName = this.searchUserName
      }
      if (this.searchUserWechat != null && this.searchUserWechat.trim() !== '') {
        query.searchUserWechat = this.searchUserWechat
      }
      if (this.searchDeal != null && this.searchDeal.trim() !== '') {
        query.searchDeal = this.searchDeal
      }
      if (this.searchRemark != null && this.searchRemark.trim() !== '') {
        query.searchRemark = this.searchRemark
      }
      return query
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
      this.formValidate.diseaseArray = []
      this.formValidate.wechat = ''
      this.formValidate.deal = ''
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
        this.formValidate.diseaseArray = response.disease.split(',')

        this.formValidate.wechat = response.wechat
        this.formValidate.deal = response.deal
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
          const addressArray = []
          const provincesItem = this.getMapValue(this.provincesMap, this.formValidate.province)
          const cityItem = this.getMapValue(this.citysMap, this.formValidate.city)
          const communitysItem = this.getMapValue(this.communitysMap, this.formValidate.community)
          if (provincesItem && provincesItem !== '') {
            addressArray.push(provincesItem)
          }
          if (cityItem && cityItem !== '') {
            addressArray.push(cityItem)
          }
          if (communitysItem && communitysItem !== '') {
            addressArray.push(communitysItem)
          }
          this.formValidate.address = addressArray.join('/')

          console.log(this.formValidate.disease)
          if (this.formValidate.diseaseArray && this.formValidate.diseaseArray.length > 0) {
            this.formValidate.disease = this.formValidate.diseaseArray.join(',')
          }
          if (this.type === 'add') {
            create(this.formValidate).then(
              response => {
                if (response) {
                  this.loadData()
                  this.$Message.success('新增成功!')
                  this.modal1 = false
                }
              },
              () => {
                this.$Message.error('新增失败!')
              }
            )
          } else if (this.type === 'edit') {
            update(this.formValidate.id, this.formValidate).then(response => {
              if (response) {
                this.loadData()
                this.$Message.success('更新成功!')
                this.modal1 = false
              }
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
    },
    handleSubmit() {
      this.loadData()
    },
    async searchUserNameChange(value) {
      this.searchUserWechat = ''
      this.searchUserWechatList = await wechatIndex({ userId: value })
    },
    exportExcel() {
      const query = this.setQuery()
      const self = this
      const fileName = '导出信息表.xlsx'
      this.$Loading.start()
      exportExcel(query)
        .then(res => {
          if (res) {
            const blob = new Blob([res])
            if ('download' in document.createElement('a')) {
              // 创建a标签
              const link = document.createElement('a')
              // a标签添加属性
              link.download = fileName
              link.style.display = 'none'
              link.href = URL.createObjectURL(blob)
              document.body.appendChild(link)
              // 执行下载
              link.click()
              // 释放url
              URL.revokeObjectURL(link.href)
              // 释放标签
              document.body.removeChild(link)
              self.$Message.success('导出成功！')
              this.$Loading.finish()
            } else {
              navigator.msSaveBlob(blob, fileName)
              this.$Loading.finish()
            }
          } else {
            self.$Message.warning('转化Excel文件失败，请检查文件并且重试！')
            this.$Loading.finish()
          }
        })
        .catch(() => {
          // err
          this.$Message.error('导出失败！')
          this.$Loading.finish()
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
