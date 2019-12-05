<template>
  <div>
    <Card>
      <div class="search-con search-con-top">
        <Row type="flex" justify="end" class="code-row-bg">
          <Col>
            <Button class="search-btn" type="primary" @click="add"><Icon type="search" />&nbsp;&nbsp;新 增</Button>
            <Modal
              v-model="modal12"
              :title="title"
              :okText="okText"
              :mask-closable="false"
              :styles="{ top: '20px' }"
              @keydown.native.enter.prevent="save('formValidate')"
            >
              <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
                <FormItem label="Card：" prop="card_id">
                  <Select v-model="formValidate.card_id" @on-change="changeCard">
                    <Option v-for="item in cards" :key="item.id" :value="item.id">{{
                      ((item.person && item.person.name) || '') + '(' + item.code + ')-->' + item.bank.name
                    }}</Option>
                  </Select>
                </FormItem>
                <FormItem label="金额：" prop="record_amount">
                  <InputNumber
                    v-model="formValidate.record_amount"
                    :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                    :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                    style="width:200px"
                    placeholder="金额"
                  ></InputNumber>
                </FormItem>
                <FormItem label="手续费：" prop="record_handling_fee">
                  <InputNumber
                    :value="(formValidate.record_handling_fee = reversedMessage)"
                    :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                    :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                    style="width:200px"
                    placeholder="手续费"
                  ></InputNumber>
                </FormItem>
                <FormItem label="刷卡日期：" prop="record_day">
                  <DatePicker type="date" placeholder="刷卡日期" v-model="formValidate.record_day"></DatePicker>
                </FormItem>
                <FormItem label="最后还款日期：" prop="last_repayment_date">
                  <DatePicker type="date" placeholder="最后还款日期" v-model="formValidate.last_repayment_date"></DatePicker>
                </FormItem>
                <FormItem label="是否已还：" prop="is_flag">
                  <i-switch v-model="formValidate.is_flag" size="large">
                    <span slot="open">On</span>
                    <span slot="close">Off</span>
                  </i-switch>
                </FormItem>
                <FormItem label="备注：" prop="note">
                  <Input v-model="formValidate.note" placeholder="备注"></Input>
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
        <Table border stripe :columns="columns" :data="records">
          <template slot-scope="{ row }" slot="card">
            {{ row.card.person.name + '-' + row.card.bank.name + '-' + row.card.code }}
          </template>
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
import * as dateFns from 'date-fns'
import { index, create, show, update, destroy } from '@/api/creditCard/record'
import { index as cardIndex } from '@/api/creditCard/card'
export default {
  components: {},
  data() {
    return {
      formatNum: function(f, digit) {
        const m = Math.pow(10, digit)
        return parseInt(f * m, 10) / m
      },
      getLastDate(recordDay, bilDay, repayDay) {
        /* 1.得到刷卡日期的日
         *  2.如果 record_day < bilDay 说明在账单日在这月，
         *  3.record_day > bilDay 说明账单日在下月，
         *  4.月份加上repayDay可得到最后还款日
         */
        const year = new Date(recordDay).getFullYear()
        const month = new Date(recordDay).getMonth()
        const day = new Date(recordDay).getDate()
        let finalDate = ''
        if (parseInt(day) >= parseInt(bilDay)) {
          // 到下个月
          // 如果 bilDay > repayDay 就到下一月
          // 如果 bilDay < repayDay 就是这个月
          if (parseInt(bilDay) > parseInt(repayDay)) {
            //
            finalDate = new Date(year, month + 2, repayDay)
          } else {
            finalDate = new Date(year, month + 1, repayDay)
          }
        } else if (parseInt(bilDay) > parseInt(repayDay)) {
          //
          finalDate = new Date(year, month + 1, repayDay)
        } else {
          finalDate = new Date(year, month, repayDay)
        }
        // 这个月
        // 如果 bilDay > repayDay 就到下一月
        // 如果 bilDay < repayDay 就是这个月
        console.log(dateFns.format(finalDate, 'yyyy-MM-dd'))
        return dateFns.format(finalDate, 'yyyy-MM-dd')
        // return finalDate.getFullYear() + '-' + (finalDate.getMonth() + 1) + '-' + finalDate.getDate()
      },
      columns: [
        {
          title: 'card',
          slot: 'card'
        },
        {
          title: '金额',
          key: 'record_amount'
        },
        {
          title: '手续费',
          key: 'record_handling_fee'
        },
        {
          title: '刷卡日期',
          key: 'record_day'
        },
        {
          title: '是否已还',
          key: 'is_flag'
        },
        {
          title: 'note',
          key: 'note'
        },
        {
          title: '最后还款日期',
          key: 'last_repayment_date'
        },
        {
          title: '操作',
          slot: 'action',
          width: 150,
          align: 'center'
        }
      ],
      cards: [],
      modal12: false,
      title: '',
      okText: '',
      type: '',
      formValidate: {
        card_id: '',
        record_amount: 0.0,
        record_handling_fee: 0.0,
        record_day: '',
        is_flag: false,
        note: '',
        last_repayment_date: ''
      },
      ruleValidate: {
        // person_id: [{ required: true, message: 'person不可为空！', trigger: 'change', type: 'number' }],
      },
      feilv: 0
    }
  },
  async asyncData({ context }) {
    const cards = await cardIndex()

    const records = await index()
    return { records, cards }
  },
  computed: {
    // 计算属性的 getter
    reversedMessage: {
      get: function() {
        // `this` 指向 vm 实例
        return this.formatNum(this.formValidate.record_amount * (this.feilv / 100), 2)
      },
      set: function(newValue) {
        // this.formValidate.record_amount = newValue / 0.053
      }
    }
  },
  methods: {
    add() {
      this.type = 'add'
      this.title = '新 增'
      this.okText = '保 存'
      this.modal12 = true
      this.formValidate.card_id = ''
      this.formValidate.record_amount = 0
      this.formValidate.record_handling_fee = 0
      this.formValidate.record_day = new Date()
      this.formValidate.last_repayment_date = new Date()
      this.formValidate.is_flag = false
      this.formValidate.note = ''
      this.formValidate.created_at = new Date()
      this.feilv = 0
    },
    edit(id) {
      this.type = 'edit'
      this.title = '更 新'
      this.okText = '保 存'
      this.modal12 = true
      //
      show(id).then(response => {
        this.formValidate.id = response.id
        this.formValidate.card_id = response.card_id
        this.formValidate.record_amount = Number(response.record_amount) || 0
        this.formValidate.record_handling_fee = Number(response.record_handling_fee) || 0
        this.formValidate.record_day = response.record_day
        this.formValidate.last_repayment_date = response.last_repayment_date
        this.formValidate.is_flag = response.is_flag
        this.formValidate.note = response.note || ''
        this.feilv = response.card.interest || 0
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
              if (response) {
                this.show()
                this.$Message.success('更新成功!')
                this.modal12 = false
              }
            })
          }
        }
      })
    },
    show() {
      index().then(response => {
        this.records = response
      })
    },
    oninput(e) {
      // 通过正则过滤小数点后两位
      e.target.value = e.target.value.match(/^\d*(\.?\d{0,2})/g)[0] || null
    },
    changeCard(value) {
      if (value !== undefined) {
        const selectCard = this.cards.find(card => {
          return card.id === value
        })
        this.feilv = selectCard.interest
        // 最后还款日期
        const lastdate = this.getLastDate(this.formValidate.record_day, selectCard.billing_day, selectCard.repayment_day)
        this.formValidate.last_repayment_date = lastdate
      }
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
