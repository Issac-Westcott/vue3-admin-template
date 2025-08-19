<template>
  <div :class="classObj" class="layout-wrapper">
    <!--left side-->
    <Sidebar v-if="settings.showLeftMenu" class="sidebar-container" />
    <!--fixed top navbar-->
    <Navbar v-if="settings.showTopNavbar" class="fixed-navbar" />
    <!--fixed tags view-->
    <TagsView v-if="settings.showTagsView" class="fixed-tags-view" />
    <!--right container-->
    <div class="main-container">
      <AppMain />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import Sidebar from './sidebar/index.vue'
import AppMain from './app-main/index.vue'
import Navbar from './app-main/Navbar.vue'
import TagsView from './app-main/TagsView.vue'
import { useBasicStore } from '@/store/basic'
import { resizeHandler } from '@/hooks/use-layout'
const { sidebar, settings } = useBasicStore()
const classObj = computed(() => {
  return {
    closeSidebar: !sidebar.opened,
    hideSidebar: !settings.showLeftMenu
  }
})
resizeHandler()
</script>

<style lang="scss" scoped>
.fixed-navbar {
  position: fixed;
  top: 0;
  right: 0;
  left: var(--side-bar-width);
  z-index: 1000;
  transition: left var(--sideBar-switch-duration);
}

.fixed-tags-view {
  position: fixed;
  top: var(--nav-bar-height);
  right: 0;
  left: var(--side-bar-width);
  z-index: 999;
  transition: left var(--sideBar-switch-duration);
}

.main-container {
  min-height: 100%;
  transition: margin-left var(--sideBar-switch-duration);
  margin-left: var(--side-bar-width);
  position: relative;
  padding-top: calc(var(--nav-bar-height) + var(--tag-view-height));
}
.sidebar-container {
  transition: width var(--sideBar-switch-duration);
  width: var(--side-bar-width) !important;
  background-color: var(--el-menu-bg-color);
  height: 100%;
  position: fixed;
  font-size: 0;
  top: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  border-right: 0.5px solid var(--side-bar-border-right-color);
}
.closeSidebar {
  .sidebar-container {
    width: 54px !important;
  }
  .main-container {
    margin-left: 54px !important;
  }
  .fixed-navbar {
    left: 54px !important;
  }
  .fixed-tags-view {
    left: 54px !important;
  }
}
.hideSidebar {
  .sidebar-container {
    width: 0 !important;
  }
  .main-container {
    margin-left: 0;
  }
  .fixed-navbar {
    left: 0 !important;
  }
  .fixed-tags-view {
    left: 0 !important;
  }
}
</style>
