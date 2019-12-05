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
        <Table border stripe :columns="columns" :data="flows">
          <template slot-scope="{ row }" slot="card">
            {{ row.card.person.name + '-' + row.card.bank.name + '-' + row.card.code }}
          </template>
          <template slot-scope="{ row }" slot="amount"> $ {{ row.amount }} </template>
          <template slot-scope="{ row }" slot="direction">
            <div>
              <Tag v-if="row.direction === '+'" color="success">还 款</Tag>
              <Tag v-if="row.direction === '-'" color="error">消 费</Tag>
            </div>
          </template>
        </Table>
      </div>
    </Card>
  </div>
</template>

<script>
import { index } from '@/api/creditCard/flow'
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
          title: '金额',
          slot: 'amount'
        },
        {
          title: 'direction',
          slot: 'direction',
          align: 'center'
        },
        {
          title: '日期',
          key: 'tradeTime'
        }
      ],
      flows: []
    }
  },
  async asyncData({ context }) {
    const flows = await index()
    return { flows }
  },
  methods: {
    show() {
      index().then(response => {
        this.flows = response
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
