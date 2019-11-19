<template>
  <div class="layout">
    <Layout style="height: 100%" class="main">
      <Sider
        ref="side1"
        hide-trigger
        collapsible
        :collapsed-width="78"
        v-model="isCollapsed"
      >
        <side-menu accordion ref="sideMenu" :active-name="$route.name" :collapsed="collapsed" @on-select="turnToPage" :menu-list="menuList">
        <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
        <div class="logo-con">
          <img v-show="!collapsed" :src="maxLogo" key="max-logo" />
          <img v-show="collapsed" :src="minLogo" key="min-logo" />
        </div>
      </side-menu>
        <Icon type="logo-apple" />
        <Button type="primary" long>Primary</Button>
        <Menu
          active-name="1-2"
          theme="dark"
          width="auto"
          :class="menuitemClasses"
        >
          <MenuItem
            v-for="(item, key) of items"
            :to="item.to"
            :key="key"
            :name="key"
          >
            <Icon :type="item.icon"></Icon>
            <span>{{ item.title }}</span>
          </MenuItem>
        </Menu>
      </Sider>
      <Layout>
        <Header :style="{ padding: 0 }" class="layout-header-bar">
          <Icon
            @click.native="collapsedSider"
            :class="rotateIcon"
            :style="{ margin: '0 20px' }"
            type="md-menu"
            size="24"
          ></Icon>
        </Header>
        <Content
          :style="{ margin: '20px', background: '#fff', minHeight: '260px' }"
        >
          <nuxt />
        </Content>
      </Layout>
    </Layout>
  </div>
</template>

<style scoped>
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.layout-header-bar {
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}
.layout-logo-left {
  width: 90%;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  margin: 15px auto;
}
.menu-icon {
  transition: all 0.3s;
}
.rotate-icon {
  transform: rotate(-90deg);
}
.menu-item span {
  display: inline-block;
  overflow: hidden;
  width: 69px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width 0.2s ease 0.2s;
}
.menu-item i {
  transform: translateX(0px);
  transition: font-size 0.2s ease, transform 0.2s ease;
  vertical-align: middle;
  font-size: 16px;
}
.collapsed-menu span {
  width: 0px;
  transition: width 0.2s ease;
}
.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
  vertical-align: middle;
  font-size: 22px;
}
</style>
<script>
export default {
  data() {
    return {
      items: [
        {
          title: 'Home',
          icon: 'ios-navigate',
          to: { name: 'index' }
        },
        {
          title: '用户',
          icon: 'ios-navigate',
          to: { name: 'person' }
        },
        {
          title: '银行',
          icon: 'ios-navigate',
          to: { name: 'bank' }
        },
        {
          title: '信用卡',
          icon: 'ios-navigate',
          to: { name: 'card' }
        },
        {
          title: '记录',
          icon: 'ios-navigate',
          to: { name: 'record' }
        },
        {
          title: 'Home',
          icon: 'ios-navigate',
          to: { name: 'index' }
        },
        {
          title: '用户',
          icon: 'ios-navigate',
          to: { name: 'person' }
        },
        {
          title: '银行',
          icon: 'ios-navigate',
          to: { name: 'bank' }
        },
        {
          title: '信用卡',
          icon: 'ios-navigate',
          to: { name: 'card' }
        },
        {
          title: '记录',
          icon: 'ios-navigate',
          to: { name: 'record' }
        },
        {
          title: 'Home',
          icon: 'ios-navigate',
          to: { name: 'index' }
        },
        {
          title: '用户',
          icon: 'ios-navigate',
          to: { name: 'person' }
        },
        {
          title: '银行',
          icon: 'ios-navigate',
          to: { name: 'bank' }
        },
        {
          title: '信用卡',
          icon: 'ios-navigate',
          to: { name: 'card' }
        },
        {
          title: '记录',
          icon: 'ios-navigate',
          to: { name: 'record' }
        }
      ],
      isCollapsed: false
    }
  },
  computed: {
    rotateIcon() {
      return ['menu-icon', this.isCollapsed ? 'rotate-icon' : '']
    },
    menuitemClasses() {
      return ['menu-item', this.isCollapsed ? 'collapsed-menu' : '']
    }
  },
  methods: {
    collapsedSider() {
      this.$refs.side1.toggleCollapse()
    }
  }
}
</script>
