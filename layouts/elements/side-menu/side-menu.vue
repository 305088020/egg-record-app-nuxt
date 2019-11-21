<template>
  <div class="side-menu-wrapper">
    <slot></slot>
    <Menu
      v-show="!collapsed"
      ref="menu"
      :active-name="activeName"
      :open-names="openedNames"
      :accordion="accordion"
      :theme="theme"
      width="auto"
      @on-select="handleSelect"
    >
      <template v-for="item in menuList">
        <template v-if="item.children && item.children.length === 1">
          <side-menu-item v-if="showChildren(item)" :key="`menu-${item.path}`" :parent-item="item"></side-menu-item>
          <menu-item v-else :key="`menu-${item.children[0].path}`" :name="getNameOrHref(item, true)"
            ><common-icon :type="item.children[0].icon" /><span>{{ showTitle(item.children[0]) }}</span></menu-item
          >
        </template>
        <template v-else>
          <side-menu-item v-if="showChildren(item)" :key="`menu-${item.path}`" :parent-item="item"></side-menu-item>
          <menu-item v-else :key="`menu-${item.path}`" :name="getNameOrHref(item)"
            ><common-icon :type="item.icon" /><span class="no-tag">{{ showTitle(item) }}</span></menu-item
          >
        </template>
      </template>
    </Menu>
    <div v-show="collapsed" class="menu-collapsed" :list="menuList">
      <template v-for="item in menuList">
        <collapsed-menu
          v-if="item.children && item.children.length >= 1"
          :key="`drop-menu-${item.name}`"
          hide-title
          :root-icon-size="rootIconSize"
          :icon-size="iconSize"
          :theme="theme"
          :parent-item="item"
          @on-click="handleSelect"
        ></collapsed-menu>
        <Tooltip
          v-else
          :key="`drop-menu-${item.name}`"
          transfer
          :content="showTitle(item.children && item.children[0] ? item.children[0] : item)"
          placement="right"
        >
          <a class="drop-menu-a" :style="{ textAlign: 'center' }" @click="handleSelect(getNameOrHref(item))"
            ><common-icon :size="rootIconSize" :color="textColor" :type="item.icon || (item.children && item.children[0].icon)"
          /></a>
        </Tooltip>
      </template>
    </div>
  </div>
</template>
<script>
import './side-menu.less'
import { getUnion, getChildRoutesFromPath, extractDynamicPathFromRoute } from '../../../libs/utils'
import SideMenuItem from './side-menu-item'
import CollapsedMenu from './collapsed-menu'
import mixin from './mixin'

export default {
  name: 'IndexVue',

  components: {
    SideMenuItem,
    CollapsedMenu
  },

  filters: {},
  mixins: [mixin],

  props: {
    collapsed: { type: Boolean, default: false },
    theme: { type: String, default: 'dark' },
    activeName: { type: String, default: '' },
    accordion: Boolean,
    menuList: {
      type: Array,
      default() {
        return []
      }
    },
    rootIconSize: { type: Number, default: 20 },
    iconSize: { type: Number, default: 16 }
  },
  data() {
    const path = extractDynamicPathFromRoute(this.$route)
    const openedNames = getChildRoutesFromPath(path)
    return {
      openedNames: openedNames
    }
  },

  computed: {
    textColor() {
      return this.theme === 'dark' ? '#fff' : '#495060'
    }
  },

  watch: {
    activeName(name) {
      if (this.accordion) this.openedNames = this.getOpenedNamesByActiveName(name)
      else this.openedNames = getUnion(this.openedNames, this.getOpenedNamesByActiveName(name))
    },
    openedNames() {
      this.$nextTick(() => {
        // 手动更新展开的子目录
        this.$refs.menu.updateOpened()
      })
    },
    rootIconSize: {
      type: Number,
      default: 20
    }
  },

  mounted() {},

  methods: {
    getOpenedNamesByActiveName() {
      const path = extractDynamicPathFromRoute(this.$route)
      return getChildRoutesFromPath(path)
    },
    handleSelect(path) {
      this.$emit('on-select', path)
    }
  }
}
</script>
