<template>
  <Submenu :name="`${parentName}`">
    <template slot="title">
      <common-icon :type="parentItem.icon" />
      <span>{{ showTitle(parentItem) }}</span>
    </template>
    <template v-for="item in children">
      <template v-if="item.children && item.children.length === 1">
        <side-menu-item v-if="showChildren(item)" :key="`menu-${item.path}`" :parent-item="item"></side-menu-item>
        <menu-item v-else :key="`menu-${item.children[0].path}`" :name="getNameOrHref(item, true)"
          ><common-icon :type="item.children[0].icon" /><span>{{ showTitle(item.children[0]) }}</span></menu-item
        >
      </template>
      <template v-else>
        <side-menu-item v-if="showChildren(item)" :key="`menu-${item.path}`" :parent-item="item"></side-menu-item>
        <menu-item v-if="!showChildren(item)" :key="`menu-${item.path}`" :name="getNameOrHref(item)">
          <common-icon :type="item.icon" /><span>{{ showTitle(item) }}</span>
        </menu-item>
      </template>
    </template>
  </Submenu>
</template>

<style lang="less">
.popCon {
}
</style>

<script>
import mixin from './mixin'
import itemMixin from './item-mixin'
export default {
  name: 'SideMenuItem',
  mixins: [mixin, itemMixin],
  data() {
    return {
      visible: false
    }
  }
}
</script>
