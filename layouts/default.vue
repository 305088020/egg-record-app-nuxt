<template>
  <div class="main-container">
    <Layout class="main">
      <Sider v-model="collapsed" hide-trigger collapsible :width="256" :collapsed-width="64" class="left-sider">
        <SideMenu ref="sideMenu" accordion :collapsed="collapsed" :menu-list="menuList" :active-name="activeName" @on-select="handleSelectMenu">
          <div class="logo-con">
            <img v-show="!collapsed" key="max-logo" :src="maxLogo" />
            <img v-show="collapsed" key="min-logo" :src="minLogo" />
          </div>
        </SideMenu>
      </Sider>
      <Layout>
        <Header class="header-con">
          <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
            <user :user-avatar="userAvatar" />
            <fullscreen v-model="isFullscreen" style="margin-right: 10px;" />
          </header-bar>
        </Header>
        <Content class="main-content-con">
          <Layout class="main-layout-con">
            <div class="tag-nav-wrapper">
              <tags-nav :value="tagsValue" :list="tagNavList" @input="handleClick" @on-close="handleCloseTag" />
            </div>
            <Content class="content-wrapper">
              <nuxt></nuxt>
              <ABackTop :height="100" :bottom="80" :right="50" container=".content-wrapper"></ABackTop>
            </Content>
          </Layout>
        </Content>
      </Layout>
    </Layout>
    <dynamic-modal v-model="modalShow" :keys="dynamicKeys" @on-ok="gotoDynamicRoute"></dynamic-modal>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import minLogo from '../assets/images/logo-min.jpg'
import maxLogo from '../assets/images/logo.jpg'
import './default.less'
import { getNewTagList } from '../libs/meta'
import { extractDynamicKeys, extractDynamicPathFromRoute, replaceDynamic, routeEqual } from '../libs/utils'
import SideMenu from './elements/side-menu'
import HeaderBar from './elements/header-bar'
import TagsNav from './elements/tags-nav'
import fullscreen from './elements/fullscreen'
import user from './elements/user'
import DynamicModal from './elements/dynamic-modal'
import ABackTop from './elements/a-back-top'

export default {
  name: 'Default',

  components: {
    SideMenu,
    HeaderBar,
    fullscreen,
    user,
    DynamicModal,
    TagsNav,
    ABackTop
  },

  filters: {},

  props: {},

  data() {
    return {
      minLogo,
      maxLogo,
      isFullscreen: false,
      modalShow: false,
      dynamicKeys: [],
      selectedPath: null
    }
  },

  computed: {
    tagNavList() {
      return this.$store.state.app.tagNavList
    },
    userAvatar() {
      return this.$store.state.user.avatarImgPath
    },
    activeName() {
      return extractDynamicPathFromRoute(this.$route)
    },
    menuList() {
      return this.$store.getters['app/menuList']
    },
    // 当更改collapsed值后，store中值更改后，触发计算属性
    collapsed() {
      return this.$store.state.app.collapsed
    },
    tagsValue() {
      const path = extractDynamicPathFromRoute(this.$route)
      const name = path.split('/').pop()
      return {
        name,
        path
      }
    }
  },

  watch: {
    $route(newRoute) {
      if (newRoute.path === '/login') return
      this.addTag({ route: newRoute, type: 'push' })
      this.setBreadCrumb(newRoute)
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute))
    }
  },

  mounted() {
    this.setTagNavList()
    this.setHomeRoute()
    this.addTag({ route: this.$route })
    this.setBreadCrumb(this.$route)
    // 如果当前打开页面不在标签栏中，跳到homeName页
    if (!this.tagNavList.find(item => item.path === extractDynamicPathFromRoute(this.$route))) {
      this.$router.push({
        path: this.$config.homePath
      })
    }
  },

  methods: {
    ...mapMutations({
      addTag: 'app/addTag',
      setBreadCrumb: 'app/setBreadCrumb',
      setTagNavList: 'app/setTagNavList',
      setHomeRoute: 'app/setHomeRoute',
      closeTag: 'app/closeTag',
      setCollapsed: 'app/setCollapsed'
    }),

    handleSelectMenu(path) {
      this.selectedPath = path
      this.dynamicKeys = extractDynamicKeys(path)
      if (this.dynamicKeys && this.dynamicKeys.length > 0) {
        this.modalShow = true
      } else {
        this.turnToPage(path)
      }
    },
    gotoDynamicRoute(params) {
      this.turnToPage(this.selectedPath, params)
    },

    turnToPage(path, params) {
      if (path.indexOf('isTurnByHref_') > -1) {
        window.open(/^isTurnByHref_(.*)$/.exec(path)[1])
        return
      }
      if (params && Object.keys(params).length > 0) {
        // 动态路由
        path = replaceDynamic(path, params)
        this.$router.push({ path: path })
      } else {
        this.$router.push({ path: path })
      }
    },
    // 设备 store/app.js  中的收缩值，保存 localStorage中
    handleCollapsedChange(state) {
      this.setCollapsed(state)
    },
    handleClick(item) {
      this.turnToPage(item.path, item.params)
    },
    handleCloseTag(res, type, route) {
      if (type !== 'others') {
        if (type === 'all') {
          this.turnToPage(this.$config.homePath)
        } else if (routeEqual(this.$route, route)) {
          this.closeTag(route)
        }
      }
      this.setTagNavList(res)
    }
  }
}
</script>
