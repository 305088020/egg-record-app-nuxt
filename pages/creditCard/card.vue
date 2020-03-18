<template>
  <div>
    <Modal
      v-model="payModel"
      :title="payTitle"
      :okText="payOkText"
      :mask-closable="false"
      @keydown.native.enter.prevent="savePayModel('payFormValidate')"
    >
      <Form ref="payFormValidate" :model="payFormValidate" :rules="payRuleValidate" :label-width="100">
        <FormItem label="额度：" prop="amount">
          <InputNumber
            v-model="payFormValidate.amount"
            :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            :parser="value => value.replace(/\$\s?|(,*)/g, '')"
            style="width:200px"
            placeholder="额度"
          ></InputNumber>
        </FormItem>
        <FormItem label="日期：" prop="tradeTime">
          <DatePicker v-model="payFormValidate.tradeTime" type="date" placeholder="Select date" style="width: 200px"></DatePicker>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="cancelPayModel('payFormValidate')">取 消</Button>
        <Button type="primary" @click="savePayModel('payFormValidate')">保 存</Button>
      </div>
    </Modal>
    <Card>
      <div class="search-con search-con-top">
        <Row type="flex" justify="end" class="code-row-bg">
          <Col>
            <Button class="search-btn" type="primary" @click="add"><Icon type="search" />&nbsp;&nbsp;新 增</Button>
            <Button class="search-btn" type="success" @click="updateAllBill()">更新账单</Button>

            <Modal
              v-model="modal12"
              :title="title"
              :okText="okText"
              :mask-closable="false"
              :styles="{ top: '20px' }"
              @keydown.native.enter.prevent="save('formValidate')"
            >
              <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                <FormItem label="Person：" prop="person_id">
                  <Select v-model="formValidate.person_id">
                    <Option v-for="item in persons" :key="item.id" :value="item.id">{{ item.name }}</Option>
                  </Select>
                </FormItem>
                <FormItem label="Bank：" prop="bank_id">
                  <Select v-model="formValidate.bank_id">
                    <Option v-for="item in banks" :key="item.id" :value="item.id">{{ item.name }}</Option>
                  </Select>
                </FormItem>
                <FormItem label="卡号：" prop="code">
                  <Input v-model="formValidate.code" placeholder="卡号"></Input>
                </FormItem>
                <FormItem label="密码：" prop="password">
                  <Input v-model="formValidate.password" placeholder="密码"></Input>
                </FormItem>
                <FormItem label="额定额度：" prop="quota">
                  <InputNumber
                    v-model="formValidate.quota"
                    :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                    :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                    style="width:200px"
                    placeholder="额定额度"
                  ></InputNumber>
                </FormItem>
                <FormItem label="可用额度：" prop="amount">
                  <InputNumber
                    v-model="formValidate.amount"
                    :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                    :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                    style="width:200px"
                    placeholder="可用额度"
                  ></InputNumber>
                </FormItem>
                <FormItem label="账单日：" prop="billing_day">
                  <InputNumber v-model="formValidate.billing_day" style="width:100px" placeholder="账单日"></InputNumber>
                </FormItem>
                <FormItem label="还款日：" prop="repayment_day">
                  <InputNumber v-model="formValidate.repayment_day" style="width:100px" placeholder="还款日"></InputNumber>
                </FormItem>
                <FormItem label="费率：" prop="interest">
                  <InputNumber v-model="formValidate.interest" style="width:100px" placeholder="费率"></InputNumber>
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
        <Table border highlight-row stripe :columns="columns" :data="cards">
          <template slot-scope="{ row }" slot="person">
            {{ ((row.person && row.person.name) || '') + '-' + ((row.bank && row.bank.name) || '') + '-' + row.code }}
          </template>
          <template slot-scope="{ row }" slot="quota">
            {{ row.quota | currency }}
          </template>
          <template slot-scope="{ row }" slot="amount">
            {{ row.amount | currency }}
          </template>
          <template slot-scope="{ row }" slot="bill">
            <div v-bind:style="closeLastDate((row.bill && row.bill.repayDate) || '')">
              {{ ((row.bill && row.bill.amount) || '') | currency }}
            </div>
          </template>
          <template slot-scope="{ row }" slot="lastDay">
            <div v-bind:style="closeLastDate((row.bill && row.bill.repayDate) || '')">
              {{ (row.bill && row.bill.repayDate) || '' | dateformat('YYYY-MM-DD') }}
            </div>
          </template>
          <template slot-scope="{ row }" slot="action">
            <Button type="warning" size="small" style="margin-right: 5px" @click="pay(row.id)">刷 卡</Button>
            <Button type="success" size="small" style="margin-right: 5px" @click="repay(row.id)">还 卡</Button>
            <Button type="primary" size="small" style="margin-right: 5px" @click="updateBill(row.id)">账单</Button>
            <Button type="primary" size="small" style="margin-right: 5px" @click="edit(row.id)">编 辑</Button>
            <Button type="error" size="small" @click="remove(row.id)">删 除</Button>
          </template>
        </Table>
      </div>
    </Card>
  </div>
