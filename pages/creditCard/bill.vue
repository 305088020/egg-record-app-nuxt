<template>
  <div>
    <Card>
      <div class="search-con search-con-top">
        <Row type="flex" justify="end" class="code-row-bg">
          <Col>
            <Button class="search-btn" type="primary"><Icon type="search" />&nbsp;&nbsp;新 增</Button>
          </Col>
        </Row>
      </div>
      <div>
        <Table border stripe :columns="columns" :data="bills">
          <template slot-scope="{ row }" slot="card">
            {{ row.card.person.name + '-' + row.card.bank.name + '-' + row.card.code }}
          </template>
          <template slot-scope="{ row }" slot="startDate">
            {{ row.startDate | dateformat('YYYY-MM-DD') }}
          </template>
          <template slot-scope="{ row }" slot="endDate">
            {{ row.endDate | dateformat('YYYY-MM-DD') }}
          </template>
          <template slot-scope="{ row }" slot="billDate">
            {{ row.billDate | dateformat('YYYY-MM-DD') }}
          </template>
          <template slot-scope="{ row }" slot="repayDate">
            {{ row.repayDate | dateformat('YYYY-MM-DD') }}
          </template>
        </Table>
      </div>
    </Card>
  </div>
</template>

<script>
import { index } from '@/api/creditCard/bill'
export default {
  components: {},
  data() {
    return {
      columns: [
        {
          title: 'card',
          slot: 'card'
        },
        {
          title: 'code',
          key: 'code'
        },
        {
          title: '开始日期',
          slot: 'startDate'
        },
        {
          title: '结束日期',
          slot: 'endDate'
        },
        {
          title: '账单日期',
          slot: 'billDate'
        },
        {
          title: '还款日期',
          slot: 'repayDate'
        },
        {
          title: '金额',
          key: 'amount'
        },
        {
          title: '已还金额',
          key: 'incomeAmount'
        }
      ],
      bills: []
    }
  },
  async asyncData({ context }) {
    const bills = await index()
    return { bills }
  },
  methods: {
    show() {
      index().then(response => {
        this.bills = response
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