</template>

<script>
import * as dateFns from 'date-fns'
// import * as sd from 'silly-datetime'
// import moment from 'moment'
import { index, create, show, update, destroy, pay, updateBill, updateAllBill } from '@/api/creditCard/card'
import { index as personIndex } from '@/api/creditCard/person'
import { index as bankIndex } from '@/api/creditCard/bank'
export default {
  components: {},
  data() {
    return {
      columns: [
        {
          title: '用户',
          resizable: true,
          width: 180,
          slot: 'person'
        },
        {
          title: '密码',
          key: 'password'
        },
        {
          title: '额定额度',
          slot: 'quota'
        },
        {
          title: '可用额度',
          slot: 'amount'
        },
        {
          title: '账单',
          slot: 'bill'
        },
        {
          title: '最后还款日',
          slot: 'lastDay'
        },
        {
          title: '账单日',
          resizable: true,
          width: 80,
          key: 'billing_day'
        },
        {
          title: '还款日',
          resizable: true,
          width: 80,
          key: 'repayment_day'
        },
        {
          title: '操作',
          slot: 'action',
          resizable: true,
          width: 350,
          align: 'center'
        }
      ],
      cards: [],
      modal12: false,
      payModel: false,
      title: '',
      okText: '',
      type: '',
      formValidate: {
        person_id: '',
        bank_id: '',
        code: '',
        password: '',
        quota: 0.0,
        amount: 0.0,
        interest: 0.0,
        billing_day: 0,
        repayment_day: 0
      },
      ruleValidate: {
        person_id: [{ required: true, message: 'person不可为空！', trigger: 'change', type: 'number' }],
        bank_id: [{ required: true, message: 'bank不可为空！', trigger: 'change', type: 'number' }],
        code: [{ required: true, message: '卡号不可为空！', trigger: 'blur' }],
        password: [{ required: true, message: '密码不可为空！', trigger: 'blur' }],
        quota: [{ required: true, message: '额度不可为空！', trigger: 'blur', type: 'number' }],
        amount: [{ required: true, message: '可用额度不可为空！', trigger: 'blur', type: 'number' }],
        billing_day: [{ required: true, message: '账单日不可为空！', trigger: 'blur', type: 'number' }],
        repayment_day: [{ required: true, message: '还款日不可为空！', trigger: 'blur', type: 'number' }]
      },
      payFormValidate: {
        card_id: '',
        amount: 0.0,
        direction: '',
        tradeTime: ''
      },
      payRuleValidate: {
        amount: [{ required: true, message: '额度不可为空！', trigger: 'blur', type: 'number' }],
        tradeTime: [{ required: true, message: '日期不可为空！', trigger: 'blur', type: 'date' }]
      },
      payTitle: '',
      payOkText: '',
      payType: ''
    }
  },
  async asyncData({ context }) {
    // 人员
    const persons = await personIndex()
    // 银行
    const banks = await bankIndex()

    const cards = await index()

    return { persons, banks, cards }
  },
  methods: {
    add() {
      this.type = 'add'
      this.title = '新 增'
      this.okText = '保 存'
      this.modal12 = true
      this.formValidate.person_id = ''
      this.formValidate.bank_id = ''
      this.formValidate.code = ''
      this.formValidate.password = ''
      this.formValidate.quota = 0.0
      this.formValidate.amount = 0.0
      this.formValidate.interest = 5.3
      this.formValidate.billing_day = 0
      this.formValidate.repayment_day = 0
      this.formValidate.created_at = new Date()
    },
    edit(id) {
      this.type = 'edit'
      this.title = '更 新'
      this.okText = '保 存'
      this.modal12 = true
      //
      show(id).then(response => {
        this.formValidate.id = response.id
        this.formValidate.person_id = response.person_id
        this.formValidate.bank_id = response.bank_id
        this.formValidate.code = response.code
        this.formValidate.password = response.password
        this.formValidate.quota = Number(response.quota)
        this.formValidate.amount = Number(response.amount)
        this.formValidate.interest = Number(response.interest)
        this.formValidate.billing_day = response.billing_day
        this.formValidate.repayment_day = response.repayment_day
      })
    },
    updateBill(id) {
      updateBill(id).then(() => {
        this.show()
      })
    },
    updateAllBill() {
      updateAllBill().then(() => {
        this.show()
      })
    },
    // 刷卡
    pay(id) {
      this.payTitle = '刷 卡'
      this.payOkText = '保 存'
      this.payType = '-'
      this.payModel = true
      //
      this.payFormValidate.card_id = id
      this.payFormValidate.amount = ''
      this.payFormValidate.tradeTime = new Date()
      this.payFormValidate.direction = '-'
    },
    // 还卡
    repay(id) {
      this.payTitle = '还 卡'
      this.payOkText = '保 存'
      this.payType = '+'
      this.payModel = true
      //
      this.payFormValidate.card_id = id
      this.payFormValidate.amount = ''
      this.payFormValidate.tradeTime = new Date()
      this.payFormValidate.direction = '+'
    },
    cancelPayModel() {
      this.payModel = false
    },
    savePayModel(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          // 保存
          pay(this.payFormValidate).then(response => {
            if (response) {
              this.show()
              this.$Message.success('保存成功!')
              this.payModel = false
            }
          })
        }
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
            create(this.formValidate).then(response => {
              if (response) {
                this.show()
                this.$Message.success('新增成功!')
                this.modal12 = false
              }
            })
          } else if (this.type === 'edit') {
            update(this.formValidate.id, this.formValidate).then(response => {
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
        let cards = response
        cards = cards.map(card => {
          const bills = card.bills
          let code = dateFns.format(new Date(), 'yyyy-MM')
          const year = new Date().getFullYear()
          const month = new Date().getMonth()
          const day = new Date().getDate()

          if (parseInt(day) < parseInt(card.billing_day)) {
            // 上个月账单
            code = dateFns.format(new Date(year, month - 1, card.billing_day), 'yyyy-MM')
          }
          if (bills && bills.length > 0) {
            card.bills = card.bills.filter(bill => {
              return bill.code.indexOf(code) >= 0
            })
          }
          return card
        })
        this.cards = cards
      })
    },
    oninput(e) {
      // 通过正则过滤小数点后两位
      e.target.value = e.target.value.match(/^\d*(\.?\d{0,2})/g)[0] || null
    },
    closeLastDate(date) {
      if (date === '') return ''
      const days = dateFns.differenceInDays(new Date(date), new Date())
      if (parseInt(days) >= 0 && parseInt(days) <= 3) {
        return {
          color: 'red',
          fontSize: '15px',
          'font-weight': 'bold'
        }
      }
    }
  },
  filters: {}
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
